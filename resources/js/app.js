/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

const { default: axios } = require('axios');

require('./bootstrap');

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

const openChatBtn = document.getElementById('openChatBtn');
const chatWindow = document.getElementById('chatWindow');

let messages = [];
let openChat = false;

openChatBtn.addEventListener('click', () => {
    openChat = true;
    // chatWindow.classList.toggle = 'hidden';
    chatWindow.className = 'static';
    fetchMessages();
});
/* 
function openChatWindow() {
    openChat = !openChat;
    // return openChat;
} */

window.addEventListener('load', () => {
    chatWindow.className = 'none';
    fetchMessages();
    window.Echo.private('chat')
        .listen('MessageSent', (e) => {
            messages.push({
                message: e.message.message,
                user: e.user
            });
        })
})

function fetchMessages() {
    console.group('fetch');
    //GET request to the messages route in our Laravel server to fetch all the messages
    axios.get('/messages').then(response => {
        //Save the response in the messages array to display on the chat view
        messages = response.data;
    });
}

//Receives the message that was emitted from the ChatForm Vue component
function addMessage(message) {
    console.log('add');
    //Pushes it to the messages array
    messages.push(message);
    //POST request to the messages route with the message data in order for our Laravel server to broadcast it.
    axios.post('/messages', message).then(response => {
        console.log(response.data);
    });
}

