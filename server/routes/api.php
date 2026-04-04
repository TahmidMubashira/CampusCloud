<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\RewardController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::get('/resources', [ResourceController::class, 'index']);
Route::get('/departments', [ResourceController::class, 'getDepartments']);
Route::get('/courses/{department_id}', [ResourceController::class, 'getCourses']);

Route::post('/admin/login', [AdminController::class, 'login']);


// Admin protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/admin/logout',          [AdminController::class, 'logout']);
    Route::get('/admin/pending',          [AdminController::class, 'pending']);
    Route::get('/admin/stats',            [AdminController::class, 'stats']);
    Route::put('/admin/approve/{id}',     [AdminController::class, 'approve']);
    Route::put('/admin/reject/{id}',      [AdminController::class, 'reject']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
    Route::post('/resources/upload', [ResourceController::class, 'store']);
    Route::get('/download/{id}', [ResourceController::class, 'download']);
    
    // Reward routes
    Route::get('/rewards', [RewardController::class, 'index']);
    Route::get('/my-rewards', [RewardController::class, 'getUserRewards']);
});






/*Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});*/