<?php

namespace App\Traits;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

trait ResponseTrait
{
    //traits are methods that are accessible in all classes
    public function success($data, $code = 200)
    {
        return successResponse()->json([
            'status' => 'success',
            'payload' => $data,
        ], $code);
    }

    public function errorResponse($data, $code)
    {
        return response()->json([
            'status' => false,
            'error' => 'error',
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
