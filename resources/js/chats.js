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
let firstOpenChat = false;
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
  });
}

// open chat
openChatBtn.addEventListener('click', () => {
  // Show chat / hide button
  openChat = true;
  chatWindow.style.display = 'grid';
  openChatBtn.style.display = 'none';
  
  // send message on click and on enter key
  sendMessageInp.addEventListener('keyup', (e) => e.key == 'Enter' ? sendMessage() : '');
  
  sendMessageBtn.addEventListener('click', () => {
    sendMessage();
  });
  
  if (!firstOpenChat) {
    firstOpenChat = true;
    initChannels();
  }
});

// setup broadcast channels and echo listener first time chat is opened
function initChannels() {
  let channel = getChannels();
  let readStatus = {
    status: '0'
  };

    channel.then(x => {
      for(const c in x) {
        let n = x[c].name;
        window.Echo.private(n)
          .listen('MessageSend', (e) => {
            console.log(e);

            const m = { 
              id: e.message.id,
              message: e.message.message,
              user: e.user,
              created_at: e.message.created_at,
              is_read: e.message.is_read,
              channelName: e.channelName
            }
            messages.push(m);

            if (checkChatName == e.channelName){
              addSendMessage(m);
            
              console.log(`openchat 100: ${openChat}`);
              if (user.id === e.message.to_user_id){
                console.log('102: user id is true');
                m.is_read = openChat && firstOpenChat ? 2 :
                    !openChat && firstOpenChat ? 1 : 0;
                  console.log(`106: ${m.is_read}`);
                  // axios.post('/isread', m);
                  if (m.is_read != 0) {
                    (async function(){
                      await axios.post('/isread', m)
                      .then(response => {
                        console.log('109: is read axios');
                        console.log(response);
                      });
                    })();
                  }
              }
            }

            if ((m.user.username != user.username && document.visibilityState != 'visible') || 
              (m.user.username != user.username && checkChatName != e.channelName)) {
                const listId = Array.from(chatChannels.firstElementChild.childNodes);
                
                listId.filter(elem => {
                   elem.dataset.id == e.user.id ? elem.classList.add('unread') : ''
                  });
                
              showNotification(m.message, m.user.username);
            } 

            // readStatus.status = openChat && firstOpenChat ? '2' : '1';
          })
          .listen('isRead', (e) => {
            console.log('133: listen is read');
            console.log(e);
            const message_id = Array.from(chatMessages.firstElementChild.childNodes);
            const m = message_id.filter(elem => {
              return elem.dataset.message_id == e.id ? elem : '';
            });

            if (m[0] != undefined && m != undefined && user.id == e.to_user) {
              e.is_read == 2 ? m[0].lastElementChild.lastElementChild.classList.add('read') :
                e.is_read == 1 ? m[0].lastElementChild.lastElementChild.classList.add('received') :
                m[0].lastElementChild.lastElementChild.classList.add('notReceived');
            
                if (e.is_read != 0) {
                  (async function() {
                    await axios.post('/isreadupdate', e)
                      .then(response => {
                        console.log('149: listen is read');
                        console.log(response);
                      });
                  })();
                }
            }
        });
      }
    });
}
/* 
function isRead(message, channel){
  console.log('isRead function');
  console.log(channel);
  window.Echo.private(channel).whisper('isRead', {
    is_read : openChat && firstOpenChat ? 2 :
      !openChat && firstOpenChat ? 1 : 0 
  });
} */

// close chat
closeChat.addEventListener('click', () => {
  openChat = false;
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
        channelName: chatChannelName.textContent,
        to_user_id: chatChannelName.dataset.id,
        created_at: new Date(),
        is_read: 0
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
    i = document.createElement('i');
    // TODO: add svg
    i.innerHTML = 'vv';

    /* add class based on messages.is_read
    *    if 0 not received
    *     if 1 received, not read
    *     if 2 received and read
    */
    message.is_read === 0 ? i.classList.add('notReceived') :
      message.is_read === 1 ? i.classList.add('received') :
      message.is_read === 2 ? i.classList.add('read') : '';

    p.appendChild(i);

    if (message.user.username == user.username) {
      li.classList.add('message', 'thisUser');
    } else {
      li.classList.add('message', 'otherUser');
    }
    li.dataset.message_id = message.id;
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