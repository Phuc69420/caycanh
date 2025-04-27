<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KhachHang extends Model
{
    protected $table = 'khachhang';
    protected $primaryKey = 'ma_khach_hang';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'ma_khach_hang'
    ];
}
