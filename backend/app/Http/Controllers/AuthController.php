<?php

namespace App\Http\Controllers;

use App\Models\LoginLog;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\CreateDataRequest;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Services\AuthService;


class AuthController extends Controller
{
    // use ResponseTrait;
    public function register(CreateDataRequest $request)
    {
        $registerUser = new AuthService();
        $user = $registerUser->registerUser($request);

        return $this->successResponse($user);
    }

    public function login(LoginRequest $request)
    {
        $loginUsers = new AuthService();

        $user = $loginUsers->loginUser($request);

        $this->logLoginActivity($user, $request);

        return $this->successResponse($user,200);
    }

    public function logout(Request $request)
    {
        
        $user = new AuthService();
        $user->logout($request);   

        return $this->successResponse($user, 200);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    protected function logLoginActivity(User $user, Request $request)
    {
        $ip = $request->ip();
        $location = $this->getLocationFromIp($ip);

        LoginLog::create([
            'user_id' => $user->id,
            'ip_address' => $ip,
            'user_agent' => $request->userAgent(),
            'location' => $location,
            'login_at' => now(),
        ]);
    }

    protected function getLocationFromIp($ip)
    {
        if ($ip === '127.0.0.1') return 'Localhost';

        try {
            $response = Http::get("https://ipinfo.io/{$ip}/json?token=YOUR_FREE_TOKEN");
            
            if ($response->successful()) {
                $data = $response->json();
                // return implode(', ', array_filter([
                //     $data['city'] ?? null,
                //     $data['region'] ?? null,  // Note: 'region' instead of 'regionName'
                //     $data['country'] ?? null
                // ]));
                return $data;
            }
        } catch (\Exception $e) {
            \Log::error("IPinfo.io failed: ".$e->getMessage());
        }
        
        return 'Unknown';
    }
}