<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ChiTietDonDatHang;
use App\Models\SanPham;
class ChiTietDonDatHang extends Model
{
    protected $table = 'chitietdondathang';
    protected $primaryKey = 'ma_chi_tiet_don_hang';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;

    protected $fillable = [
        'ma_don_hang',
        'ma_san_pham',
        'ten_san_pham',
        'gia_tung_san_pham',
        'so_luong',
        'tong_gia'
    ];

    public function donDatHang()
    {
        return $this->belongsTo(DonDatHang::class, 'ma_don_hang', 'ma_don_hang');
    }

    public function sanPham()
    {
        return $this->belongsTo(SanPham::class, 'ma_san_pham', 'ma_san_pham');
    }
}
