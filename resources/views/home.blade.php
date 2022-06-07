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
        
        <div>
            <button class="w-full py-2 px-4
                    border-2 border-black border-solid rounded" 
                id="openChatBtn">chat</button>
        </div>
       
        
        <div id="chatWindow" >
            <x-chat :messages="$messages"></x-chat>
        </div>
        
    </div>
</div>
@endsection


@push('main')    
<script src="{{asset('js/chats.js')}}" defer></script>
@endpush