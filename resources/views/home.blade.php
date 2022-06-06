@extends('layouts.app')

@section('content')

<div class="h-screen w-full">
    @if (session('status'))
        <div role="alert">
            {{ session('status') }}
        </div>
    @endif

    {{ __('You are logged in!') }}
    <div class="fixed bottom-4 right-4">
        
        <div v-if="!openChatBtn">
            <x-chat></x-chat>
        </div>
        <div v-else>
            <button class="w-full py-2 px-4
                    border-2 border-black border-solid rounded" 
                v-on:click="openChat">chat</button>
        </div>
    </div>
</div>
@endsection
