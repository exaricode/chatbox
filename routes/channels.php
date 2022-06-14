<?php

use Illuminate\Support\Facades\Broadcast;
use App\Http\Controllers\ChatsController;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

$begeleiding = ChatsController::getAdminUsers();
$medient = ChatsController::getUsers();


foreach ($begeleiding as $b) {
    foreach ($medient as $m) {
        Broadcast::channel($m->username . '-' . $b->username, function($user) {
            return Auth::check();
        });
    }
    // dd(auth()->user()->username);
    /* Broadcast::channel('App.Models.User.{username}' . '-' . $b->username, function($user) {
        return (string) $user->username;
    }); */
}

/* 
Broadcast::channel('chat', function ($user) {
    return Auth::check();
}); */
