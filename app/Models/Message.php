<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $connection = 'sqlite';
    
    protected $fillable = ['message', 'to_user_id', 'created_at', 'is_read'];
    public $timestamps = false;

    public function user(){
        return $this->belongsTo(User::class);
    }
}

