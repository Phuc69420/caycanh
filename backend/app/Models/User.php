<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'user';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'name',
        'phone',
        'email',
        'address',
    ];

    protected $hidden = [
        'password',
    ];

    public function taiKhoan()
    {
        return $this->hasOne(TaiKhoan::class, 'user_id', 'id');
    }

    public function tokens()
    {
        return $this->hasMany(Token::class, 'user_id', 'id');
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'userrole', 'user_id', 'role_id');
    }

    public function hasRole($roleName)
    {
        return $this->roles()->where('role_name', $roleName)->exists();
    }

    public function isAdmin()
    {
        return $this->hasRole('admin');
    }

    public function isEmployee()
    {
        return $this->hasRole('employee');
    }

    public function isCustomer()
    {
        return $this->hasRole('customer');
    }
}