<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class AIController extends Controller
{
    public function analyze(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:5000',
        ]);

        $text = $request->content;
        $cacheKey = 'ai_analysis_' . md5($text);

        $analysis = Cache::remember($cacheKey, 3600, function () use ($text) {
            return $this->performAIAnalysis($text);
        });

        return response()->json([
            'content' => $text,
            'ai_response' => $analysis['response'],
            'sentiment' => $analysis['sentiment'],
            'keywords' => $analysis['keywords'],
            'suggested_mood' => $analysis['suggested_mood'],
        ]);
    }

    private function performAIAnalysis($text)
    {
        $apiKey = config('services.openrouter.key');
        $referer = config('services.openrouter.referer') ?? 'http://localhost';

        if (!$apiKey) {
            return $this->mockAnalysis($text);
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'HTTP-Referer' => $referer,
                'Content-Type' => 'application/json',
            ])->post('https://openrouter.ai/api/v1/chat/completions', [
                'model' => 'mistralai/mistral-7b-instruct',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a supportive and empathetic mental health journaling assistant. You respond with warmth, compassion, and insightful reflections.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $text
                    ]
                ],
                'max_tokens' => 300,
                'temperature' => 0.7,
            ]);

            $result = $response->json();

            if (isset($result['choices'][0]['message']['content'])) {
                $aiResponse = $result['choices'][0]['message']['content'];
            } else {
                return $this->mockAnalysis($text);
            }

        } catch (\Exception $e) {
            return $this->mockAnalysis($text);
        }

        $sentiment = $this->analyzeSentiment($text);
        $keywords = $this->extractKeywords($text);
        $suggestedMood = $this->suggestMood($text, $sentiment);

        return [
            'response' => $aiResponse,
            'sentiment' => $sentiment,
            'keywords' => $keywords,
            'suggested_mood' => $suggestedMood,
        ];
    }

    private function mockAnalysis($text)
    {
        $sentiment = $this->analyzeSentiment($text);
        $keywords = $this->extractKeywords($text);
        $suggestedMood = $this->suggestMood($text, $sentiment);
        $mockResponse = $this->generateMockResponse($text, $sentiment);

        return [
            'response' => $mockResponse,
            'sentiment' => $sentiment,
            'keywords' => $keywords,
            'suggested_mood' => $suggestedMood,
        ];
    }

    private function analyzeSentiment($text)
    {
        $positiveWords = ['happy', 'joy', 'excited', 'great', 'amazing', 'wonderful', 'love', 'grateful'];
        $negativeWords = ['sad', 'angry', 'frustrated', 'terrible', 'awful', 'hate', 'depressed', 'anxious'];

        $text = strtolower($text);
        $positiveCount = 0;
        $negativeCount = 0;

        foreach ($positiveWords as $word) {
            $positiveCount += substr_count($text, $word);
        }

        foreach ($negativeWords as $word) {
            $negativeCount += substr_count($text, $word);
        }

        if ($positiveCount > $negativeCount) {
            return 'positive';
        } elseif ($negativeCount > $positiveCount) {
            return 'negative';
        } else {
            return 'neutral';
        }
    }

    private function extractKeywords($text)
    {
        $words = str_word_count(strtolower($text), 1);
        $stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];

        $filteredWords = array_diff($words, $stopWords);
        $wordCount = array_count_values($filteredWords);
        arsort($wordCount);

        return array_slice(array_keys($wordCount), 0, 5);
    }

    private function suggestMood($text, $sentiment)
    {
        $moodMap = [
            'positive' => ['happy', 'excited', 'grateful', 'calm'],
            'negative' => ['sad', 'angry', 'anxious', 'stressed'],
            'neutral' => ['calm', 'grateful']
        ];

        $possibleMoods = $moodMap[$sentiment];
        return $possibleMoods[array_rand($possibleMoods)];
    }

    private function generateMockResponse($text, $sentiment)
    {
        $responses = [
            'positive' => [
                "It's wonderful to see the positivity in your writing!",
                "Your optimistic outlook shines through.",
                "This entry reflects a healthy mindset."
            ],
            'negative' => [
                "I hear that you're going through a difficult time.",
                "It takes courage to express these emotions.",
                "Thank you for sharing these honest feelings."
            ],
            'neutral' => [
                "Your reflection shows thoughtful consideration.",
                "This balanced perspective is valuable.",
                "Your journaling helps you process your thoughts."
            ]
        ];

        $responseArray = $responses[$sentiment];
        return $responseArray[array_rand($responseArray)];
    }
}
