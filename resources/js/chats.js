"use strict";

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
let checkChatName = '';

window.addEventListener('load', () => {
  chatWindow.style.display = 'none'; 
  getUser();

  if(!('serviceWorker' in navigator)) {
    return
  }

  navigator.serviceWorker.register('notificationWorker.js')
      .then(
        reg => {
          console.log(`registration ${reg}`);
          console.log(reg);
          console.log(navigator.serviceWorker);
        },
        err => {
          console.error(`failed ${err}`);
          console.error(err);
        }
      );
  
});

// get username
async function getUser () {
  await axios.post('/username').then(response => {
    user = response.data;
    console.log(user);
  });
}

// open chat
openChatBtn.addEventListener('click', () => {
  // Show chat / hide button
  chatWindow.style.display = 'grid';
  openChatBtn.style.display = 'none';
  
  // send message on click and on enter key
  sendMessageInp.addEventListener('keyup', (e) => e.key == 'Enter' ? sendMessage() : '');
  
  sendMessageBtn.addEventListener('click', () => {
    sendMessage();
  });
  
  if (!openChat) {
    let channel = getChannels();
    
    channel.then(x => {
      for(const c in x) {
        let n = x[c].name;
        window.Echo.private(n)
          .listen('MessageSend', (e) => {
            const m = { 
              message: e.message.message,
              user: e.user,
              created_at: e.message.created_at
            }
            messages.push(m);

            if (checkChatName == e.channelName){
              addSendMessage(m);
            }

            console.log(document.visibilityState);
            if ((m.user.username != user.username && document.visibilityState != 'visible') || 
              (m.user.username != user.username && checkChatName != e.channelName)) {
                const listId = Array.from(chatChannels.firstElementChild.childNodes);
                
                listId.filter(elem => {
                   elem.dataset.id == e.user.id ? elem.classList.add('unread') : ''
                  });
                
              showNotification(m.message, m.user.username);
            }
          });
      }
    });
    openChat = true;
  }
});

// close chat
closeChat.addEventListener('click', () => {
  chatWindow.style.display = 'none';
  openChatBtn.style.display = 'inline-block';
})

// send message: create message / add message
function sendMessage() {
  // Create a newMessage object to send including user and channelname
  if (chatChannelName.textContent != 'Chat name' && chatChannelName != '') {
    newMessage = {
        user: user,
        message: sendMessageInp.value,
        chatname: chatChannelName.textContent,
        to_user_id: chatChannelName.dataset.id,
        created_at: new Date()
    }
    
    addMessage(newMessage);
    // Clear the input
    newMessage = "";
    sendMessageInp.value = '';
    return newMessage;
  }
}

// get messages from database
async function fetchMessages(id) {
  let data = {'idChannel': id};
  // GET request to fetch all the messages
  await axios.post('/fetchmessages', data).then(response => {
    // Save the response in the messages array
    messages = response.data;
  });
 
  showMessages(messages);
}

// Receives the message
function addMessage(message) {
  // Pushes it to the messages array
  messages.push(message);
  
  // POST request to the messages to broadcast it.
  axios.post('/messages', message).then(response => {
    console.log(response.data);
  });
}

// Append new message
function addSendMessage(message) {
    let time = new Date(message.created_at);

    let li = document.createElement('li');
    let strong = document.createElement('strong');
    let p = document.createElement('p');
    let i = document.createElement('i');
    strong.innerHTML = message.user.username;
    p.innerHTML = message.message;
    i.innerHTML = time.getHours() + ' : ' + 
      (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes());

    i.style.display = 'block'
    i.style.textAlign = 'end';

    p.appendChild(i);

    if (message.user.username == user.username) {
      li.classList.add('message', 'thisUser');
    } else {
      li.classList.add('message', 'otherUser');
    }

    li.appendChild(strong);
    li.appendChild(p);

    chatMessages.firstElementChild.appendChild(li);
    chatMessages.scrollTop = 10000;
}

function showMessages(message) {
  for (const m in message) {
    addSendMessage(message[m]);
  }
}

// get broadcast channels
async function getChannels() {
  let res = await axios.get('/channels').then(response => {
    channels = response.data;
    showChannels(channels);
    return response.data;
  });
  return res;
}

// append channels to chatChannels
function showChannels(channel) {
  let ul = document.createElement('ul');
  for (const c in channel) {
    let li = document.createElement('li');
    li.innerHTML = channel[c].name;
    li.dataset.id = channel[c].to_user_id;

    li.addEventListener('click', (e) => {
      e.target.classList.remove('unread');
      if (checkChatName != e.target.textContent) {
        while (chatMessages.firstElementChild.hasChildNodes()){
          chatMessages.firstElementChild.removeChild(chatMessages.firstElementChild.firstChild);
        }
      
        chatChannelName.innerHTML = e.target.textContent;
        chatChannelName.dataset.id = e.target.dataset.id;
        checkChatName = e.target.textContent;
        fetchMessages(e.target.dataset.id);
      }
    });
    ul.appendChild(li);
  }
  chatChannels.appendChild(ul);
}

// Check and create notifications
async function showNotification(message, username) {
  const options = {
    includeUncontrolled: true,
    type: 'window'
  }

  const show = () => {
    navigator.serviceWorker.ready.then(function(registration) {
      console.log('show notification register');
      console.log(registration);
      registration.showNotification(`${username}`, {
        body: `${message}`,
        requireInteraction: true,
        defaultPrevented: true,
        onclick: self.focus(),
        onshow: document.addEventListener('visibilitychange', () => {
          // registration.Notification.close();
        })
      });
    });
}

  const showError = () => {
    // const error = 
    alert('Notifications blocked');
    // error.style.display = 'block';
    // error.textContent = 'You blocked the notifications';
  }

  let granted = false;

  if (Notification.permission === 'granted') {
    granted = true;
  } else if (Notification.permission === 'denied') {
    let permission = await Notification.requestPermission();
    granted = permission === 'granted' ? true : false;
  }

  granted ? show() : showError();
}