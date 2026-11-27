<script setup lang="ts">
import { ref, watch } from 'vue'

const { query, update, lookups, pending, error, message, items, total, pages, refresh } = useRequests()
const search = ref(query.value.search)
const debounce = useDebounce<string>(value => { void update({ search: value.trim(), page: 1 }, true) })
watch(search, value => {
  debounce.cancel()
  if (value !== query.value.search) debounce.run(value)
})
watch(() => query.value.search, value => { debounce.cancel(); search.value = value })
function filter(key: string, event: Event) {
  debounce.cancel()
  void update({ [key]: (event.target as HTMLSelectElement).value, search: search.value.trim(), page: 1 })
}
function reset() {
  debounce.cancel()
  search.value = ''
  void update({ search: '', status: '', priority: '', customer: '', assignee: '', category: '', sort: 'id-desc', page: 1 })
}
const users = lookups.users.data
const customers = lookups.customers.data
const categories = lookups.categories.data
</script>

<template>
  <section class="requests-page">
    <p class="eyebrow">ВСЕ ОБРАЩЕНИЯ В ОДНОМ МЕСТЕ</p>
    <div class="heading">
      <div><h1>Заявки</h1><p class="muted" aria-live="polite">Найдено: {{ total }}</p></div>
      <CreateRequestModal />
    </div>
    <div class="filters">
      <label class="search">Поиск<input v-model="search" type="search" placeholder="Номер или название заявки"></label>
      <label>Статус<select :value="query.status" @change="filter('status', $event)">
        <option value="">Все статусы</option><option>Новая</option><option>В работе</option><option>Ожидает ответа</option><option>Решена</option>
      </select></label>
      <label>Приоритет<select :value="query.priority" @change="filter('priority', $event)">
        <option value="">Все приоритеты</option><option>Высокий</option><option>Обычный</option><option>Низкий</option>
      </select></label>
      <label>Клиент<select :value="query.customer" @change="filter('customer', $event)">
        <option value="">Все клиенты</option><option v-for="item in customers" :key="item.id" :value="item.id">{{ item.name }}</option>
      </select></label>
      <label>Исполнитель<select :value="query.assignee" @change="filter('assignee', $event)">
        <option value="">Все исполнители</option><option v-for="item in users" :key="item.id" :value="item.id">{{ item.name }}</option>
      </select></label>
      <label>Категория<select :value="query.category" @change="filter('category', $event)">
        <option value="">Все категории</option><option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</option>
      </select></label>
      <label>Сортировка<select :value="query.sort" @change="filter('sort', $event)">
        <option value="id-desc">Номер по убыванию</option><option value="id-asc">Номер по возрастанию</option><option value="title">По названию</option>
      </select></label>
      <label>На странице<select :value="query.pageSize" @change="filter('pageSize', $event)">
        <option :value="6">6</option><option :value="12">12</option><option :value="24">24</option>
      </select></label>
      <button type="button" @click="reset">Сбросить фильтры</button>
    </div>
    <section v-if="pending" class="state-panel" aria-busy="true" aria-label="Загрузка заявок">
      <p role="status">Загружаем заявки…</p><div v-for="item in 6" :key="item" class="skeleton" aria-hidden="true" />
    </section>
    <section v-else-if="error" class="state-panel">
      <p role="alert">{{ message }}</p><button type="button" @click="refresh()">Повторить загрузку</button>
    </section>
    <template v-else>
      <RequestList :requests="items" />
      <nav class="pagination" aria-label="Страницы заявок">
        <button :disabled="query.page <= 1" @click="update({ page: query.page - 1 })">← Назад</button>
        <span>Страница {{ query.page }} из {{ pages }}</span>
        <button :disabled="query.page >= pages" @click="update({ page: query.page + 1 })">Вперёд →</button>
      </nav>
    </template>
  </section>
</template>

<style scoped>
.requests-page { width: min(100%, 980px); margin: 0 auto; }
.eyebrow { color: #aaa3d0; font-size: 11px; letter-spacing: .08em; }
.heading { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
h1 { margin: 8px 0; font-size: 26px; }
.muted { color: #aaa5c4; font-size: 12px; }
button { padding: 10px 16px; border: 0; border-radius: 4px; color: white; background: linear-gradient(100deg, #7457ff, #c23fae); cursor: pointer; }
button:disabled { opacity: .45; cursor: not-allowed; }
.filters { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 22px 0; align-items: end; }
label { display: grid; gap: 6px; color: #c8c3df; font-size: 11px; }
input, select { width: 100%; min-width: 0; padding: 10px; border: 1px solid #39345f; border-radius: 4px; color: #f2efff; background: #211e45; }
:focus-visible { outline: 2px solid #42d5e9; outline-offset: 2px; }
.state-panel { padding: 24px; border: 1px solid #39345f; border-radius: 5px; background: #211e45; color: #c8c3df; text-align: center; }
.skeleton { height: 36px; margin-top: 10px; border-radius: 4px; background: #393475; animation: pulse 1.2s ease-in-out infinite alternate; }
.pagination { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 20px; font-size: 12px; }
@keyframes pulse { to { opacity: .35; } }
@media (prefers-reduced-motion: reduce) { .skeleton { animation: none; } }
@media (max-width: 650px) { .filters { grid-template-columns: 1fr; } .heading { align-items: flex-start; } }
</style>
