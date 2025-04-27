<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThongTinSanPham extends Model
{
    protected $table = 'thongtinsanpham';
    protected $primaryKey = 'ma_thong_tin_sp';
    public $timestamps = false;

    protected $fillable = [
        'gioi_thieu',
        'dac_diem',
        'cong_dung_y_nghia',
        'cach_cham_soc',
        'ma_san_pham'
    ];

    public function sanPham()
    {
        return $this->belongsTo(SanPham::class, 'ma_san_pham', 'ma_san_pham');
    }
}