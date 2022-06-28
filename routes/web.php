<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ChatsController;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', function () {
    return view('home');
    /* , [
        'messages' => ChatsController::fetchMessages()
    ]); */
     // HomeController::class, 'index']->name('home')
});


// Route::get('/chat', [ChatsController::class, 'index']);
Route::post('/fetchmessages', [ChatsController::class, 'fetchMessages']);
Route::get('/channels', [ChatsController::class, 'getChannels']);
Route::post('/messages', [ChatsController::class, 'sendMessage']);
Route::post('/username', [ChatsController::class, 'getUserName']);
Route::post('/isread', [ChatsController::class, 'isReadStatus']);