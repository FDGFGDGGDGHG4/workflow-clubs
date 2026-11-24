<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { requests } from '~/utils/requests'

const route = useRoute()
const id = computed(() => String(route.params.id))

const request = computed(() =>
  requests.find(item => item.id === id.value),
)

const comment = ref('')
const comments = ref<string[]>([])

// При переходе к другой заявке очищаем её демонстрационные комментарии.
watch(id, () => {
  comment.value = ''
  comments.value = []
}, { immediate: true })

function addComment() {
  const text = comment.value.trim()

  if (!text) return

  comments.value.push(`Вы · сейчас — ${text}`)
  comment.value = ''
}
</script>

<template>
  <section v-if="request" class="detail">
    <NuxtLink class="back" to="/requests">← К списку заявок</NuxtLink>
    <h1>{{ request.title }}</h1>
    <p class="muted">{{ request.id }} · {{ request.client }}</p>
    <div class="tags">
      <span>{{ request.status }}</span>
      <span>{{ request.priority }}</span>
    </div>

    <div class="columns">
      <div>
        <article class="panel">
          <h2>Описание проблемы</h2>
          <p>{{ request.description }}</p>
        </article>

        <article class="panel">
          <h2>Комментарии · {{ comments.length }}</h2>
          <p v-for="item in comments" :key="item">{{ item }}</p>
          <form @submit.prevent="addComment">
            <label for="comment">Ваш комментарий</label>
            <textarea id="comment" v-model="comment" rows="3" placeholder="Напишите сообщение…" />
            <button type="submit" :disabled="!comment.trim()">Отправить комментарий</button>
          </form>
        </article>

        <article class="panel">
          <h2>История заявки</h2>
          <p>09:14 · Мария Смирнова создала заявку</p>
          <p>09:22 · Статус: {{ request.status }}</p>
        </article>
      </div>

      <aside class="panel">
        <h2>Параметры</h2>
        <p>Клиент<br><strong>{{ request.client }}</strong></p>
        <p>Категория<br><strong>Детские кружки</strong></p>>
        <p>Приоритет<br><strong>{{ request.priority }}</strong></p>
        <label for="assignee">Исполнитель</label>
        <select id="assignee">
          <option>Не назначен</option>
          <option>Ирина К.</option>
          <option>Дмитрий С.</option>
        </select>
        <button type="button">Назначить исполнителя</button>
      </aside>
    </div>
  </section>

  <section v-else class="panel not-found">
    <h1>Заявка не найдена</h1>
    <NuxtLink to="/requests">Вернуться к списку заявок</NuxtLink>
  </section>
</template>

<style scoped>
.detail { width: min(100%, 900px); margin: 0 auto; }
.back, .not-found a { color: #70d5e2; font-size: 13px; }
h1 { margin: 18px 0 6px; font-size: 24px; }
h2 { margin: 0 0 14px; font-size: 15px; }
.muted, .panel p { color: #aaa5c4; font-size: 12px; line-height: 1.6; }
.tags { display: flex; gap: 8px; margin: 14px 0; }
.tags span { padding: 5px 9px; border-radius: 12px; background: #39345f; font-size: 11px; }
.columns { display: grid; grid-template-columns: 1fr 250px; gap: 14px; }
.columns > div { display: grid; gap: 12px; }
.panel { padding: 16px; border: 1px solid #302b58; border-radius: 5px; background: #211e45; }
label { display: block; margin: 10px 0 6px; font-size: 12px; }
textarea, select { width: 100%; padding: 9px; border: 1px solid #39345f; border-radius: 4px; color: #f2efff; background: #191633; }
button { width: 100%; margin-top: 10px; padding: 9px; border: 0; border-radius: 4px; color: white; background: linear-gradient(100deg, #7457ff, #c23fae); cursor: pointer; }
button:disabled { opacity: .45; cursor: not-allowed; }
:focus-visible { outline: 2px solid #42d5e9; outline-offset: 2px; }
@media (max-width: 650px) { .columns { grid-template-columns: 1fr; } }
</style>