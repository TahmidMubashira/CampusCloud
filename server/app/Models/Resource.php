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
    'department_id',
    'course_id',
    'resourceType',
    'file_path',
    'file_type',
    'file_size',
    'downloads',
    'user_id',
    'is_approved',
    'status',
    'rejection_reason',
];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id', 'department_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', 'course_id');
    }
}