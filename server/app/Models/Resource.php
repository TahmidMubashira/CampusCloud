<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'department',
        'courseCode',
        'resourceType',
        'file_path',
        'file_type',
        'file_size',
        'downloads',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}