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
});

// get username
async function getUser () {
  await axios.post('/username').then(response => {
    user = response.data;
    console.log(user);
  });
}

// send message on click and on enter key
sendMessageInp.addEventListener('keyup', (e) => e.key == 'Enter' ? sendMessage() : '');

sendMessageBtn.addEventListener('click', () => {
  sendMessage();
});

// open chat
openChatBtn.addEventListener('click', () => {
  // Show chat / hide button
  chatWindow.style.display = 'grid';
  openChatBtn.style.display = 'none';

  if (!openChat) {
    let channel = getChannels();
    
    channel.then(x => {
      for(const c in x) {
        let n = x[c].name;
        window.Echo.private(n)
          .listen('MessageSend', (e) => {
            console.log(e);
            const m = { 
              message: e.message.message,
              user: e.user,
            }
            messages.push(m);

            if (checkChatName == e.channelName){
              addSendMessage(m);
            }

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
        to_user_id: chatChannelName.dataset.id
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
    let li = document.createElement('li');
    let strong = document.createElement('strong');
    let p = document.createElement('p');
    strong.innerHTML = message.user.username;
    p.innerHTML = message.message;

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
  const show = () => {
    const notification = new Notification(`${username}`, {
      body: `${message}`,
      requireInteraction: true,
      data: 'test'
     //  defaultPrevented: true,
    });
    
   /*  notification.defaultPrevented = true;
    notification.requireInteraction = true; */
    /* 
    notification.onshow = function(e) {
      e.target.defaultPrevented = true;
      e.target.requireInteraction = true;
      console.log(e);
      console.log(e.target);
      } */
    console.log('notification: ');
    console.log(notification);


    /* notification.addEventListener('show', (e) => {
      e.preventDefault();

      console.log('show');
      console.log(e);
      
    });
    
    console.log(user.is_admin);
    if (user.is_admin == 0) {
      console.log('not admin');
      setTimeout(()=> {
        notification.close();
      }, 10 * 1000); 
    } else {
      console.log('admin');
      setTimeout(() => {
        notification.close();
      }, 100 * 1000);
    } */

  notification.addEventListener('click', () => {
    window.focus();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      notification.close();
    }
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