<template>    
    <div class="w-full py-2 px-4 mb-4 mr-4
        border-2 border-solid border-black rounded">
        <div class="flex justify-start"><span class=mr-auto>Chat name</span>
            <button class="w-6 border-1 border-black rounded-sm bg-slate-300" >X</button>
        </div>
        <div class="grid grid-cols-4">
            {{-- users component --}}
            <x-chat-messages :messages="$messages" class="col-span-3"></x-chat-messages>
        </div>
        <div class="">
            <x-chat-form user="{{ Auth::user() }}"></x-chat-form>
        </div>
    </div>
</template>