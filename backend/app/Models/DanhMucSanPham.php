<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DanhMucSanPham extends Model
{
    protected $table = 'danhmucsanpham';
    protected $primaryKey = 'ma_danh_muc';
    public $incrementing = false;
    public $timestamps = false; // ❗ Không sử dụng created_at & updated_at

    protected $fillable = ['ma_danh_muc', 'ten_danh_muc'];

    public function sanphams()
    {
        return $this->hasMany(SanPham::class, 'ma_danh_muc', 'ma_danh_muc');
    }
}
