<script setup lang="ts">
definePageMeta({
  layout: 'public',
})
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const message = ref('')

function signIn() {
  message.value = email.value && password.value
    ? 'Демо-вход выполнен. Подключение к серверу пока не настроено.'
    : 'Заполни электронную почту и пароль.'
}
</script>

<template>
  <main class="login-page">
    <form class="login-card" @submit.prevent="signIn">
      <p class="eyebrow">WORKFLOW</p>
      <h1>С возвращением</h1>
      <p class="hint">Войдите для работы с заявками</p>

      <label for="email">Электронная почта</label>
      <input
        id="email"
        v-model="email"
        type="email"
        placeholder="name@example.com"
        autocomplete="email"
        required
      >

      <label for="password">Пароль</label>
      <input
        id="password"
        v-model="password"
        type="password"
        placeholder="••••••••"
        autocomplete="current-password"
        required
      >

      <button type="submit">Войти</button>
      <p v-if="message" class="message" role="status">{{ message }}</p>
      <NuxtLink class="back-link" to="/">Вернуться на главную</NuxtLink>
    </form>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 65vh;
  display: grid;
  place-items: start center;
  padding: 24px 0;
}
.login-card {
  width: min(100%, 360px);
  padding: 24px;
  border: 1px solid #302b58;
  border-radius: 5px;
  background: #211e45;
}
.eyebrow {
  margin: 0 0 18px;
  color: #b6a8ff;
  font-size: 11px;
  letter-spacing: .08em;
}
h1 { margin: 0; font-size: 23px; }
.hint { margin: 8px 0 22px; color: #aaa5c4; font-size: 13px; }
label { display: block; margin: 14px 0 6px; font-size: 12px; }
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #39345f;
  border-radius: 4px;
  background: #191633;
  color: #f2efff;
}
input:focus-visible, button:focus-visible, a:focus-visible {
  outline: 2px solid #42d5e9;
  outline-offset: 3px;
}
button {
  width: 100%;
  margin-top: 18px;
  padding: 10px;
  border: 0;
  border-radius: 4px;
  background: linear-gradient(100deg, #7457ff, #c23fae);
  color: white;
  cursor: pointer;
}
button:hover { filter: brightness(1.12); }
.message { color: #76dce5; font-size: 12px; }
.back-link {
  display: inline-block;
  margin-top: 16px;
  color: #77d5e2;
  font-size: 12px;
}
</style>