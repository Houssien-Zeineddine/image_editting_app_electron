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
        try {
            // Using ip-api.com (free service)
            $response = Http::get("http://ip-api.com/json/{$ip}?fields=country,regionName,city");
            
            if ($response->successful()) {
                $data = $response->json();
                if ($data['status'] !== 'fail') {
                    return implode(', ', array_filter([
                        $data['city'] ?? null,
                        $data['regionName'] ?? null,
                        $data['country'] ?? null,
                    ]));
                }
            }
        } catch (\Exception $e) {
            // Silently fail if the service is unavailable
        }

        return 'Unknown location';
    }
}