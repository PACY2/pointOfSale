<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    public function auth(AuthRequest $request)
    {
        $validated = $request->validated();

        $email = $validated["email"];
        $password = $validated["password"];

        $user = User::where("email", $email)->first();

        if (!Hash::check($password, $user->password)) {
            return response([
                "message" => "The email or password entered is incorrect."
            ], 400);
        }

        $token = $user->createToken("auth")->plainTextToken;

        return response([
            "user" => $user,
            "token" => $token
        ], 200);
    }

    public function logout(Request $request)
    {
        $user = User::find(auth("sanctum")->user()->id);
        $user->tokens()->delete();
    }

    // get authenticated user profile
    public function profile()
    {
        return auth("sanctum")->user();
    }
}
