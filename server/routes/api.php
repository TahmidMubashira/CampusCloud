<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\ResourceController;

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
Route::post('/resources/upload', [ResourceController::class, 'upload']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
});

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/session', [SessionController::class, 'getSession']);
Route::post('/session', [SessionController::class, 'createSession'])->middleware('check.admin');
Route::put('/session', [SessionController::class, 'updateSession'])->middleware('check.admin');
Route::post('/sessions', [SessionController::class, 'viewSessions'])->middleware('check.admin');
Route::post('/attendance', [SessionController::class, 'submitAttendance']);