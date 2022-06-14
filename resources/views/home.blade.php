@extends('layouts.app')

@section('content')

<div class="h-screen w-full">
    @if (session('status'))
        <div role="alert">
            {{ session('status') }}
        </div>
    @endif
    
    @auth
    {{ __('You are logged in!') }}
    <div id="chatLocation" class="fixed bottom-4 right-4">
        
        <div>
            <button class="chatBtn" 
                id="openChatBtn">chat</button>
        </div>
    
        <x-chat></x-chat>
        
    @endauth
    </div>
</div>
@endsection


@push('main')    
<script src="{{asset('js/chats.js')}}"></script>
@endpush