<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SanPham extends Model
{
    protected $table = 'sanpham';
    protected $primaryKey = 'ma_san_pham';
    public $timestamps = false;
    protected $keyType = 'string'; // <--- QUAN TRỌNG
    public $incrementing = false; // <--- Nếu mã là dạng chuỗi không tự tăng

    protected $fillable = [
        'ma_san_pham', 
        'ten_san_pham',
        'gia_san_pham',
        'hinh_san_pham',
        'so_luong',
        'ma_danh_muc',
        'mo_ta'
    ];
    

    public function danhMuc()
    {
        return $this->belongsTo(DanhMucSanPham::class, 'ma_danh_muc', 'ma_danh_muc');
    }

    public function thongTinChiTiet()
    {
        return $this->hasOne(ThongTinSanPham::class, 'ma_san_pham', 'ma_san_pham');
    }
}
