<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!$request->user()) {
            return response()->json([
                'thanh_cong' => false,
                'thong_bao' => 'Không có quyền truy cập'
            ], 401);
        }

        foreach ($roles as $role) {
            if ($request->user()->hasRole($role)) {
                return $next($request);
            }
        }

        return response()->json([
            'thanh_cong' => false,
            'thong_bao' => 'Không có quyền truy cập'
        ], 403);
    }
}