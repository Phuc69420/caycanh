<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class DiaChiController extends Controller
{
    public function layTinhThanh()
    {
        $response = Http::withoutVerifying()->get('https://provinces.open-api.vn/api/p/');
            \Log::info('Dữ liệu tỉnh lấy được:', $response->json()); 
        return response()->json($response->json());
    }

    public function layQuanHuyen($maTinh)
    {
        $response = Http::withoutVerifying()->get("https://provinces.open-api.vn/api/p/{$maTinh}?depth=2");
        $data = $response->json();
        \Log::info('Dữ liệu quận/huyện lấy được:', $response->json()); 
        return response()->json($data['districts'] ?? []);
    }

    public function layPhuongXa($maHuyen)
    {
        $response = Http::withoutVerifying()->get("https://provinces.open-api.vn/api/d/{$maHuyen}?depth=2");
        $data = $response->json();
        return response()->json($data['wards'] ?? []);
    }
}
