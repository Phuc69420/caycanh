<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SanPham;
use App\Models\DanhMucSanPham;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class SanPhamController extends Controller
{
    // 1. Danh sách tất cả sản phẩm
    public function index()
    {
        $sanpham = SanPham::with('danhMuc')->get()->map(function ($sp) {
            return [
                'ma_san_pham'   => $sp->ma_san_pham,
                'ten_san_pham'  => $sp->ten_san_pham,
                'gia_san_pham'  => $sp->gia_san_pham,
                'hinh_san_pham' => $sp->hinh_san_pham,
                'ma_danh_muc'   => $sp->ma_danh_muc,
                'ten_danh_muc'  => optional($sp->danhMuc)->ten_danh_muc ?? 'Không xác định',
            ];
        });

        return response()->json($sanpham);
    }

    // 2. Danh sách danh mục
    public function danhSachDanhMuc()
    {
        return response()->json(DanhMucSanPham::all());
    }

    // 3. Sản phẩm theo danh mục
    public function theoDanhMuc($maDanhMuc)
    {
        $danhMuc = DanhMucSanPham::find($maDanhMuc);
        if (! $danhMuc) {
            return response()->json([ 'success' => false, 'message' => 'Danh mục không tồn tại' ], 404);
        }

        $sanpham = SanPham::where('ma_danh_muc', $maDanhMuc)
                         ->with('danhMuc')
                         ->get()
                         ->map(function ($sp) {
                             return [
                                 'ma_san_pham'  => $sp->ma_san_pham,
                                 'ten_san_pham' => $sp->ten_san_pham,
                                 'gia_san_pham' => $sp->gia_san_pham,
                                 'hinh_san_pham'=> $sp->hinh_san_pham,
                                 'ma_danh_muc'  => $sp->ma_danh_muc,
                                 'ten_danh_muc' => $sp->danhMuc->ten_danh_muc,
                                 'mo_ta'        => $sp->mo_ta,
                             ];
                         });

        return response()->json([
            'success'   => true,
            'danh_muc'  => $danhMuc->ten_danh_muc,
            'san_pham'  => $sanpham
        ]);
    }

    // 4. Chi tiết sản phẩm
    public function chiTietSanPham($maSanPham)
    {
        $sanPham = SanPham::with(['danhMuc', 'thongTinChiTiet'])->find($maSanPham);
        if (! $sanPham) {
            return response()->json([ 'success' => false, 'message' => 'Sản phẩm không tồn tại' ], 404);
        }

        $result = [
            'ma_san_pham'       => $sanPham->ma_san_pham,
            'ten_san_pham'      => $sanPham->ten_san_pham,
            'gia_san_pham'      => $sanPham->gia_san_pham,
            'hinh_san_pham'     => $sanPham->hinh_san_pham,
            'mo_ta'             => $sanPham->mo_ta,
            'so_luong'          => $sanPham->so_luong,
            'danh_muc'          => [
                'ma_danh_muc'   => $sanPham->danhMuc->ma_danh_muc,
                'ten_danh_muc'  => $sanPham->danhMuc->ten_danh_muc,
            ],
            'thong_tin_chi_tiet'=> $sanPham->thongTinChiTiet ? [
                'gioi_thieu'        => $sanPham->thongTinChiTiet->gioi_thieu,
                'dac_diem'          => $sanPham->thongTinChiTiet->dac_diem,
                'cong_dung_y_nghia' => $sanPham->thongTinChiTiet->cong_dung_y_nghia,
                'cach_cham_soc'     => $sanPham->thongTinChiTiet->cach_cham_soc,
            ] : null
        ];

        return response()->json([ 'success' => true, 'san_pham' => $result ]);
    }

    // 5. Tìm kiếm sản phẩm
    public function search(Request $request)
    {
        $validated = $request->validate([
            'q'        => 'nullable|string|max:255',
            'page'     => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $query   = $validated['q'] ?? '';
        $perPage = $validated['per_page'] ?? 12;

        $results = SanPham::when($query, function ($q) use ($query) {
                          $term = '%' . str_replace(' ', '%', $query) . '%';
                          $q->where('ten_san_pham', 'like', $term)
                            ->orWhere('mo_ta', 'like', $term);
                      })
                      ->orderBy('ten_san_pham')
                      ->paginate($perPage);

        return response()->json($results);
    }

    // 6. Thêm sản phẩm (với upload ảnh vào public/images/{DanhMuc})
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ma_san_pham' => 'required|string|max:5|unique:sanpham,ma_san_pham',
            'ten_san_pham'=> 'required|string|max:255',
            'gia_san_pham'=> 'required|numeric',
            'mo_ta'       => 'nullable|string',
            'ma_danh_muc' => 'required|exists:danhmucsanpham,ma_danh_muc',
            'so_luong'    => 'required|integer',
            'hinh_anh'    => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);
    
        $danhMuc = DanhMucSanPham::find($validated['ma_danh_muc']);
        $folder = Str::slug($danhMuc->ten_danh_muc);
        $destPath = public_path("images/{$folder}");
        if (! File::isDirectory($destPath)) {
            File::makeDirectory($destPath, 0755, true);
        }
    
        $file = $request->file('hinh_anh');
        $filename = Str::slug($validated['ten_san_pham']) . '-' . time(); // KHÔNG có đuôi
        $fullFilename = $filename . '.' . $file->getClientOriginalExtension();
        $file->move($destPath, $fullFilename);
    
        $hinhSanPham = "{$folder}/{$filename}"; // KHÔNG có đuôi
    
        $sanpham = SanPham::create([
            'ma_san_pham'   => $validated['ma_san_pham'],
            'ten_san_pham'  => $validated['ten_san_pham'],
            'gia_san_pham'  => $validated['gia_san_pham'],
            'mo_ta'         => $validated['mo_ta'] ?? '',
            'ma_danh_muc'   => $validated['ma_danh_muc'],
            'so_luong'      => $validated['so_luong'],
            'hinh_san_pham' => $hinhSanPham, // KHÔNG có đuôi
        ]);
    
        return response()->json([
            'success'     => true,
            'san_pham'    => $sanpham,
            'image_url'   => asset("images/{$hinhSanPham}." . $file->getClientOriginalExtension())
        ], 201);
    }
    
    // 7. Cập nhật sản phẩm (có thể kèm đổi ảnh)
    public function update(Request $request, $id)
    {
        $sanpham = SanPham::findOrFail($id);
    
        $validated = $request->validate([
            'ten_san_pham'=> 'required|string|max:255',
            'gia_san_pham'=> 'required|numeric',
            'mo_ta'       => 'nullable|string',
            'so_luong'    => 'required|integer|min:0',
            'ma_danh_muc' => 'required|exists:danhmucsanpham,ma_danh_muc',
            'hinh_anh'    => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);
    
        if ($request->hasFile('hinh_anh')) {
            $oldPathWithExt = public_path("images/{$sanpham->hinh_san_pham}.jpg"); // giả định là .jpg
            foreach (['jpg', 'jpeg', 'png'] as $ext) {
                $possiblePath = public_path("images/{$sanpham->hinh_san_pham}.{$ext}");
                if (File::exists($possiblePath)) {
                    File::delete($possiblePath);
                    break;
                }
            }
    
            $danhMuc = DanhMucSanPham::find($validated['ma_danh_muc']);
            $folder = Str::slug($danhMuc->ten_danh_muc);
            $destPath = public_path("images/{$folder}");
            if (! File::isDirectory($destPath)) {
                File::makeDirectory($destPath, 0755, true);
            }
    
            $file = $request->file('hinh_anh');
            $filename = Str::slug($validated['ten_san_pham']) . '-' . time(); // KHÔNG có đuôi
            $fullFilename = $filename . '.' . $file->getClientOriginalExtension();
            $file->move($destPath, $fullFilename);
    
            $sanpham->hinh_san_pham = "{$folder}/{$filename}"; // KHÔNG có đuôi
        }
    
        $sanpham->update([
            'ten_san_pham'  => $validated['ten_san_pham'],
            'gia_san_pham'  => $validated['gia_san_pham'],
            'mo_ta'         => $validated['mo_ta'] ?? '',
            'so_luong'      => $validated['so_luong'],
            'ma_danh_muc'   => $validated['ma_danh_muc'],
        ]);
    
        $imageUrl = null;
        if ($request->hasFile('hinh_anh')) {
            $imageUrl = asset("images/{$sanpham->hinh_san_pham}." . $file->getClientOriginalExtension());
        }
    
        return response()->json([
            'success'   => true,
            'san_pham'  => $sanpham,
            'image_url' => $imageUrl
        ]);
    }
    
    // 8. Xóa sản phẩm (và xóa file ảnh)
    public function destroy($id)
    {
        $sanpham = SanPham::findOrFail($id);

        // Xóa file nếu tồn tại
        $path = public_path("images/{$sanpham->hinh_san_pham}");
        if (File::exists($path)) {
            File::delete($path);
        }

        $sanpham->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sản phẩm đã được xóa thành công'
        ]);
    }
}
