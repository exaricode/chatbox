# Chatbox

## description

A component for private chatboxes between users and admins using broadcast with pusher made with Laravel. The channels will be set up upon first opening the chatbox component. Including a read 
status for **not received**, **received** and **read**. The channel with **unread** message(s) will be highlighted. A notification will be send if the other user has a different
channel open, closed the chatbox or has focus on another window.

## Adding to existing project

- Clone the project or copy the content of the needed files
- Copy `resources\views\chat.blade.php`
- Copy `resources\js\chats.js` (include in webpack.mix.js)
- Copy `resources\css\chatBox.css` (include in webpack.mix.js)
- Copy `app\Events\MessageSend.php`
- Copy `app\Events\isRead.php`
- Copy `app\Http\Controllers\ChatsController.php`
- Copy `app\Models\Message.php` (uses sqlite)
- Copy `database\migrations\**_create_messages_table.php`
- Copy/merge `routes\channels.php`
- Copy/merge `routes\web.php`

## setup pusher channels

- Login / register for a [Pusher](https://pusher.com/) account. The Channels sandbox plan is free and will be more than ample to get started.

- Once you have signed up for a Pusher account you need to create a Channels app by clicking “Get Started” under Channels

- Follow the steps in the dialog box to name your app and choose a preferred cluster location from the list. The tech stack settings are optional, they are just for the getting started page.

> create a copy of app_id, key, secret and cluster

### Set up Pusher

Register the broadcast application service in **config/app.php** by uncommenting
> // App\Providers\BroadcastServiceProvider::class

Change Broadcast_driver in the project root's **.env** file
> BROADCAST_DRIVER=pusher

Scroll down to Pusher environment variables and fill in the values
```
PUSHER_APP_ID=123456
PUSHER_APP_KEY=192b754680b23ce923d6
PUSHER_APP_SECRET=a64521345r457641sb65pw
PUSHER_APP_CLUSTER=mt1
```

### Install the channels SDK
> composer require pusher/pusher-php-server

### Install front-end dependecies
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

### Create the database sqlite

> touch database/db.sqlite

In ".env" file comment out:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

And add:

```
DB_CONNECTION=sqlite
DB_DATABASE=/Full/path/to/db.sqlite
```

or to use next to **MySQL**

``` 
DB_CONNECTION_SECOND=sqlite
DB_DATABASE_SECOND=/Full/path/to/db.sqlite
```
and in **config\database.php**

>> 
```
'sqlite' => [
            'driver' => 'sqlite',
            'url' => env('DATABASE_URL'),
            'database' => env('DB_DATABASE_SECOND', database_path('db.sqlite')),
            'prefix' => '',
            'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
        ],
```

## setup chatbox

- By default the chatbox has display: 'none'
- Use button to display the chatbox
- 