<script setup lang="ts">
import { priorities, statuses } from '~/utils/requests'
import { usePreferencesStore } from '~/stores/preferences'
const preferences = usePreferencesStore()
const { query, update, lookups, pending, error, message, items, total, pages, refresh } = useRequests()
const search = ref(query.value.search)
const debounce = useDebounce<string>(value => { void update({ search: value.trim(), page: 1 }, true) })
watch(search, value => { debounce.cancel(); if (value !== query.value.search) debounce.run(value) })
watch(() => query.value.search, value => { debounce.cancel(); search.value = value })
function filter(key: string, event: Event) {
  debounce.cancel()
  void update({ [key]: (event.target as HTMLSelectElement).value, search: search.value.trim(), page: 1 })
}
function reset() {
  debounce.cancel(); search.value = ''
  void update({ search: '', status: '', priority: '', customer: '', assignee: '', category: '', sort: 'id-desc', page: 1 })
}
const users = lookups.users.data
const customers = lookups.customers.data
const categories = lookups.categories.data
</script>

<template>
  <section class="requests-page">
    <h1>Заявки</h1><p class="muted">Все обращения в одном месте</p>
    <RequestNotice />
    <div class="toolbar"><CreateRequestModal /><label>Плотность списка<select :value="preferences.density" @change="preferences.setDensity(($event.target as HTMLSelectElement).value)"><option value="comfortable">Обычная</option><option value="compact">Компактная</option></select></label></div>
    <div class="filters">
      <label class="search">Поиск<input v-model="search" type="search" placeholder="Номер или название заявки"></label>
      <label>Статус<select :value="query.status" @change="filter('status', $event)"><option value="">Все статусы</option><option v-for="value in statuses" :key="value">{{ value }}</option></select></label>
      <label>Приоритет<select :value="query.priority" @change="filter('priority', $event)"><option value="">Все приоритеты</option><option v-for="value in priorities" :key="value">{{ value }}</option></select></label>
      <label>Клиент<select :value="query.customer" @change="filter('customer', $event)"><option value="">Все клиенты</option><option v-for="item in customers" :key="item.id" :value="item.id">{{ item.name }}</option></select></label>
      <label>Исполнитель<select :value="query.assignee" @change="filter('assignee', $event)"><option value="">Все исполнители</option><option v-for="item in users" :key="item.id" :value="item.id">{{ item.name }}</option></select></label>
      <label>Категория<select :value="query.category" @change="filter('category', $event)"><option value="">Все категории</option><option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</option></select></label>
      <label>Сортировка<select :value="query.sort" @change="filter('sort', $event)"><option value="id-desc">Сначала новые</option><option value="id-asc">Сначала старые</option><option value="title">По названию</option></select></label>
      <label>На странице<select :value="query.pageSize" @change="filter('pageSize', $event)"><option :value="6">6</option><option :value="12">12</option><option :value="24">24</option></select></label>
      <button class="secondary" type="button" @click="reset">Сбросить фильтры</button>
    </div>
    <section v-if="pending" class="state-panel" aria-busy="true"><p role="status">Загружаем заявки…</p></section>
    <section v-else-if="error" class="state-panel"><p role="alert">{{ message }}</p><button type="button" @click="refresh()">Повторить загрузку</button></section>
    <template v-else>
      <RequestList :requests="items" />
      <nav class="pagination" aria-label="Страницы заявок">
        <span class="muted" aria-live="polite">Показано {{ total ? (query.page - 1) * query.pageSize + 1 : 0 }}–{{ Math.min(query.page * query.pageSize, total) }} из {{ total }}</span>
        <div><button class="secondary" :disabled="query.page <= 1" @click="update({ page: query.page - 1 })">Назад</button><span> {{ query.page }} / {{ pages }} </span><button class="secondary" :disabled="query.page >= pages" @click="update({ page: query.page + 1 })">Далее</button></div>
      </nav>
    </template>
  </section>
</template>

<style scoped>
.requests-page { width: min(100%, 1000px); margin: 0 auto; }
h1 { margin: 8px 0 16px; font-size: 26px; }
.muted { color: #b4adca; font-size: 12px; }
.requests-page > .muted { margin-bottom: 24px; }
.toolbar { display: flex; align-items: end; justify-content: space-between; gap: 16px; margin: 20px 0; }
.toolbar label { min-width: 160px; }
.filters { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin: 22px 0; align-items: end; }
label { display: grid; gap: 8px; color: #d0c9e4; font-size: 11px; }
input, select { width: 100%; min-width: 0; padding: 11px; border: 1px solid #39345f; border-radius: 3px; color: #ddd7ee; background: #252149; font-size: 12px; }
.secondary { border: 1px solid #514a81; background: transparent; font-size: 12px; }
button:disabled { opacity: .45; cursor: not-allowed; }
.state-panel { padding: 24px; border: 1px solid #39345f; border-radius: 4px; background: #252149; color: #c8c3df; text-align: center; }
.pagination { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 22px; font-size: 12px; }
.pagination div { display: flex; align-items: center; gap: 14px; }
@media (max-width: 650px) { .filters { grid-template-columns: 1fr; } .toolbar, .pagination { align-items: start; flex-direction: column; } }
</style>
