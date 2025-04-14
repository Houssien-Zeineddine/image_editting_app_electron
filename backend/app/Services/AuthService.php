<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Controller;

class AuthService extends Controller
{
    /**
     * Create a new class instance.
     */

    public function registerUser (Request $request) {
        if ($request->password !== $request->password_confirmation) {
            throw ValidationException::withMessages([
                'password' => ['The provided password does not match.'],
            ]);
        }

        $user = new User; 
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = $request->password;
        $user->save();
        //return $user->save();

        return $user; //returned this way because the above line returns a boolean
    }

    public function loginUser (Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) { 
            return $this->errorResponse('Invalid credentials', 422);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken; //createtoken is a method of the User model that saves the token in the database automatically
        $user->access_token = $token;

        return $user;
    }

    public function logout (Request $request) {
        $user = Auth::user();
        $user->tokens()->delete();

        return $user;
    }
}
