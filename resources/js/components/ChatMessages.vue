<template>
  <ul class="chat">
    <li class="" v-for="message in messages" :key="message.id">
      <div class="">
        <div class="">
          <strong>
            {{ message.user.name }}
          </strong>
        </div>
        <p>
          {{ message.message }}
        </p>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  props: ["messages"],
};
</script>