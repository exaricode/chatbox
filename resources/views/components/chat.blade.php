
<template>    
    <div class="w-full py-2 px-4 mb-4 mr-4
        border-2 border-solid border-black rounded">
        <div class="flex justify-start"><span class=mr-auto>Chat name</span>
            <button class="w-6 border-1 border-black rounded-sm bg-slate-300" v-on:click="openChat">X</button>
        </div>
        <div class="grid grid-cols-4">
            {{-- users component --}}
            <chat-messages class="col-span-3" :messages="messages"></chat-messages>
        </div>
        <div class="">
            <chat-form v-on:messagesent="addMessage" :user="{{ Auth::user() }}"></chat-form>
        </div>
    </div>
</template>