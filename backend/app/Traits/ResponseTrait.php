<?php

namespace App\Traits;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

trait ResponseTrait
{
    //traits are methods that are accessible in all classes
    public function successResponse($data, $code = 200)
    {
        return response()->json([
            'status' => 'success',
            'payload' => $data,
        ], $code);
    }

    public function errorResponse($data, $code)
    {
        return response()->json([
            'status' => 'error',
            'payload' => $data,
        ], $code);
    }

    public function failedValidation(Validator $validator) {
        $response = response()->json([
            'status' => false,
            'error' => $validator->errors(),
        ], 422);

        throw new HttpResponseException($response);
    }
}
