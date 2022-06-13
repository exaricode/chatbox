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
            ->where([['user_id', $user->id],['to_user_id', $channel->idChannel]])
            ->orWhere([['user_id', $channel->idChannel], ['to_user_id', $user->id]])
            ->get();
    /* 
        return Message::with('user')->where(function($query) use ($user, $channel) {
            $query->where([['user_id', $user->id], ['to_user_id', $channel->idChannel]]);
            $query->orWhere([['user_id', $channel->idChannel], ['to_user_id', $user->id]]);
        })
            ->get(); */
    }

    // selected user
    public static function sendMessage(Request $request)
    {
        $user = Auth::user();
        $message = $user->messages()->create([
            'message' => $request->input('message'),
            'to_user_id' => (int) $request->to_user_id
        ]);
        $channelName = $request->chatname;
        broadcast(new MessageSent($user, $message, $channelName))->toOthers();
        return ['status' => 'Message Sent!'];
    }

    public static function getChannels() {
        $channelNames = [];

        if(!Auth::user()->is_admin){
            $begeleiding = ChatsController::getAdminUsers();
            
            foreach ($begeleiding as $b){
                $channel = new stdClass();
                $channel->name = Auth::user()->username . '-' . $b->username;
                $channel->to_user_id = $b->id;
                
               // broadcast(new ChannelCreated($channel->name))->toOthers();
               
                array_push($channelNames, $channel);
            }

        } else if (Auth::user()->is_admin) {
            $medient = ChatsController::getUsers();

            foreach($medient as $m) {
                $channel = new stdClass();
                $channel->name = $m->username . '-' . Auth::user()->username;
                $channel->to_user_id = $m->id;
                // broadcast(new ChannelCreated($channel->name))->toOthers();

                array_push($channelNames, $channel);
            } 
        }
        return $channelNames;
    }

    public static function getAdminUsers(){
        return User::getAdminUsers();
    }

    public static function getUsers(){
        return User::getUsers();
    }
}
