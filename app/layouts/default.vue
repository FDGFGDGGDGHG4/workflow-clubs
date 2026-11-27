<script setup lang="ts">
import { usePreferencesStore } from '~/stores/preferences'
const preferences = usePreferencesStore()
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <NuxtLink class="brand" to="/">WorkFlow</NuxtLink>
      <nav aria-label="Основная навигация">
        <NuxtLink to="/dashboard">Обзор</NuxtLink><NuxtLink to="/requests">Заявки</NuxtLink>
        <NuxtLink class="profile-link" to="/profile"><span class="avatar">АК</span> Оператор</NuxtLink>
        <NuxtLink class="login-link" to="/login">Войти</NuxtLink>
      </nav>
    </header>
    <main><slot /></main>
    <footer><span>WorkFlow © 2026</span><label>Плотность списка <select aria-label="Общая плотность списка" :value="preferences.density" @change="preferences.setDensity(($event.target as HTMLSelectElement).value)"><option value="comfortable">Обычная</option><option value="compact">Компактная</option></select></label></footer>
  </div>
</template>

<style>
:root { font-family: 'Segoe UI', Arial, sans-serif; color: #eeecfa; background: #211d38; font-synthesis: none; }
* { box-sizing: border-box; }
body { margin: 0; min-width: 320px; background: #211d38; }
a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; }
.app-shell { width: min(100% - 32px, 1120px); min-height: 100vh; margin: auto; display: flex; flex-direction: column; background: #171433; }
.topbar { min-height: 80px; padding: 0 48px; display: flex; align-items: center; justify-content: space-between; }
.brand { font-size: 13px; font-weight: 500; }
.topbar nav { display: flex; align-items: center; gap: 20px; font-size: 12px; }
.topbar nav a { color: #c8c3df; }
.topbar nav a:hover, .topbar nav a:focus-visible { color: #fff; }
.profile-link { display: flex; align-items: center; gap: 10px; }
.avatar { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; color: #90d9f2; background: #312b65; font-size: 10px; }
.login-link, button, .button { border: 0; border-radius: 3px; padding: 10px 16px; color: white; background: linear-gradient(100deg, #7054ff, #bf42ad); cursor: pointer; }
a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible { outline: 2px solid #73d6ee; outline-offset: 3px; }
main { flex: 1; padding: 32px 48px 40px; }
footer { padding: 18px 48px; color: #aaa2c3; font-size: 11px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
footer label { display: flex; align-items: center; gap: 12px; }
footer select { border: 1px solid #443d70; padding: 6px; border-radius: 3px; color: #d9d2eb; background: #252149; font-size: 11px; }
button:disabled { cursor: not-allowed; }
@media (max-width: 700px) { .app-shell { width: 100%; } .topbar { padding: 0 16px; min-height: 64px; } .topbar nav { gap: 12px; } .login-link { display: none; } main { padding: 24px 16px; } footer { padding: 16px; flex-wrap: wrap; } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; transition-duration: .01ms !important; } }
</style>
