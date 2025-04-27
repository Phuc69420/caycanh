<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Control extends Model
{
    protected $table = 'controls';
    protected $primaryKey = 'control_id';
    public $timestamps = false;

    protected $fillable = [
        'control_id',
        'control_name'
    ];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'rolecontrol', 'control_id', 'role_id');
    }
}