<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\RewardController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ── Public Routes (no auth required) ─────────────────────────────────────────

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Resources (public - only approved resources shown)
Route::get('/resources',                [ResourceController::class, 'index']);
Route::get('/departments', [ResourceController::class, 'departments']);
Route::get('/courses/{department_id}', [ResourceController::class, 'courses']);

// Admin login (public)
Route::post('/admin/login', [AdminController::class, 'login']);


// ── Protected Routes (auth required) ─────────────────────────────────────────

Route::middleware('auth:sanctum')->group(function () {

    // ── User Auth ─────────────────────────────────────────────────────────────
    Route::post('/logout',  [AuthController::class, 'logout']);
    Route::get('/me',       [AuthController::class, 'me']);

    // ── Resources ─────────────────────────────────────────────────────────────
    Route::post('/resources/upload',    [ResourceController::class, 'store']);
    Route::get('/download/{id}',        [ResourceController::class, 'download']);

    // ── Rewards ───────────────────────────────────────────────────────────────
    Route::get('/rewards',              [RewardController::class, 'index']);
    Route::get('/my-rewards',           [RewardController::class, 'getUserRewards']);

    // ── Admin ─────────────────────────────────────────────────────────────────
    Route::post('/admin/logout',        [AdminController::class, 'logout']);
    Route::get('/admin/stats',          [AdminController::class, 'stats']);
    Route::get('/admin/pending',        [AdminController::class, 'pending']);
    Route::put('/admin/approve/{id}',   [AdminController::class, 'approve']);
    Route::put('/admin/reject/{id}',    [AdminController::class, 'reject']);

    // ── Profile ───────────────────────────────────────────────────────────────
    Route::get('/profile/stats', [ProfileController::class, 'stats']);

});