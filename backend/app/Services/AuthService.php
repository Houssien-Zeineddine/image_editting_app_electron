<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Create a new class instance.
     */

    public function registerUser (Request $request) {
        $user = new User; 
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);
        $user->save();
        //return $user->save();

        return $user; //returned this way because the above line returns a boolean
    }

    public function loginUser (Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) { //auth::attempt is a method of the Auth facade that checks if the user exists in the database and if the password is correct
            throw ValidationException::withMessages([ 
                'email' => ['The provided credentials are incorrect.'], //if throw validation exception, the function will stop executing and return a 422 error
            ]);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken; //createtoken is a method of the User model that saves the token in the database automatically
        $user->access_token = $token;

        return $user;
    }
}
