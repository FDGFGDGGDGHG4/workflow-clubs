<script setup lang="ts">
import type { ApiRequest, RequestActivity } from '~/types/api'
import { apiErrorMessage } from '~/utils/request-api'
import { priorities, statuses } from '~/utils/requests'
import { useRequestUiStore } from '~/stores/requestUi'

const route = useRoute()
const id = computed(() => String(route.params.id))
const lookups = useRequestLookups()
const response = useFetch<ApiRequest>(() => '/api/requests/' + encodeURIComponent(id.value), {
  key: computed(() => 'request:' + id.value), retry: 0,
})
const activity = useFetch<RequestActivity>(() => '/api/requests/' + encodeURIComponent(id.value) + '/activity', {
  key: computed(() => 'activity:' + id.value), retry: 0,
})
const raw = response.data
const request = computed(() => raw.value ? lookups.map(raw.value) : null)
const pending = computed(() => !raw.value && (response.status.value === 'pending' || lookups.pending.value))
const error = computed(() => response.error.value || lookups.error.value)
const retry = () => Promise.all([response.refresh(), lookups.refresh(), activity.refresh()])
const users = lookups.users.data
const ui = useRequestUiStore()
const { change } = useRequestMutations()
const comment = ref('')
const sending = ref(false)
const commentError = ref('')
const statusOpen = ref(false)
const nextStatus = ref('')
let operation: { text: string; id: string } | null = null
watch(id, () => { comment.value = ''; commentError.value = ''; statusOpen.value = false; operation = null })
const comments = computed(() => activity.data.value?.comments ?? [])
const history = computed(() => activity.data.value?.history ?? [])
function time(value: string) { return new Date(value).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Moscow' }) }
async function fieldChange(field: 'priority' | 'assigneeId', event: Event) {
  const select = event.target as HTMLSelectElement
  const value = select.value
  const previous = raw.value?.[field] ?? ''
  const saved = await change(id.value, field, field === 'assigneeId' && !value ? null : value)
  if (!saved) select.value = String(previous)
}
async function saveStatus() {
  if (await change(id.value, 'status', nextStatus.value)) statusOpen.value = false
}
async function addComment() {
  const text = comment.value.trim()
  if (!text || sending.value) return
  const requestId = id.value
  if (operation?.text !== text) operation = { text, id: crypto.randomUUID() }
  sending.value = true
  commentError.value = ''
  try {
    const saved = await $fetch<RequestActivity>('/api/requests/' + encodeURIComponent(requestId) + '/comments', {
      method: 'POST', body: { text, operationId: operation.id }, retry: 0,
    })
    useNuxtData<RequestActivity>('activity:' + requestId).data.value = saved
    if (id.value === requestId) { comment.value = ''; operation = null }
    ui.notice = { kind: 'success', title: 'Комментарий отправлен' }
  } catch {
    if (id.value === requestId) commentError.value = 'Не удалось отправить комментарий. Текст сохранён — попробуйте ещё раз.'
  } finally { sending.value = false }
}
</script>

<template>
  <section v-if="pending" class="panel" aria-busy="true"><p role="status">Загружаем заявку…</p></section>
  <section v-else-if="error" class="panel">
    <p role="alert">{{ apiErrorMessage(error) }}</p>
    <button type="button" @click="retry">Повторить загрузку</button>
    <NuxtLink class="back" to="/requests">К списку заявок</NuxtLink>
  </section>
  <section v-else-if="request && raw" class="detail">
    <NuxtLink class="back" :to="{ path: '/requests', query: route.query }">← К списку заявок</NuxtLink>
    <h1>{{ request.title }}</h1>
    <RequestNotice />
    <p class="muted">{{ request.id }} · {{ request.client }}</p>
    <div class="tags"><span class="status" :data-status="request.status">● {{ request.status }}</span><span :data-priority="request.priority">{{ request.priority === 'Критический' ? '⚠' : request.priority === 'Высокий' ? '⌃' : request.priority === 'Низкий' ? '⌄' : '=' }} {{ request.priority }}</span></div>
    <div class="columns">
      <div class="content-panels">
        <article class="panel"><h2>Описание проблемы</h2><p>{{ request.description }}</p></article>
        <article class="panel">
          <h2>Комментарии · {{ comments.length }}</h2>
          <p v-if="activity.status.value === 'pending'" role="status">Загружаем комментарии…</p>
          <div v-else-if="activity.error.value" role="alert"><p>Не удалось загрузить комментарии.</p><button type="button" @click="activity.refresh()">Повторить загрузку</button></div>
          <p v-else-if="!comments.length" class="muted">Комментариев пока нет.</p>
          <article v-for="item in comments" :key="item.id" class="comment"><small>{{ item.author }} · {{ time(item.createdAt) }}</small><p>{{ item.text }}</p></article>
          <form @submit.prevent="addComment">
            <label for="comment">Ваш комментарий</label>
            <textarea id="comment" v-model="comment" :disabled="sending" maxlength="4000" rows="4" placeholder="Напишите сообщение…" :aria-describedby="commentError ? 'comment-error' : undefined" />
            <p v-if="commentError" id="comment-error" class="error-text" role="alert">{{ commentError }}</p>
            <button type="submit" :disabled="sending || !comment.trim()">{{ sending ? 'Отправляем…' : commentError ? 'Повторить отправку' : 'Отправить комментарий' }}</button>
            <p v-if="sending" role="status">Отправляем комментарий…</p>
          </form>
        </article>
        <article class="panel"><h2>История заявки</h2><p v-for="item in history" :key="item.id">{{ time(item.createdAt) }} · {{ item.text }}</p></article>
      </div>
      <aside class="panel parameters">
        <h2>Параметры</h2>
        <small>Клиент</small><p>{{ request.client }}</p>
        <small>Категория</small><p>{{ request.category }}</p>
        <label for="assignee">Исполнитель</label>
        <select id="assignee" :value="raw.assigneeId || ''" :disabled="ui.busy" @change="fieldChange('assigneeId', $event)"><option value="">Не назначен</option><option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option></select>
        <label for="priority">Приоритет</label>
        <select id="priority" :value="raw.priority" :disabled="ui.busy" @change="fieldChange('priority', $event)"><option v-for="value in priorities" :key="value">{{ value }}</option></select>
        <p v-if="ui.busy" role="status">Сохраняем изменение…</p>
        <button type="button" :disabled="ui.busy" @click="nextStatus = raw.status; statusOpen = !statusOpen">Изменить статус</button>
        <form v-if="statusOpen" class="status-form" @submit.prevent="saveStatus">
          <label for="status">Новый статус</label>
          <select id="status" v-model="nextStatus" :disabled="ui.busy"><option v-for="value in statuses" :key="value">{{ value }}</option></select>
          <button type="submit" :disabled="ui.busy || nextStatus === raw.status">Сохранить статус</button>
          <button type="button" class="secondary" :disabled="ui.busy" @click="statusOpen = false">Отмена</button>
        </form>
      </aside>
    </div>
  </section>
  <section v-else class="panel"><h1>Заявка не найдена</h1><NuxtLink to="/requests">К списку заявок</NuxtLink></section>
</template>

<style scoped>
.detail { width: min(100%, 1000px); margin: 0 auto; }
.back { display: inline-block; color: #78d1ee; font-size: 12px; margin-bottom: 12px; }
h1 { margin: 14px 0 22px; font-size: 25px; line-height: 1.3; }
h2 { margin: 0 0 16px; font-size: 17px; font-weight: 600; }
.muted, .panel p { color: #b5afcd; font-size: 12px; line-height: 1.65; }
.tags { display: flex; gap: 14px; align-items: center; margin: 20px 0; font-size: 11px; }
.status { padding: 4px 9px; border-radius: 16px; background: #49405c; color: #ffda89; }
[data-status='Новая'] { color: #c5bbff; background: #373165; }
[data-status='Решена'] { color: #7ce0b9; background: #234c49; }
[data-priority='Критический'] { color: #ff8fab; }
[data-priority='Высокий'] { color: #ffda89; }
.columns { display: grid; grid-template-columns: minmax(0, 1fr) 260px; gap: 18px; align-items: start; }
.content-panels { display: grid; gap: 16px; }
.panel { padding: 20px; border: 1px solid #39345f; border-radius: 4px; background: #252149; }
.panel p { margin: 0 0 12px; white-space: pre-wrap; overflow-wrap: anywhere; }
.comment { margin-bottom: 18px; }
small, label { color: #c9c3df; font-size: 11px; }
.comment p { margin: 7px 0 0; }
label { display: block; margin: 16px 0 8px; }
textarea, select { width: 100%; padding: 11px; border: 1px solid #443d70; border-radius: 3px; color: #ddd7ee; background: #252149; font-size: 12px; }
textarea { resize: vertical; min-height: 100px; line-height: 1.6; }
button { margin-top: 12px; font-size: 12px; }
button:disabled { opacity: .45; cursor: not-allowed; }
.parameters > button, .status-form button { width: 100%; }
.parameters small { display: block; margin: 14px 0 8px; }
.secondary { border: 1px solid #514a81; background: transparent; }
.panel .error-text { margin-top: 10px; color: #ff8fab; }
.status-form { margin-top: 18px; padding-top: 2px; border-top: 1px solid #443d70; }
@media (max-width: 700px) { .columns { grid-template-columns: 1fr; } .parameters { grid-row: 1; } h1 { font-size: 22px; } }
</style>
