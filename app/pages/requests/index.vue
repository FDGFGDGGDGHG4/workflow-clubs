<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { requests } from '~/utils/requests'

type MockState = 'ready' | 'loading' | 'empty' | 'error'

const selectedStatus = ref('')
const selectedPriority = ref('')
const search = ref('')
const state = ref<MockState>('ready')

let timer: ReturnType<typeof setTimeout> | undefined

const filteredRequests = computed(() => {
  if (state.value === 'empty') return []

  const query = search.value.trim().toLowerCase()

  return requests.filter(request =>
    (!selectedStatus.value || request.status === selectedStatus.value)
    && (!selectedPriority.value || request.priority === selectedPriority.value)
    && (!query || `${request.id} ${request.title}`.toLowerCase().includes(query)),
  )
})

function changeScenario(event: Event) {
  clearTimeout(timer)
  state.value = (event.target as HTMLSelectElement).value as MockState
}

function retry() {
  clearTimeout(timer)
  state.value = 'loading'

  timer = setTimeout(() => {
    state.value = 'ready'
  }, 1200)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <section class="requests-page">
    <p class="eyebrow">ВСЕ ОБРАЩЕНИЯ В ОДНОМ МЕСТЕ</p>
    <div class="heading">
      <div>
        <h1>Заявки</h1>
        <p class="muted">Найдено: {{ filteredRequests.length }}</p>
      </div>
      <CreateRequestModal />
    </div>

    <div class="filters">
      <label>
        Поиск
       <input
  v-model="search"
  type="search"
  placeholder="Номер или название заявки"
>
      </label>
      <label>
        Статус
        <select v-model="selectedStatus">
          <option value="">Все статусы</option>
          <option>Новая</option>
          <option>В работе</option>
          <option>Ожидает ответа</option>
          <option>Решена</option>
        </select>
      </label>
      <label>
        Приоритет
        <select v-model="selectedPriority">
          <option value="">Все приоритеты</option>
          <option>Высокий</option>
          <option>Обычный</option>
          <option>Низкий</option>
        </select>
      </label>
    </div>
   <div class="mock-controls">
  <label for="mock-state">Демонстрационный сценарий</label>
  <select id="mock-state" :value="state" @change="changeScenario">
    <option value="ready">Обычный список</option>
    <option value="loading">Загрузка</option>
    <option value="empty">Пустой список</option>
    <option value="error">Ошибка загрузки</option>
  </select>
</div>

<section
  v-if="state === 'loading'"
  class="state-panel"
  aria-busy="true"
  aria-label="Загрузка заявок"
>
  <p role="status">Загружаем заявки…</p>
  <div
    v-for="item in 6"
    :key="item"
    class="skeleton"
    aria-hidden="true"
  />
</section>

<section
  v-else-if="state === 'error'"
  class="state-panel"
>
  <p role="alert">Не удалось загрузить заявки.</p>
  <p>Демонстрационная ошибка. Попробуйте ещё раз.</p>
  <button type="button" @click="retry">
    Повторить загрузку
  </button>
</section>

<RequestList v-else :requests="filteredRequests" />
  </section>
</template>

<style scoped>
.requests-page { width: min(100%, 980px); margin: 0 auto; }
.eyebrow { color: #aaa3d0; font-size: 11px; letter-spacing: .08em; }
.heading { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
h1 { margin: 8px 0; font-size: 26px; }
.muted { color: #aaa5c4; font-size: 12px; }
button {
  padding: 10px 16px; border: 0; border-radius: 4px;
  color: white; background: linear-gradient(100deg, #7457ff, #c23fae);
  cursor: pointer;
}
button:hover { filter: brightness(1.12); }
.filters {
  display: grid; grid-template-columns: 2fr 1fr 1fr;
  gap: 12px; margin: 22px 0 14px;
}
label { display: grid; gap: 6px; color: #c8c3df; font-size: 11px; }
input, select {
  width: 100%; min-width: 0; padding: 10px;
  border: 1px solid #39345f; border-radius: 4px;
  color: #f2efff; background: #211e45;
}
:focus-visible { outline: 2px solid #42d5e9; outline-offset: 2px; }
.table-wrap { overflow-x: auto; border: 1px solid #302b58; border-radius: 5px; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 12px 10px; border-bottom: 1px solid #302b58; text-align: left; }
th { color: #aaa5c4; background: #211e45; font-weight: 500; }
td a { color: #8fcfe6; }
.badge { padding: 4px 7px; border-radius: 10px; background: #39345f; white-space: nowrap; }
.empty { padding: 32px; border: 1px solid #302b58; text-align: center; color: #aaa5c4; }
@media (max-width: 650px) {
  .filters { grid-template-columns: 1fr; }
  .heading { align-items: flex-start; }
  table { min-width: 680px; }
}
.mock-controls {
  display: grid;
  gap: 6px;
  max-width: 300px;
  margin: 16px 0;
}

.state-panel {
  padding: 24px;
  border: 1px solid #39345f;
  border-radius: 5px;
  background: #211e45;
  color: #c8c3df;
  text-align: center;
}

.skeleton {
  height: 36px;
  margin-top: 10px;
  border-radius: 4px;
  background: #393475;
}
</style>