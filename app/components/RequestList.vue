<script setup lang="ts">
import { priorities, statuses } from '~/utils/requests'
import type { SupportRequest } from '~/utils/requests'
import { usePreferencesStore } from '~/stores/preferences'
import { useRequestUiStore } from '~/stores/requestUi'

defineProps<{ requests: SupportRequest[] }>()
const preferences = usePreferencesStore()
const ui = useRequestUiStore()
const route = useRoute()
const { change } = useRequestMutations()
async function update(request: SupportRequest, field: 'priority' | 'status', event: Event) {
  const select = event.target as HTMLSelectElement
  const old = request[field]
  if (!await change(request.id, field, select.value)) select.value = old
}
</script>

<template>
  <div v-if="requests.length" class="request-list" :class="{ compact: preferences.density === 'compact' }">
    <table>
      <caption class="sr-only">Список заявок</caption>
      <thead><tr><th scope="col">Номер</th><th scope="col">Заявка</th><th scope="col">Клиент</th><th scope="col">Исполнитель</th><th scope="col">Статус</th><th scope="col">Приоритет</th></tr></thead>
      <tbody><tr v-for="request in requests" :key="request.id">
        <td><NuxtLink :to="{ path: `/requests/${request.id}`, query: route.query }">{{ request.id }}</NuxtLink></td>
        <td><NuxtLink :to="{ path: `/requests/${request.id}`, query: route.query }">{{ request.title }}</NuxtLink></td>
        <td>{{ request.client }}</td><td>{{ request.assignee }}</td>
        <td><select class="status" :data-status="request.status" :aria-label="`Статус заявки ${request.id}`" :value="request.status" :disabled="ui.busy" @change="update(request, 'status', $event)"><option v-for="value in statuses" :key="value">{{ value }}</option></select></td>
        <td><select :data-priority="request.priority" :aria-label="`Приоритет заявки ${request.id}`" :value="request.priority" :disabled="ui.busy" @change="update(request, 'priority', $event)"><option v-for="value in priorities" :key="value">{{ value }}</option></select></td>
      </tr></tbody>
    </table>
  </div>
  <p v-else class="empty" role="status">Заявок с такими фильтрами нет.</p>
</template>

<style scoped>
.request-list { overflow-x: auto; border: 1px solid #39345f; border-radius: 4px; background: #252149; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 16px 12px; text-align: left; }
.compact td { padding-top: 8px; padding-bottom: 8px; }
th { color: #c1b9df; background: #312b65; font-weight: 500; font-size: 11px; }
tbody tr:hover, tbody tr:focus-within { background: #2d2855; }
td:first-child { color: #aaa2c6; font-size: 11px; white-space: nowrap; }
td:nth-child(2) { min-width: 180px; }
a:hover { color: #83d8ee; }
select { max-width: 140px; border: 1px solid transparent; border-radius: 4px; padding: 5px 3px; color: #c8bff3; background: transparent; font-size: 11px; cursor: pointer; }
select:hover, select:focus { border-color: #60588c; }
option { background: #252149; color: #eeeafa; }
select:disabled { opacity: .6; cursor: wait; }
.status { border-radius: 18px; color: #ffda89; background: #49405c; }
[data-status='Новая'] { color: #c5bbff; background: #373165; }
[data-status='Решена'] { color: #7ce0b9; background: #234c49; }
[data-priority='Критический'] { color: #ff8fab; }
[data-priority='Высокий'] { color: #ffda89; }
.empty { padding: 32px 16px; border: 1px solid #39345f; text-align: center; color: #aaa5c4; }
.sr-only { position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip-path: inset(50%); }
@media (max-width: 700px) { table { min-width: 800px; } }
</style>
