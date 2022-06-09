
<div>
    <div class="flex justify-start"><span class=mr-auto>Chat name</span>
        <button id="closeChat" class="chatBtn" >X</button>
    </div>
    <div id="chatMessages">
    </div>
    <div class="" user="{{ Auth::user() }}">
        <!-- Input field. -->
        <input
            id="sendMessageInp"
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
            <button class="chatBtn" id="sendMessageBtn">
            Send
            </button>
        </span>
    </div>
</div>

{{-- @push('main') --}}
<script>
   
  
    sendMessageInp.addEventListener('keyup', (e) => {
      sendMessage();
    })
  
    sendMessageBtn.addEventListener('click', () => {
      sendMessage();
    })
  </script> 
{{-- @endpush --}}