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

class Message {
  id; message; user; created_at; is_read; channelName;
  constructor(message) {
    this.id = message.message.id;
    this.message = message.message.message;
    this.user = message.user;
    this.created_at = message.message.created_at;
    this.is_read = message.message.is_read;
    this.channelName = message.channelName;
  } 

  get isRead() {
    return this.is_read;
  }

  set isRead(num) {
    this.is_read = num;
  }
}

window.addEventListener('load', () => {
  chatWindow.style.display = 'none'; 
  getUser();
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
  
  if (!firstOpenChat) {
  // send message on click and on enter key
    sendMessageInp.addEventListener('keyup', (e) => e.key == 'Enter' ? sendMessage() : '');
    
    sendMessageBtn.addEventListener('click', () => {
      sendMessage();
  });
  
    firstOpenChat = true;
    initChannels();
  } else if (messages.length > 0) {
      let len = messages.length - 1;
      for (let i = len; i >= 0; i--) {
        if (messages[i].is_read == 2) {
          break;
        }
        isRead(messages[i]);
      }
  }
});

// setup broadcast channels and echo listener first time chat is opened
function initChannels() {
  let channel = getChannels();

    channel.then(x => {
      for(const c in x) {
        let n = x[c].name;
        window.Echo.private(n)
          .listen('MessageSend', (e) => {
            e.channelName = e.channelName == null ? checkChatName : e.channelName;
  
            const m = new Message(e);
            if (e.message.message != null){
                messages.push(m);
            }

            // add unread class to channel and show notification
            if ((m.user.username != user.username && document.visibilityState != 'visible') || 
            (m.user.username != user.username && checkChatName != e.channelName) || !openChat) {
              const listId = Array.from(chatChannels.firstElementChild.childNodes);
                
              listId.filter(elem => {
                  elem.dataset.id == e.user.id ? elem.classList.add('unread') : ''
                });
                
              showNotification(m.message, m.user.username);
            } 

            // set the message read status
            if (checkChatName == e.channelName){
              if (user.id === e.message.to_user_id){
                m.isRead = openChat ? 2 : 1;
                isRead(m);
              }
              addSendMessage(m);
            } else {
              if (user.id === e.message.to_user_id) {
                m.isRead = firstOpenChat ? 1 : 0;
                isRead(m);
              }
            }
          })
          .listen('isRead', (e) => {
            if (e.id != null) {
              if (e.id != null && openChat && chatMessages.firstElementChild.hasChildNodes()) {
                const message_id = Array.from(chatMessages.firstElementChild.childNodes);
                const m = message_id.filter(elem => {
                  if (elem.dataset != undefined){
                    return elem.dataset.message_id == e.id ? elem : undefined;
                  }
                });

                if (m[0] != undefined && m != undefined) {
                  e.is_read == 2 ? m[0].lastElementChild.lastElementChild.className = 'read' :
                    e.is_read == 1 ? m[0].lastElementChild.lastElementChild.className = 'received' :
                    m[0].lastElementChild.lastElementChild.className = 'notReceived';

                    e.channelName = e.channelName == null ? checkChatName : e.channelName;

                    if (e.is_read != 0 && !m[0].lastElementChild.lastElementChild.classList.contains('read')) {
                      const m = new Message(e);
                      
                      isRead(m);
                    }
                } else if(e.is_read === 0 && e.id != null && m != undefined) {
                    const m = new Message(e);
                    m.isRead = 1;
                    isRead(m);
                }

              } else if (e.message != null && firstOpenChat == true ) {
                  const m = new Message(e);
                  m.isRead = 1;
                  isRead(m);
              }
            }
        });
      }
    });
}

// update message read status
async function isRead(message){
  if (message.isRead != 2 && message.channelName == checkChatName) {
    message.isRead = openChat && firstOpenChat ? 2 :
                  !openChat && firstOpenChat ? 1 : 0;
  }
  if (message.isRead == 2 && message.user != undefined){
    const listId = Array.from(chatChannels.firstElementChild.childNodes);
      
    listId.filter(elem => {
      elem.dataset.id == message.user.id ? elem.classList.remove('unread') : ''
      });
  }
  if (message.message != null && message.message != undefined ){
    await axios.post('/isread', message);
  }
}

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
    messages.forEach(elem => {
      if (elem.is_read != 2 && elem.to_user_id == user.id) {
        elem.is_read = 2;
        elem.channelName = chatChannelName.textContent;
        isRead(elem);
      }
    });
  });
 
  showMessages(messages);
}

// Receives the message
function addMessage(message) {
  // Pushes it to the messages array
  if (message.message != null) {
    messages.push(message);
    
    // POST request to the messages to broadcast it.
    axios.post('/messages', message);
  }
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
    
    // i.innerHTML = 'vv';
    i.appendChild(createSvg(message.is_read));

    /* add class based on messages.is_read
    *    if 0 not received
    *     if 1 received, not read
    *     if 2 received and read
    */
    message.is_read === 0 ? i.className = 'notReceived' :
      message.is_read === 1 ? i.className = 'received' :
      message.is_read === 2 ? i.className = 'read' : '';

    p.appendChild(i);

    if (message.user.username == user.username) {
      li.className = 'message thisUser';
    } else {
      li.className = 'message otherUser';
    }
    
    li.dataset.message_id = message.id;
    li.appendChild(strong);
    li.appendChild(p);

    chatMessages.firstElementChild.appendChild(li);
    chatMessages.scrollTop = 10000;
}

function createSvg(num){
  let strokeColor = num == 2 ? 'blue' : num == 1 ? 'grey' : 'none';
  const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  iconSvg.setAttribute('fill', 'none');
  iconSvg.setAttribute('viewbox', '0 0 24 24');
  iconSvg.setAttribute('width', '20px');
  iconSvg.setAttribute('height', '10px');
  iconSvg.setAttribute('stroke', strokeColor);

  iconPath.setAttribute('d', 
    'M0 0 L5 10 L15 0 M5 0 L10 10 L20 0');
  iconPath.setAttribute('stroke-width', 2);

  iconSvg.appendChild(iconPath);
  return iconSvg;
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
  const show = () => {
    const notification = new Notification(`${username}`, {
      body: `${message}`,
      requireInteraction: true
    });

    setTimeout(()=> {
      notification.close();
    }, 10 * 1000);

  notification.addEventListener('click', () => {
    window.focus();
  });
}

  const showError = () => {
    alert('Notifications blocked');
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