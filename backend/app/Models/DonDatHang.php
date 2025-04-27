<?php
// app/Models/DonDatHang.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DonDatHang extends Model
{
    protected $table = 'dondathang';
    protected $primaryKey = 'ma_don_hang';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;

    protected $fillable = [
        'ma_khach_hang',
        'ten_khach_hang',
        'sdt_kh',
        'tinh_thanh_pho',      
        'quan_huyen',           
        'phuong_xa'  ,
        'dia_chi_giao_hang',
        'email_kh',
        'tong_so_tien',
        'ngay_dat_hang',
        'phuong_thuc_thanh_toan'           
    ];
    
    public function chiTietDonHang(): HasMany
    {
        return $this->hasMany(ChiTietDonDatHang::class, 'ma_don_hang', 'ma_don_hang');
    }

    public function khachHang(): BelongsTo
    {
        return $this->belongsTo(KhachHang::class, 'ma_khach_hang', 'ma_khach_hang');
    }

    public function thanhToan(): HasOne
    {
        return $this->hasOne(ThanhToanMomo::class, 'ma_don_hang', 'ma_don_hang');
    }
}
