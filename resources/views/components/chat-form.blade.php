<template>
    <!-- Display an input field and a send button. -->
     <div class="">
       <!-- Input field. -->
       <input
         id="btn-input"
         type="text"
         name="message"
         class=""
         placeholder="Type your message here..."
         value="newMessage"
         @keyup.enter="sendMessage"
       />
       <!-- Button -->
       <span class="">
         <!-- Call sendMessage() this button is clicked. -->
         <button class="btn btn-primary btn-sm" id="sendMessageBtn">
           Send
         </button>
       </span>
     </div>
   </template>

   
   