<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = 'role';
    protected $primaryKey = 'role_id';
    public $timestamps = false;

    protected $fillable = [
        'role_id',
        'role_name'
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'userrole', 'role_id', 'user_id');
    }

    public function controls()
    {
        return $this->belongsToMany(Control::class, 'rolecontrol', 'role_id', 'control_id');
    }
}