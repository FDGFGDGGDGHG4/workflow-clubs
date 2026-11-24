<template>
  <div class="app-shell">
    <header class="topbar">
      <NuxtLink class="brand" to="/">WorkFlow</NuxtLink>
      <nav aria-label="Основная навигация">
        <NuxtLink to="/dashboard">Обзор</NuxtLink>
        <NuxtLink to="/requests">Заявки</NuxtLink>
        <NuxtLink to="/profile">Профиль</NuxtLink>
        <NuxtLink class="login-link" to="/login">Войти</NuxtLink>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer>WorkFlow © 2026 <span>Поддержка · FAQ</span></footer>
  </div>
</template>

<style>
:root {
  font-family: Inter, Arial, sans-serif;
  color: #f2efff;
  background: #17142f;
  font-synthesis: none;
}
* { box-sizing: border-box; }
body { margin: 0; min-width: 320px; background: #17142f; }
a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; }
.app-shell {
  width: min(100% - 32px, 1120px);
  min-height: 100vh;
  margin: auto;
  display: flex;
  flex-direction: column;
  background: #191633;
}
.topbar {
  min-height: 64px;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #302b58;
}
.brand { font-weight: 700; letter-spacing: .2px; }
nav { display: flex; align-items: center; gap: 22px; font-size: 13px; }
nav a { color: #c8c3df; }
nav a:hover, nav a:focus-visible { color: #fff; }
.login-link, button, .button {
  border: 0;
  border-radius: 4px;
  padding: 9px 16px;
  color: white;
  background: linear-gradient(100deg, #7457ff, #c23fae);
  cursor: pointer;
}
a:focus-visible, button:focus-visible, input:focus-visible,
select:focus-visible, textarea:focus-visible {
  outline: 2px solid #42d5e9;
  outline-offset: 3px;
}
main { flex: 1; padding: 36px 28px; }
footer {
  padding: 18px 28px;
  color: #8f89ad;
  background: #15132a;
  font-size: 12px;
}
footer span { float: right; color: #56c8d9; }
@media (max-width: 600px) {
  .app-shell { width: 100%; }
  .topbar { padding: 0 16px; min-height: 56px; }
  nav { gap: 12px; font-size: 12px; }
  nav a:nth-child(3) { display: none; }
  main { padding: 24px 16px; }
  footer { padding: 16px; }
}
</style>