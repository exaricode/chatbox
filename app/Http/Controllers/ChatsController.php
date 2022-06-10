<?php

namespace App\Http\Controllers;

use App\Events\ChannelCreated;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Events\MessageSent;
use Illuminate\Support\Facades\Broadcast;
use stdClass;

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

    public static function fetchMessages(Request $channel)
    {
        $user = Auth::user();
    
        return Message::with('user')
            ->where([['user_id', $user->id], ['to_user_id', $channel->channelName]])
            ->orWhere([['user_id', $channel->channelName], ['to_user_id', $user->id]])
            ->get();
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

    public static function getChannels() {
        if(!Auth::user()->is_admin){
            $channels = [];
            $channelNames = [];

            $begeleiding = ChatsController::getUsers();
            
            foreach ($begeleiding as $b){
                $channel = new stdClass();
                $channel->name = new PrivateChannel(Auth::user()->username . '-' . $b->username);
                $channel->to_user_id = $b->id;
                // dd($channelName);
                array_push($channels, broadcast(new ChannelCreated($channel->name))->toOthers());
                
                array_push($channelNames, $channel);
            }
            // dd($channelNames);
            return $channelNames;
        }
    }

    public static function getUsers(){
        return User::getAdminUsers();
    }
}
