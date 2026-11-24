<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const name = ref('Анна Кузнецова')
const email = ref('anna@example.com')
const message = ref('')

const initials = computed(() =>
  name.value.trim().split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('') || 'П',
)

onMounted(() => {
  try {
    const saved = localStorage.getItem('workflow-profile')
    if (!saved) return

    const profile: unknown = JSON.parse(saved)

    if (
      typeof profile === 'object'
      && profile !== null
      && 'name' in profile
      && 'email' in profile
      && typeof profile.name === 'string'
      && typeof profile.email === 'string'
    ) {
      name.value = profile.name
      email.value = profile.email
    }
  } catch {
    message.value = 'Не удалось прочитать сохранённый профиль.'
  }
})

function saveProfile() {
  if (!name.value.trim()) {
    message.value = 'Введите имя.'
    return
  }

  try {
    localStorage.setItem('workflow-profile', JSON.stringify({
      name: name.value.trim(),
      email: email.value.trim(),
    }))

    name.value = name.value.trim()
    message.value = 'Изменения сохранены в этом браузере.'
  } catch {
    message.value = 'Браузер не разрешил сохранить данные.'
  }
}
</script>

<template>
  <section class="profile-page">
    <h1>Профиль</h1>
    <p class="subtitle">Ваши данные</p>

    <form class="panel" @submit.prevent="saveProfile">
      <div class="avatar" aria-hidden="true">{{ initials }}</div>

      <div class="field">
        <label for="profile-name">Имя</label>
        <input
          id="profile-name"
          v-model="name"
          autocomplete="name"
          maxlength="80"
          required
        >
      </div>

      <div class="field">
        <label for="profile-email">Электронная почта</label>
        <input
          id="profile-email"
          v-model="email"
          type="email"
          autocomplete="email"
          required
        >
      </div>

      <p class="role">Роль: оператор</p>

      <button type="submit" :disabled="!name.trim() || !email.trim()">
        Сохранить изменения
      </button>

      <p class="message" role="status" aria-live="polite">
        {{ message }}
      </p>
    </form>

    <NuxtLink class="back-link" to="/dashboard">
      Вернуться к обзору
    </NuxtLink>
  </section>
</template>

<style scoped>
.profile-page {
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

.panel {
  padding: 24px;
  border: 1px solid #39345f;
  border-radius: 5px;
  background: #211e45;
}

.avatar {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  margin-bottom: 20px;
  border-radius: 50%;
  background: #393475;
  color: #d0c7ff;
  font-size: 14px;
}

.field {
  display: grid;
  gap: 7px;
  width: min(100%, 420px);
  margin-bottom: 16px;
}

label {
  color: #c8c3df;
  font-size: 12px;
}

input {
  width: 100%;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid #49416d;
  border-radius: 4px;
  background: #191633;
  color: #f2efff;
}

input:hover {
  border-color: #8879be;
}

.role {
  margin: 0 0 18px;
  color: #aaa5c4;
  font-size: 12px;
}

button {
  padding: 10px 16px;
  border: 0;
  border-radius: 4px;
  background: linear-gradient(100deg, #7457ff, #c23fae);
  color: white;
  cursor: pointer;
}

button:hover:not(:disabled) {
  filter: brightness(1.12);
}

button:disabled {
  opacity: .45;
  cursor: not-allowed;
}

input:focus-visible,
button:focus-visible,
a:focus-visible {
  outline: 2px solid #42d5e9;
  outline-offset: 3px;
}

.message {
  margin: 14px 0 0;
  color: #86dce7;
  font-size: 12px;
  line-height: 1.5;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  color: #86dce7;
  font-size: 13px;
}

.back-link:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .panel {
    padding: 16px;
  }

  button {
    width: 100%;
  }
}
</style>