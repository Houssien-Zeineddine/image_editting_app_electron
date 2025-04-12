<?php

namespace App\Http\Controllers;

use App\Models\LoginLog;
use App\Models\User;
use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\CreateDataRequest;
use App\Services\AuthService;
// use App\Traits\ResponseTrait;

class AuthController extends Controller
{
    // use ResponseTrait;
    public function register(Request $request)
    {
        $registerUser = new AuthService();
        $user = $registerUser->registerUser($request);

        return $this->successResponse($user);
        
        // // Check if the email is already registered
        // if (User::where('email', $request->email)->exists()) {
        //     return response()->json([
        //         'message' => 'Email already registered',
        //     ], 422);
        // }

        // $user = new User; 
        // $user->name = $request->name;
        // $user->email = $request->email;
        // $user->password = bcrypt($request->password);
        // $user->save();

        // if ($user){
        //     return $this->successResponse($user);
        // } else {
        //     return $this->errorResponse('Registeration failed', 422); //422 means unprocessable entity which means the request was well formed but the server was unable to process it
        // }

        // return response()->json([
        //     'message' => 'User registered successfully',
        //     'user' => $user,
        // ], 201);
    }

    public function login(Request $request)
    {
        $loginUsers = new AuthService();

        $user = $loginUsers->loginUser($request);

        return $this->successResponse($user,200);

        // if($user) {
        //     return $this->successResponse($user);
        // } else {
        //     return $this->errorResponse('Login failed', 422);
        // }

        // $request->validate([
        //     'email' => 'required|string|email',
        //     'password' => 'required|string',
        // ]);

        /* if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = $request->user();
        $token = $user->createToken('auth_token')->plainTextToken; */

        // Log login activity
        // $this->logLoginActivity($user, $request);

        //below iam returning the user object inside an array that is why it was not accessible on the frontend
        // return response()->json([
        //     $user
        // ]);

        // return response()->json([
        //     'message' => 'Login successful',
        //     'user' => $user,
        // ], 200);
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