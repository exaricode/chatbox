const { default: axios } = require('axios');

require('./bootstrap');


const openChatBtn = document.getElementById('openChatBtn');
const chatWindow = document.getElementById('chatWindow');
const closeChat = document.getElementById('closeChat');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const sendMessageInp = document.getElementById('sendMessageInp');
const chatMessages = document.getElementById('chatMessages');
const chatChannels = document.getElementById('chatChannels');
const chatChannelName = document.getElementById('chatChannelName');

let messages = [];
let channels = [];
let newMessage = '';
let openChat = false;
let user = '';

window.addEventListener('load', () => {
  chatWindow.style.display = 'none'; 
  getUser();
});

async function getUser () {
  await axios.post('/username').then(response => {
    user = response.data;
  });
}

sendMessageBtn.addEventListener('click', () => {
  sendMessage();
});

openChatBtn.addEventListener('click', () => {
  chatWindow.style.display = 'grid';
  openChatBtn.style.display = 'none';
  
  if (!openChat) {
    let channel = getChannels();
    
    channel.then(x => {
      for(const c in x) {
        let n = x[c].name;
        window.Echo.private(n)
          .listen('MessageSent', (e) => {
            console.log(e);
            messages.push({
              message: e.message.message,
              user: e.user
            });
            addSendMessage({message: e.message.message, user: e.user });
          });
      }
    });
    openChat = true;
  }

});

closeChat.addEventListener('click', () => {
  chatWindow.style.display = 'none';
  openChatBtn.style.display = 'inline-block';
})

function sendMessage() {
  //Emit a "messagesent" event including the user who sent the message along with the message content
  newMessage = {
      user: user,
      message: sendMessageInp.value,
      chatname: chatChannelName.textContent,
      to_user_id: chatChannelName.dataset.id
  }

  addMessage(newMessage);
  //Clear the input
  newMessage = "";
  sendMessageInp.value = '';
  return newMessage;
}

async function fetchMessages(id) {
  let data = {'idChannel': id};
  //GET request to the messages route in our Laravel server to fetch all the messages
  await axios.post('/fetchmessages', data).then(response => {
    //Save the response in the messages array to display on the chat view
    messages = response.data;
  });
 
  showMessages(messages);
}

//Receives the message that was emitted from the ChatForm Vue component
function addMessage(message) {
  //Pushes it to the messages array
  messages.push(message);
  // addSendMessage(message);
  
  //POST request to the messages route with the message data in order for our Laravel server to broadcast it.
  axios.post('/messages', message).then(response => {
    console.log(response.data);
  });
 
}

function addSendMessage(message) {
  let li = document.createElement('li');
  let strong = document.createElement('strong');
  let p = document.createElement('p');
  strong.innerHTML = message.user.username;
  p.innerHTML = message.message;
  li.appendChild(strong);
  li.appendChild(p);
  chatMessages.firstChild.appendChild(li);
}

function showMessages(message) {
  chatMessages.innerHTML = '';
  let ul = document.createElement('ul');
  for (const m in message) {
    let li = document.createElement('li');
    let strong = document.createElement('strong');
    let p = document.createElement('p');
    p.innerHTML = message[m].message;
    strong.innerHTML = message[m].user.username;
    li.appendChild(strong)
    li.appendChild(p);
    ul.appendChild(li);
  }
  
  chatMessages.appendChild(ul);
  chatMessages.scrollTop = 1000;
}

async function getChannels() {
  let res = await axios.get('/channels').then(response => {
    channels = response.data;
    showChannels(channels);
    return response.data;
  });

  return res;
}

function showChannels(channel) {
  let ul = document.createElement('ul');
  for (const c in channel) {
    let li = document.createElement('li');
    li.innerHTML = channel[c].name;
    li.dataset.id = channel[c].to_user_id;
    li.addEventListener('click', (e) => {
      chatChannelName.innerHTML = e.target.textContent;
      chatChannelName.dataset.id = e.target.dataset.id;
      fetchMessages(e.target.dataset.id);
    });
    ul.appendChild(li);
  }
  chatChannels.appendChild(ul);
}

