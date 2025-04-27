<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaiKhoan extends Model
{
    protected $table = 'taikhoan';
    protected $primaryKey = 'username';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false; // Add this line to disable timestamps


    protected $fillable = [
        'username',
        'password',
        'user_id'
    ];

    protected $hidden = [
        'password'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}