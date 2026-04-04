<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $primaryKey = 'department_id';
    protected $fillable = ['department_name'];

    public function courses()
    {
        return $this->hasMany(Course::class, 'department_id', 'department_id');
    }
}