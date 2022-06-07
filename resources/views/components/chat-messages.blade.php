<template>
    <ul class="chat">
      @foreach ($messages as $message)
      <li class="">
        <div class="">
          <div class="">
            <strong>
              {{ $message->user->name }}
            </strong>
          </div>
          <p>
            {{ $message->message }}
          </p>
        </div>
      </li>
      @endforeach
    </ul>
  </template>
  {{-- <script>
  /* export default {
    props: ["messages"],
  }; */
  </script> --}}