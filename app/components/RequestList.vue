<script setup lang="ts">
import type { SupportRequest } from '~/utils/requests'

defineProps<{
  requests: SupportRequest[]
}>()
</script>

<template>
  <div v-if="requests.length" class="request-list">
    <table>
      <caption class="sr-only">Список заявок</caption>
      <thead>
        <tr>
          <th scope="col">Номер</th>
          <th scope="col">Заявка</th>
          <th scope="col">Клиент</th>
          <th scope="col">Исполнитель</th>
          <th scope="col">Статус</th>
          <th scope="col">Приоритет</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="request in requests" :key="request.id">
          <td>
            <NuxtLink :to="`/requests/${request.id}`">
              {{ request.id }}
            </NuxtLink>
          </td>
          <td>{{ request.title }}</td>
          <td>{{ request.client }}</td>
          <td>{{ request.assignee }}</td>
          <td><span class="badge">{{ request.status }}</span></td>
          <td>{{ request.priority }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <p v-else class="empty" role="status">
    Заявок с такими фильтрами нет.
  </p>
</template>

<style scoped>
.request-list {
  overflow-x: auto;
  border: 1px solid #302b58;
  border-radius: 5px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

th,
td {
  padding: 12px 10px;
  border-bottom: 1px solid #302b58;
  text-align: left;
  overflow-wrap: anywhere;
}

th {
  color: #aaa5c4;
  background: #211e45;
  font-weight: 500;
}

tbody tr:last-child td {
  border-bottom: 0;
}

tbody tr:hover,
tbody tr:focus-within {
  background: #272249;
}

a {
  color: #8fcfe6;
}

a:hover {
  text-decoration: underline;
}

a:focus-visible {
  outline: 2px solid #42d5e9;
  outline-offset: 3px;
}

.badge {
  display: inline-block;
  padding: 4px 7px;
  border-radius: 10px;
  background: #39345f;
}

.empty {
  padding: 32px 16px;
  border: 1px solid #302b58;
  text-align: center;
  color: #aaa5c4;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (max-width: 900px) {
  th:nth-child(3),
  td:nth-child(3),
  th:nth-child(4),
  td:nth-child(4) {
    display: none;
  }
}

@media (max-width: 600px) {
  table,
  tbody {
    display: block;
  }

  thead {
    display: none;
  }

  tr {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 8px;
    padding: 14px;
    border-bottom: 1px solid #302b58;
  }

  tbody tr:last-child {
    border-bottom: 0;
  }

  td {
    padding: 0;
    border: 0;
  }

  td:nth-child(1),
  td:nth-child(2),
  td:nth-child(3),
  td:nth-child(4) {
    display: block;
    grid-column: 1 / -1;
  }

  td:nth-child(1),
  td:nth-child(3),
  td:nth-child(4) {
    font-size: 11px;
    color: #aaa5c4;
  }

  td:nth-child(2) {
    font-size: 14px;
  }

  td:nth-child(6) {
    text-align: right;
  }
}
</style>