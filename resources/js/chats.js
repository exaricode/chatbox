
require('./bootstrap');

const sendMessageBtn = document.getElementById('sendMessageBtn');
const sendMessageInp = document.getElementById('sendMessageInp');

let newMessage = '';

sendMessageInp.addEventListener('keyup', (e) => {
    sendMessage();
})

sendMessageBtn.addEventListener('click', () => {
    sendMessage();
})
     //Takes the "user" props from <chat-form> … :user="{{ Auth::user() }}"></chat-form> in the parent chat.blade.php.
     /* props: ["user"],
     data() {
       return {
         newMessage: "",
       };
     } */
     
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
