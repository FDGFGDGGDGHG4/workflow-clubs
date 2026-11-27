<script setup lang="ts">
import { useRequestUiStore } from '~/stores/requestUi'
const ui = useRequestUiStore()
const { undo, refresh } = useRequestMutations()
const refreshing = ref(false)
async function reload() {
  refreshing.value = true
  try { await refresh() } finally { refreshing.value = false }
}
</script>

<template>
  <section v-if="ui.notice || ui.undo" class="request-notice" :class="{ failure: ui.notice?.kind === 'error' }" :role="ui.notice?.kind === 'error' ? 'alert' : 'status'" aria-live="polite">
    <strong>{{ ui.notice?.title || 'Последнее изменение можно отменить' }}</strong>
    <p v-if="ui.notice?.message">{{ ui.notice.message }}</p>
    <div class="notice-actions">
      <button v-if="ui.notice?.kind === 'error'" type="button" :disabled="ui.busy || refreshing" @click="reload">{{ refreshing ? 'Обновляем…' : 'Обновить заявку' }}</button>
      <button v-if="ui.undo" type="button" :disabled="ui.busy" @click="undo">{{ ui.busy ? 'Сохраняем…' : 'Отменить изменение' }}</button>
      <button v-if="ui.notice" type="button" @click="ui.notice = null">Закрыть уведомление</button>
    </div>
  </section>
</template>

<style scoped>
.request-notice { margin-bottom: 22px; padding: 20px; border: 1px solid #39345f; border-radius: 4px; background: #252149; font-size: 13px; }
.request-notice strong { font-weight: 600; }
p { color: #b3adca; line-height: 1.6; }
.failure strong { color: #ff7e9f; }
.notice-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; }
.notice-actions button { padding: 8px 12px; border: 1px solid #514a81; color: #eeecfa; background: transparent; font-size: 12px; }
button:disabled { opacity: .5; cursor: wait; }
</style>
