<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SanPhamController;
use App\Http\Controllers\DatHangController;
use App\Http\Controllers\MomoPaymentController;
use App\Http\Controllers\TraCuuDonHangController;
use App\Http\Controllers\DanhMucSanPhamController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DiaChiController;

// ---------- SẢN PHẨM & DANH MỤC ----------
Route::get('/sanpham', [SanPhamController::class, 'index']);
Route::get('/sanpham/danhmuc', [SanPhamController::class, 'danhSachDanhMuc']);
Route::get('/sanpham/danhmuc/{maDanhMuc}', [SanPhamController::class, 'theoDanhMuc']);
Route::get('/sanpham/{maSanPham}', [SanPhamController::class, 'chiTietSanPham']);
Route::get('/danhmucsanpham', [DanhMucSanPhamController::class, 'index']);
Route::post('/danhmucsanpham', [DanhMucSanPhamController::class, 'store']);
Route::put('/danhmucsanpham/{ma_danh_muc}', [DanhMucSanPhamController::class, 'update']);
Route::delete('/danhmucsanpham/{ma_danh_muc}', [DanhMucSanPhamController::class, 'destroy']);
Route::post('/sanpham', [SanPhamController::class, 'store']);
Route::put('/sanpham/{id}', [SanPhamController::class, 'update']);
Route::delete('/sanpham/{id}', [SanPhamController::class, 'destroy']);
Route::get('/search-san-pham', [SanPhamController::class, 'search']);

// ---------- ĐẶT HÀNG ----------
Route::post('/dat-hang', [DatHangController::class, 'datHang']);
Route::get('/donhang', [DatHangController::class, 'layDanhSachDonHang']);
Route::put('/donhang/{id}/trangthai', [DatHangController::class, 'capNhatTrangThai']);
Route::get('/admin/don-moi', [DatHangController::class, 'demDonMoi']);

// ---------- MOMO ----------
Route::post('/momo/create', [MomoPaymentController::class, 'createPayment'])->name('momo.create');
Route::post('/momo/ipn', [MomoPaymentController::class, 'ipn'])->name('momo.ipn');
Route::get('/momo/redirect', [MomoPaymentController::class, 'redirect'])->name('momo.redirect');

// ---------- TRA CỨU ĐƠN HÀNG ----------
Route::get('/tra-cuu-don-hang', [TraCuuDonHangController::class, 'traCuu']);

// ---------- ĐỊA CHỈ ----------
Route::get('/diachi/tinh', [DiaChiController::class, 'layTinhThanh']);
Route::get('/diachi/quan-huyen/{maTinh}', [DiaChiController::class, 'layQuanHuyen']);
Route::get('/diachi/phuong-xa/{maHuyen}', [DiaChiController::class, 'layPhuongXa']);

// ---------- AUTH ----------
Route::prefix('tai-khoan')->group(function () {
    Route::post('/dang-ky', [AuthController::class, 'register']);
    Route::post('/dang-nhap', [AuthController::class, 'login']);
    Route::post('/dang-xuat', [AuthController::class, 'logout']);
    Route::post('/google-login', [AuthController::class, 'handleGoogleLogin']);
    Route::post('/google-register', [AuthController::class, 'handleGoogleRegister']);
});

// ---------- ROUTE CÓ BẢO VỆ ----------
Route::middleware(['auth:api', 'role:admin'])->group(function () {
    Route::post('/them-nhan-vien', [AuthController::class, 'createEmployee']);
});

Route::middleware(['auth:api', 'role:employee,admin'])->group(function () {
    Route::get('/donhang', [DatHangController::class, 'layDanhSachDonHang']);
});

// ---------- FALLBACK ----------
Route::get('{any}', function () {
    return view('index'); // trả về file build React
})->where('any', '.*');
