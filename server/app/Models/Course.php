<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $primaryKey = 'course_id';
    protected $fillable = ['course_name', 'course_code', 'department_id'];

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id', 'department_id');
    }
}