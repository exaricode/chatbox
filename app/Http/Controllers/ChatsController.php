<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Events\MessageSent;

class ChatsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        return view('chat');
    }

    public static function fetchMessages()
    {
        $user = Auth::user();
        
        // return Message::all();
        /* $user = Auth::user();
        if ($user->id == 1){ */
            return Message::with('user')->get();
        /* } else {
            return Message::with('user')
                ->where('user_id', $user->id)
                // ->orWhere('to_user', $user->id)
                ->get();
        } */

        
    }

    // selected user
    public static function sendMessage(Request $request)
    {
        $user = Auth::user();
        $message = $user->messages()->create([
            'message' => $request->input('message')
        ]);
        broadcast(new MessageSent($user, $message))->toOthers();
        return ['status' => 'Message Sent!'];
    }

    public function getUsers(){

        return User::getUsers();
    }
}
