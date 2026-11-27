<script setup lang="ts">
import { computed } from 'vue'
import type { RequestsResponse } from '~/types/api'
const lookups = useRequestLookups()
const response = useFetch<RequestsResponse>('/api/requests', { key: 'request-list:overview', query: { pageSize: 100 }, retry: 0 })
const requests = computed(() => response.data.value?.items ?? [])

const statistics = computed(() => [
  {
    title: 'Новые заявки',
    count: requests.value.filter(item => item.status === 'Новая').length,
    description: 'Ожидают назначения',
  },
  {
    title: 'В работе',
    count: requests.value.filter(item => item.status === 'В работе').length,
    description: 'Назначены исполнителям',
  },
  {
    title: 'Ожидают ответа',
    count: requests.value.filter(item => item.status === 'Ожидает ответа').length,
    description: 'Нужна информация',
  },
  {
    title: 'Решены',
    count: requests.value.filter(item => item.status === 'Решена').length,
    description: 'Работа завершена',
  },
])

const recentRequests = computed(() => requests.value.slice(0, 3).map(lookups.map))
</script>

<template>
  <section class="dashboard">
    <h1>Обзор</h1>
    <p class="subtitle">Обзор работы с заявками</p>

    <RequestNotice />
    <p v-if="response.error.value || lookups.error.value" role="alert">Не удалось загрузить обзор. <button type="button" @click="response.refresh(); lookups.refresh()">Повторить</button></p>
    <p v-if="response.status.value === 'pending'" role="status">Загружаем обзор…</p>
    <div class="statistics">
      <article
        v-for="item in statistics"
        :key="item.title"
        class="stat-card"
      >
        <h2>{{ item.title }}</h2>
        <strong>{{ item.count }}</strong>
        <p>{{ item.description }}</p>
      </article>
    </div>

    <section aria-labelledby="recent-heading">
      <div class="section-heading">
        <h2 id="recent-heading">Последние заявки</h2>
        <NuxtLink class="all-requests" to="/requests">
          Все заявки
        </NuxtLink>
      </div>

      <RequestList :requests="recentRequests" />
    </section>
  </section>
</template>

<style scoped>
.dashboard {
  width: min(100%, 980px);
  margin: 0 auto;
}

h1 {
  margin: 0 0 8px;
  font-size: 26px;
}

.subtitle {
  margin: 0 0 24px;
  color: #aaa5c4;
  font-size: 13px;
}

.statistics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 28px;
}

.stat-card {
  padding: 18px;
  border: 1px solid #39345f;
  border-radius: 5px;
  background: #211e45;
}

.stat-card h2 {
  margin: 0 0 12px;
  color: #c8c3df;
  font-size: 12px;
  font-weight: 500;
}

.stat-card strong {
  display: block;
  font-size: 30px;
  line-height: 1.2;
}

.stat-card p {
  margin: 10px 0 0;
  color: #aaa5c4;
  font-size: 11px;
  line-height: 1.5;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.section-heading h2 {
  margin: 0;
  font-size: 18px;
}

.all-requests {
  display: inline-block;
  padding: 9px 14px;
  border-radius: 4px;
  background: linear-gradient(100deg, #7457ff, #c23fae);
  color: white;
  font-size: 12px;
  text-align: center;
}

.all-requests:hover {
  filter: brightness(1.12);
}

.all-requests:focus-visible {
  outline: 2px solid #42d5e9;
  outline-offset: 3px;
}

@media (max-width: 900px) {
  .statistics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .stat-card {
    padding: 14px;
  }

  .section-heading {
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }
}
</style>