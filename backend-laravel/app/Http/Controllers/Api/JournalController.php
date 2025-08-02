<?php

namespace App\Http\Controllers\Api;

use App\Models\Journal;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class JournalController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->user()->journals()->latest();

        // Add filtering options
        if ($request->has('date_from')) {
            $query->where('created_at', '>=', Carbon::parse($request->date_from));
        }

        if ($request->has('date_to')) {
            $query->where('created_at', '<=', Carbon::parse($request->date_to));
        }

        if ($request->has('mood')) {
            $query->where('mood', $request->mood);
        }

        return response()->json([
            'data' => $query->paginate(10),
            'message' => 'Journals retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:5000',
            'mood' => 'nullable|string|in:happy,sad,angry,anxious,excited,calm,stressed,grateful',
            'ai_response' => 'nullable|string',
        ]);

        $journal = $request->user()->journals()->create([
            'title' => $request->title,
            'content' => $request->content,
            'mood' => $request->mood,
            'ai_response' => $request->ai_response,
        ]);

        return response()->json([
            'data' => $journal,
            'message' => 'Journal created successfully'
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $journal = $request->user()->journals()->findOrFail($id);
        
        return response()->json([
            'data' => $journal,
            'message' => 'Journal retrieved successfully'
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string|max:5000',
            'mood' => 'nullable|string|in:happy,sad,angry,anxious,excited,calm,stressed,grateful',
        ]);

        $journal = $request->user()->journals()->findOrFail($id);
        $journal->update($request->only(['title', 'content', 'mood']));

        return response()->json([
            'data' => $journal,
            'message' => 'Journal updated successfully'
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $journal = $request->user()->journals()->findOrFail($id);
        $journal->delete();

        return response()->json([
            'message' => 'Journal deleted successfully'
        ]);
    }

    public function stats(Request $request)
    {
        $user = $request->user();
        $totalEntries = $user->journals()->count();
        $thisMonth = $user->journals()
            ->whereMonth('created_at', now()->month)
            ->count();
        
        $moodStats = $user->journals()
            ->whereNotNull('mood')
            ->selectRaw('mood, COUNT(*) as count')
            ->groupBy('mood')
            ->pluck('count', 'mood');

        return response()->json([
            'data' => [
                'total_entries' => $totalEntries,
                'entries_this_month' => $thisMonth,
                'mood_distribution' => $moodStats,
                'streak_days' => $this->calculateStreak($user),
            ],
            'message' => 'Statistics retrieved successfully'
        ]);
    }

    private function calculateStreak($user)
    {
        $entries = $user->journals()
            ->selectRaw('DATE(created_at) as date')
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->pluck('date');

        $streak = 0;
        $currentDate = now()->toDateString();

        foreach ($entries as $entryDate) {
            if ($entryDate === $currentDate) {
                $streak++;
                $currentDate = Carbon::parse($currentDate)->subDay()->toDateString();
            } else {
                break;
            }
        }

        return $streak;
    }
}