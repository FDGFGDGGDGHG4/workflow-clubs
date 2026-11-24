<script setup lang="ts">
definePageMeta({
  layout: 'public',
})
const steps = [
  'Создайте заявку',
  'Назначьте исполнителя',
  'Подтвердите решение',
]
</script>

<template>
  <main class="home">
    <section class="hero">
      <div class="intro">
        <p class="eyebrow">ЗАЯВКИ · КОМАНДА · РЕЗУЛЬТАТ</p>
        <h1>Поддержка, в которой ничего не теряется</h1>
        <p class="description">
          От первого обращения до решения — управляйте задачами команды
          понятно и держите ход выполнения под контролем.
        </p>
        <NuxtLink class="button" to="/requests">Начать работу</NuxtLink>
      </div>

      <div class="workflow-mark" aria-label="WorkFlow">
        <div class="mark-ring" />
      </div>
    </section>

    <section class="steps" aria-label="Как это работает">
      <article v-for="(step, index) in steps" :key="step" class="step">
        <span>{{ String(index + 1).padStart(2, '0') }}</span>
        {{ step }}
      </article>
    </section>

    <section class="features">
      <h2>Одна система для всей команды</h2>
      <div class="feature-grid">
        <article class="feature">
          <h3>Все обращения рядом</h3>
          <p>Статусы, приоритеты и история общения в одном месте.</p>
        </article>
        <article class="feature">
          <h3>Понятная ответственность</h3>
          <p>У каждой заявки есть исполнитель и следующий шаг.</p>
        </article>
        <article class="feature">
          <h3>Контроль сроков</h3>
          <p>Сроки решения и изменения всегда видны команде.</p>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home {
  width: min(100%, 980px);
  margin: 0 auto;
  padding: 44px 20px 56px;
}
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 40px;
  min-height: 250px;
}
.eyebrow {
  margin: 0 0 14px;
  color: #aaa3d0;
  font-size: 11px;
  letter-spacing: 0.08em;
}
h1 {
  max-width: 440px;
  margin: 0;
  font-size: clamp(30px, 5vw, 44px);
  line-height: 1.12;
}
.description {
  max-width: 440px;
  margin: 14px 0 20px;
  color: #aaa5c4;
  font-size: 14px;
  line-height: 1.6;
}
.button {
  display: inline-block;
  padding: 10px 18px;
  border-radius: 4px;
  background: linear-gradient(100deg, #7457ff, #c23fae);
  color: white;
  font-size: 13px;
}
.button:hover { filter: brightness(1.12); }
.button:focus-visible {
  outline: 2px solid #42d5e9;
  outline-offset: 3px;
}
.workflow-mark {
  display: grid;
  min-height: 210px;
  place-items: center;
}
.mark-ring {
  width: 104px;
  height: 104px;
  border: 13px solid transparent;
  border-top-color: #45c9d9;
  border-right-color: #39b6cf;
  border-bottom-color: #a44de5;
  border-left-color: #8755f4;
  border-radius: 32%;
  transform: rotate(-25deg);
}
.steps, .feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.steps { margin: 20px 0 44px; }
.step, .feature {
  padding: 16px;
  border: 1px solid #302b58;
  border-radius: 5px;
  background: #211e45;
  font-size: 13px;
}
.step span {
  margin-right: 8px;
  color: #b6a8ff;
  font-size: 11px;
}
h2 { margin: 0 0 16px; font-size: 19px; }
.feature h3 { margin: 0 0 8px; font-size: 13px; }
.feature p {
  margin: 0;
  color: #aaa5c4;
  font-size: 12px;
  line-height: 1.5;
}
@media (max-width: 600px) {
  .home { padding: 28px 0 40px; }
  .hero { grid-template-columns: 1fr; gap: 12px; }
  .workflow-mark { min-height: 130px; }
  .steps, .feature-grid { grid-template-columns: 1fr; }
  .steps { margin: 14px 0 34px; }
}
</style>