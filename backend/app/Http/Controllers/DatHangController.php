<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DonDatHang;
use App\Models\ChiTietDonDatHang;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class DatHangController extends Controller
{
    public function layDanhSachDonHang()
    {
        $donhangs = DonDatHang::all();
        return response()->json($donhangs);
    }

    public function datHang(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'ten_khach_hang' => 'required|string|max:255',
                'email_kh' => 'required|email|max:255',
                'sdt_kh' => 'required|string|max:20',
                'tinh_thanh_pho' => 'required|string|max:50',
                'quan_huyen' => 'required|string|max:50',   
                'phuong_xa' => 'required|string|max:50',     
                'dia_chi_giao_hang' => 'required|string|max:255',
                'phuong_thuc_thanh_toan' => 'required|string',
                'tong_so_tien' => 'required|numeric|min:0',
                'items' => 'required|array|min:1',
                'items.*.ma_san_pham' => 'required|string',
                'items.*.ten_san_pham' => 'required|string',
                'items.*.gia' => 'required|numeric',
                'items.*.so_luong' => 'required|integer|min:1',
            ]);

            // Kiểm tra người dùng có đăng nhập hay không
            $user = Auth::user();

            // Tạo đơn hàng mới
            $donHang = DonDatHang::create([
                'ma_khach_hang' => $user ? $user->id : null,
                'ten_khach_hang' => $user ? $user->name : $validatedData['ten_khach_hang'],
                'email_kh' => $user ? $user->email : $validatedData['email_kh'],
                'sdt_kh' => $validatedData['sdt_kh'],
                'tinh_thanh_pho' => $validatedData['tinh_thanh_pho'],    
                'quan_huyen' => $validatedData['quan_huyen'],
                'phuong_xa' => $validatedData['phuong_xa'], 
                'dia_chi_giao_hang' => $validatedData['dia_chi_giao_hang'],
                'phuong_thuc_thanh_toan' => $validatedData['phuong_thuc_thanh_toan'],
                'tong_so_tien' => $validatedData['tong_so_tien'],
                'trang_thai' => 'chờ xử lý',
            ]);

            // Thêm từng sản phẩm vào chi tiết đơn hàng
            foreach ($validatedData['items'] as $item) {
                Log::info('📦 Thêm chi tiết đơn hàng', [
                    'ma_don_hang' => $donHang->ma_don_hang,
                    'item' => $item
                ]);

                ChiTietDonDatHang::create([
                    'ma_don_hang' => $donHang->ma_don_hang,
                    'ma_san_pham' => $item['ma_san_pham'],
                    'ten_san_pham' => $item['ten_san_pham'],
                    'gia_tung_san_pham' => $item['gia'],
                    'so_luong' => $item['so_luong'],
                    'tong_gia' => $item['gia'] * $item['so_luong'],
                ]);
            }

            // ✅ Trả về order_id để frontend xử lý điều hướng
            return response()->json([
                'success' => true,
                'message' => 'Đặt hàng thành công',
                'order_id' => $donHang->ma_don_hang,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Lỗi đặt hàng:', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
                'stack' => $e->getTraceAsString(),
                'request_data' => $request->all(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Lỗi máy chủ. Vui lòng thử lại sau!'
            ], 500);
        }
    }

    public function capNhatTrangThai(Request $request, $id)
    {
        $request->validate([
            'trang_thai' => 'required|string|max:255'
        ]);

        $donHang = DonDatHang::findOrFail($id);
        $donHang->trang_thai = $request->trang_thai;
        $donHang->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật trạng thái thành công'
        ]);
    }
    public function demDonMoi()
    {
        $soDonMoi = DonDatHang::where('trang_thai', 'chờ xử lý')->count();
    
        return response()->json([
            'so_don_moi' => $soDonMoi
        ]);
    }
    

}
