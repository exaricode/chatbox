const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
    .js('resources/js/chats.js', 'public/js')
    .js('resources/notificationWorker.js', 'public')
    .postCss("resources/css/app.css", "public/css", [
        require("tailwindcss")
    ])
    .postCss("resources/css/chatBox.css", "public/css")
    .sass('resources/sass/app2.scss', 'public/css')
    .disableNotifications();