<div id="chatWindow">
    <div id="chatMenu"><span id="chatChannelName">Chat name</span>
        <button id="closeChat" class="chatBtn">X</button>
    </div>
    <div id="chatScreen">
      <div id="chatChannels">
      </div>
      <div id="chatMessages">
          <ul>
          </ul>
      </div>
    </div>
    <div id="chatSend">
        <!-- Input field. -->
        <input
            id="sendMessageInp"
            type="text"
            name="message"
            placeholder="Type your message here..."
            value=""
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