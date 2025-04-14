<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ImageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::group(["prefix" => "v0.1"], function () {
    
    //login and register public routes, no need for authentication
    Route::group(["prefix" => "guest"], function(){
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
    });
    Route::middleware('auth:sanctum')->group(function () {
        Route::group(["prefix" => "user"], function(){
            // Authentication routes
            Route::post('/logout', [AuthController::class, 'logout']);

            // Image routes
            // Route::get('/images', [ImageController::class, 'index']);
            // Route::post('/images', [ImageController::class, 'store']);
            // Route::get('/images/{image}', [ImageController::class, 'show']);
            // Route::put('/images/{image}', [ImageController::class, 'update']);
            // Route::delete('/images/{image}', [ImageController::class, 'destroy']);
        });
    });
});