# The build

- Create a Pusher account.
- Set Laravel broadcasting to use Pusher Channels.
- Connect a Vue.js client to Channels with Laravel Echo.
- A simple form to send messages.
- Display received messages in a list

## Steps

- Login / register for a [Pusher]() account. The Channels sandbox plan is completely free and will be more than ample to complete this sample project.

- Once you have signed up for a Pusher account you need to create a Channels app by clicking “Get Started” under Channels

- Follow the steps in the dialog box to name your app and choose a preferred cluster location from the list. The tech stack settings are optional, they are just for the getting started page.

> create a copy of app_id, key, secret and cluster

## Set up laravel environment

you will need PHP 8, Composer 2 and Node.js 

#### Create the project

> composer create-project laravel/laravel chatbox

> cd chatbox

> php artisan serve

> go to http://127.0.0.1:8000/ with browser

#### Set up Pusher

Register the broadcast application service in **config/app.php** by uncommenting
> // App\Providers\BroadcastServiceProvider::class

Change Broadcast_driver in the project root's **.env** file
> BROADCAST_DRIVER=pusher

Scroll down to Pusher environment variables and fill in the values
> PUSHER_APP_ID=123456
PUSHER_APP_KEY=192b754680b23ce923d6
PUSHER_APP_SECRET=a64521345r457641sb65pw
PUSHER_APP_CLUSTER=mt1

#### Install the channels SDK
> composer require pusher/pusher-php-server

#### Install front-end dependecies
> npm install --save laravel-echo pusher-js

Uncomment these statements at the bottom of **resources/js/bootstrap.js**

```
import Echo from 'laravel-echo';
window.Pusher = require('pusher-js');
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    cluster: process.env.MIX_PUSHER_APP_CLUSTER,
    forceTLS: true
});
```

Add the login system

> composer require laravel/ui
php artisan ui vue --auth
npm install && npm run dev
php artisan serve

> go to http://127.0.0.1:8000/ with browser

#### Create the database sqlite

> touch database/db.sqlite

In ".env" file comment out:

> DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=

And add:

> DB_CONNECTION=sqlite
 DB_DATABASE=/Full/path/to/db.sqlite

#### The message model

Create a **Message** model with migration

- php artisan make:model Message

Add the **$fillable** atrribute in **app/Models/Message.php**

```
class Message extends Model
{
    use HasFactory;
    //insert the line below
    protected $fillable = ['message']; 
}
```

Add **user_id** and **message** columns to Message migration file

```
//database/migrations/<creation_date_>create_messages_table.php
Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            //insert the lines below
            $table->integer('user_id')->unsigned();
            $table->text('message');
        });
```

Run migrations:
> php artisan migrate

if error 
> Illuminate\Database\QueryException 
  could not find driver (SQL: PRAGMA foreign_keys = ON;)

run: 

> sudo apt install php8.0-sqlite3

#### User to Message relationship

In `app/Models/User.php` add the hasMany relation: 

```
public function messages() {
        return $this->hasMany(Message::classs);
    }
```

In `app/Models/Message.php` add belongsTo relation:

```
public function user() {
    return $this->belongsTo(User::class);
}
```

#### Defining routes

Add the following routes to `routes/web.php`:

```
Route::get('/chat', [App\Http\Controllers\ChatsController::class, 'index']);
Route::get('/messages', [App\Http\Controllers\ChatsController::class, 'fetchMessages']);
Route::post('/messages', [App\Http\Controllers\ChatsController::class, 'sendMessage']);
```

#### Create ChatsController

> php artisan make:controller ChatsController

At the top of `app/Http/Controllers/ChatsController.php` add:

> use App\Models\Message;

> use Illuminate\Support\Facades\Auth;

And add the following functions:

```
class ChatsController extends Controller
{
    //Add the below functions
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        return view('chat');
    }

    public function fetchMessages()
    {
        return Message::with('user')->get();
    }

    public function sendMessage(Request $request)
    {
        $user = Auth::user();
        $message = $user->messages()->create([
            'message' => $request->input('message')
        ]);
        return ['status' => 'Message Sent!'];
    }
}
```

#### Creating the chat app view

Create a new file `resources/views/chat.blade.php` and add:

```
@extends('layouts.app')
@section('content')
<div class="container">
    <div class="card">
        <div class="card-header">Chats</div>
        <div class="card-body">
            <chat-messages :messages="messages"></chat-messages>
        </div>
        <div class="card-footer">
            <chat-form v-on:messagesent="addMessage" :user="{{ Auth::user() }}"></chat-form>
        </div>
    </div>
</div>
@endsection
```

Create a new file `resources/js/components/ChatMessages.vue` and add:

```
<template>
  <ul class="chat">
    <li class="left clearfix" v-for="message in messages" :key="message.id">
      <div class="clearfix">
        <div class="header">
          <strong>
            {{ message.user.name }}
          </strong>
        </div>
        <p>
          {{ message.message }}
        </p>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  props: ["messages"],
};
</script>
```

Create a new file `resources/js/components/ChatForm.vue` and add:

```
<template>
  //Display an input field and a send button.
  <div class="input-group">
    //Input field.
    <input
      id="btn-input"
      type="text"
      name="message"
      class="form-control input-sm"
      placeholder="Type your message here..."
      v-model="newMessage"
      @keyup.enter="sendMessage"
    />
    //Button
    <span class="input-group-btn">
      //Call sendMessage() this button is clicked.
      <button class="btn btn-primary btn-sm" id="btn-chat" @click="sendMessage">
        Send
      </button>
    </span>
  </div>
</template>
<script>
export default {
  //Takes the "user" props from <chat-form> … :user="{{ Auth::user() }}"></chat-form> in the parent chat.blade.php.
  props: ["user"],
  data() {
    return {
      newMessage: "",
    };
  },
  methods: {
    sendMessage() {
      //Emit a "messagesent" event including the user who sent the message along with the message content
      this.$emit("messagesent", {
        user: this.user,
      //newMessage is bound to the earlier "btn-input" input field
        message: this.newMessage,
      });
      //Clear the input
      this.newMessage = "";
    },
  },
};
</script>
```

Open `resources/js/app.js` and add the following two components after the example-component Vue:

> Vue.component('chat-messages', require('./components/ChatMessages.vue').default);

> Vue.component('chat-form', require('./components/ChatForm.vue').default);

At the bottom inside `const app = new Vue({` :

```
//app and el already exists.
const app = new Vue({
    el: '#app',
    //Store chat messages for display in this array.
    data: {
        messages: []
    },
    //Upon initialisation, run fetchMessages(). 
    created() {
        this.fetchMessages();
    },
    methods: {
        fetchMessages() {
            //GET request to the messages route in our Laravel server to fetch all the messages
            axios.get('/messages').then(response => {
                //Save the response in the messages array to display on the chat view
                this.messages = response.data;
            });
        },
        //Receives the message that was emitted from the ChatForm Vue component
        addMessage(message) {
            //Pushes it to the messages array
            this.messages.push(message);
            //POST request to the messages route with the message data in order for our Laravel server to broadcast it.
            axios.post('/messages', message).then(response => {
                console.log(response.data);
            });
        }
    }
});
```

In `resources/views/home.blade.php` below `{{__('You are logged in!') }}` add:
> `<a href="{{ url('/chat') }}">Chat</a">`

Check if app works

> npm run dev

> php artisan serve

> http://127.0.0.1:8000/

Register a second user and open another (private) window

#### Broadcasting Message Sent Event

create an event called MessageSent:

> php artisan make:event MessageSent

open the file `app/Events/MessageSent.php` and import:

> use App\Models\User;
> use App\Models\Message;

Add the implements ShouldBroadcast interface to the MessageSent class:

> class MessageSent implements ShouldBroadcast

Inside the class, add these two public properties:

> public $user;
> public $message;

There is already an empty `__construct()` function, modify it to the following:

```
public function __construct(User $user, Message $message)
{
    $this->user = $user;
    $this->message = $message;
}
```

Set the channel to broadcast onto the chat private channel:

```
 public function broadcastOn()
{
    return new PrivateChannel('chat');
}
```
In the `routes/channels.php` file add:

```
Broadcast::channel('chat', function ($user) {
    return Auth::check();
});
```

In `app/Http/Controllers/ChatsController.php` import the MessageSent event :

> use App\Events\MessageSent;

before the `return` statement at the bottom of the `sendMessage()` function, add the important `broadcast()` call to broadcast to Pusher.

> broadcast(new MessageSent($user, $message))->toOthers();

#### Laravel Echo

 Add this in `resources/js/app.js` inside `created(){…}` after `this.fetchMessages()`:

 ```
 window.Echo.private('chat')
  .listen('MessageSent', (e) => {
    this.messages.push({
      message: e.message.message,
      user: e.user
    });
  });
```

> npm run dev

> php artisan serve

Check it out!