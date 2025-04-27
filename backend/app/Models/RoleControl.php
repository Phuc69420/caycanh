<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoleControl extends Model
{
    protected $table = 'rolecontrol';
    public $timestamps = false;

    protected $fillable = [
        'role_id',
        'control_id',
        'invisible'
    ];

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'role_id');
    }

    public function control()
    {
        return $this->belongsTo(Control::class, 'control_id', 'control_id');
    }
}