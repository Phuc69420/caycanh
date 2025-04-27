<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DanhMucSanPham;

class DanhMucSanPhamController extends Controller
{
    public function index()
    {
        return DanhMucSanPham::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'ma_danh_muc' => 'required|string|max:5|unique:danhmucsanpham,ma_danh_muc',
            'ten_danh_muc' => 'required|string|max:50',
        ]);

        $danhMuc = DanhMucSanPham::create($request->all());
        return response()->json($danhMuc, 201);
    }

    public function update(Request $request, $ma_danh_muc)
    {
        $request->validate([
            'ten_danh_muc' => 'required|string|max:50',
        ]);

        $danhMuc = DanhMucSanPham::findOrFail($ma_danh_muc);
        $danhMuc->ten_danh_muc = $request->ten_danh_muc;
        $danhMuc->save();

        return response()->json($danhMuc);
    }

    public function destroy($ma_danh_muc)
    {
        $danhMuc = DanhMucSanPham::findOrFail($ma_danh_muc);
        $danhMuc->delete();

        return response()->json(['message' => 'Đã xóa danh mục']);
    }
}
