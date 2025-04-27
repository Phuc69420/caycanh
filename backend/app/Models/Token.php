<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Token extends Model
{
    protected $table = 'tokens';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'token'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}