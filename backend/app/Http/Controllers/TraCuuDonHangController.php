<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DonDatHang;

class TraCuuDonHangController extends Controller
{
    public function traCuu(Request $request)
    {
        $query = $request->input('query');

        if (!$query) {
            return response()->json(['error' => 'Vui lòng nhập email hoặc số điện thoại'], 400);
        }

        // Sửa tên quan hệ thành đúng: chiTietDonHang (theo model)
        $donHangs = DonDatHang::with(['chiTietDonHang.sanPham'])
            ->where('email_kh', $query)
            ->orWhere('sdt_kh', $query)
            ->orderBy('ngay_dat_hang', 'desc')
            ->get();

        if ($donHangs->isEmpty()) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng nào'], 404);
        }

        $data = $donHangs->map(function ($donHang) {
            return [
                'ma_don_hang' => $donHang->ma_don_hang,
                'trang_thai' => $donHang->trang_thai ?? 'chờ xử lý',
                'san_pham' => $donHang->chiTietDonHang->map(function ($chiTiet) {
                    return [
                        'ten_san_pham' => $chiTiet->ten_san_pham ?? 'Không xác định',
                        'so_luong' => $chiTiet->so_luong ?? 0,
                        'gia' => $chiTiet->gia_tung_san_pham ?? 0,
                        'tong_gia' => $chiTiet->tong_gia ?? 0,
                        'hinh_anh' => $chiTiet->sanPham->hinh_san_pham ?? null,
                    ];
                })->reject(function ($item) {
                    return empty($item['ten_san_pham']);
                })->values()
            ];
        })->reject(function ($donHang) {
            return empty($donHang['san_pham']);
        })->values();

        if ($data->isEmpty()) {
            return response()->json([
                'message' => 'Đơn hàng tồn tại nhưng không có sản phẩm nào',
                'debug' => $donHangs->toArray()
            ], 404);
        }

        return response()->json($data);
    }
}
