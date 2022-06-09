const { default: axios } = require('axios');

require('./bootstrap');


const openChatBtn = document.getElementById('openChatBtn');
const chatWindow = document.getElementById('chatWindow');
const closeChat = document.getElementById('closeChat');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const sendMessageInp = document.getElementById('sendMessageInp');
const chatMessages = document.getElementById('chatMessages');
const chatChannels = document.getElementById('chatChannels');

let messages = [];
let channels = [];
let newMessage = '';
let openChat = false;

window.addEventListener('load', () => {
  chatWindow.style.display = 'none';
  // fetchMessages();
  
});

sendMessageInp.addEventListener('keyup', (e) => {
  sendMessage();
});

sendMessageBtn.addEventListener('click', () => {
  sendMessage();
});

openChatBtn.addEventListener('click', () => {
  console.log('open chat');
  chatWindow.style.display = 'block';
  openChatBtn.style.display = 'none';
  fetchMessages();
  let channel = getChannels();
  for (const c in channel) {
    console.log('click btn channel');
    console.log(channel[c]);
    window.Echo.private(channel[c])
      .listen('MessageSent', (e) => {
        messages.push({
          message: e.message.message,
          user: e.user
        });
      });
  }
  
  /* console.log(window.Echo);
  window.Echo.private('chat')
    .listen('MessageSent', (e) => {
      messages.push({
        message: e.message.message,
        user: e.user
    });
  }) */
});

closeChat.addEventListener('click', () => {
  chatWindow.style.display = 'none';
  openChatBtn.style.display = 'inline-block';
})

function sendMessage() {
  //Emit a "messagesent" event including the user who sent the message along with the message content
  newMessage = {
      user: this.user,
      message: sendMessageInp.value
  }

  addMessage(newMessage);
  //Clear the input
  newMessage = "";
  return newMessage;
}

async function fetchMessages() {
  console.log('fetch');
  //GET request to the messages route in our Laravel server to fetch all the messages
  await axios.get('/messages').then(response => {
    //Save the response in the messages array to display on the chat view
    messages = response.data;
   /*  console.log(messages);
    showMessages(messages); */
  });
 
  showMessages(messages);
}

//Receives the message that was emitted from the ChatForm Vue component
function addMessage(message) {
  //Pushes it to the messages array
  messages.push(message);
  //POST request to the messages route with the message data in order for our Laravel server to broadcast it.
  axios.post('/messages', message).then(response => {
    console.log(response.data);
  });
}

function showMessages(message) {
  let ul = document.createElement('ul');
  for (const m in message) {
    let li = document.createElement('li');
    let strong = document.createElement('strong');
    let p = document.createElement('p');
    strong.innerHTML = message[m].message;
    p.innerHTML = message[m].user.name;
    li.appendChild(strong)
    li.appendChild(p);
    ul.appendChild(li);
  }
  chatMessages.appendChild(ul);
}

async function getChannels() {
  let res = await axios.get('/channels').then(response => {
    console.log('getChannels: ')
    console.log(response);
    channels = response.data;
  });

  showChannels(channels);
  return res.data;
}

function showChannels(channel) {
  let ul = document.createElement('ul');
  for (const c in channel) {
    console.log('showChannels');
    console.log(channel[c]);
    let li = document.createElement('li');
    li.innerHTML = channel[c];
    ul.appendChild(li);
  }
  chatChannels.appendChild(ul);
}
