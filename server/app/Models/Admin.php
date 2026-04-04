<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'admins';
    protected $primaryKey = 'admin_id';

    public function tokens()
{
    return $this->morphMany(\Laravel\Sanctum\PersonalAccessToken::class, 'tokenable');
}

    protected $fillable = [
        'name',
        'email',
        'password_hash',
    ];

    protected $hidden = [
        'password_hash',
    ];

    // Map password field
    public function getAuthPassword()
    {
        return $this->password_hash;
    }
}