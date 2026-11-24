<script setup lang="ts">
</script>

<template>
  <div class="public-shell">
    <header class="public-header">
      <NuxtLink class="public-brand" to="/">WorkFlow</NuxtLink>

      <nav aria-label="Публичная навигация">
        <NuxtLink to="/">Главная</NuxtLink>
        <NuxtLink to="/login">Войти</NuxtLink>
      </nav>
    </header>

    <main class="public-content">
      <slot />
    </main>

    <footer class="public-footer">
      WorkFlow © 2026 · Интегратор детских кружков
    </footer>
  </div>
</template>

<style scoped>
.public-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: min(100%, 1120px);
  margin: auto;
  background: #191633;
}

.public-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 64px;
  padding: 16px 28px;
  border-bottom: 1px solid #302b58;
}

.public-brand {
  font-weight: 700;
}

.public-header nav {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  font-size: 13px;
}

.public-header a {
  color: #c8c3df;
}

.public-header a:hover {
  color: white;
}

.public-header a:focus-visible {
  outline: 2px solid #42d5e9;
  outline-offset: 4px;
}

.public-content {
  flex: 1;
  padding: 28px;
}

.public-footer {
  padding: 18px 28px;
  background: #15132a;
  color: #aaa5c4;
  font-size: 12px;
}

@media (max-width: 600px) {
  .public-header,
  .public-footer {
    padding: 16px;
  }

  .public-content {
    padding: 24px 16px;
  }
}
</style>