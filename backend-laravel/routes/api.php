<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JournalController;
use App\Http\Controllers\Api\AIController;

Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (requires auth token)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Journal routes
    Route::get('/journals', [JournalController::class, 'index']);
    Route::post('/journals', [JournalController::class, 'store']);
    Route::get('/journals/{id}', [JournalController::class, 'show']);
    Route::put('/journals/{id}', [JournalController::class, 'update']);
    Route::delete('/journals/{id}', [JournalController::class, 'destroy']);
    Route::get('/journals/stats/summary', [JournalController::class, 'stats']);
    
    // AI routes
    Route::post('/journals/analyze', [AIController::class, 'analyze']);
});