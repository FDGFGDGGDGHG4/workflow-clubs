<script setup lang="ts">
import { ref } from 'vue'

const dialog = ref<HTMLDialogElement | null>(null)
const titleInput = ref<HTMLInputElement | null>(null)
const title = ref('')
const description = ref('')
const message = ref('')

function open() {
  title.value = ''
  description.value = ''
  message.value = ''
  dialog.value?.showModal()
  titleInput.value?.focus()
}

function close() {
  dialog.value?.close()
}

function submit() {
  if (!title.value.trim() || !description.value.trim()) return

  message.value = `Форма заявки «${title.value.trim()}» заполнена. Добавление в список подключим следующим шагом.`
  close()
}
</script>

<template>
  <div>
    <button type="button" @click="open">
      Создать заявку
    </button>

    <p class="confirmation" role="status">{{ message }}</p>

    <dialog
      ref="dialog"
      aria-labelledby="create-request-heading"
      class="request-dialog"
    >
      <form @submit.prevent="submit">
        <div class="dialog-heading">
          <h2 id="create-request-heading">Создать заявку</h2>

          <button
            class="close-button"
            type="button"
            aria-label="Закрыть окно"
            @click="close"
          >
            ×
          </button>
        </div>

        <label for="request-title">Название заявки</label>
        <input
          id="request-title"
          ref="titleInput"
          v-model="title"
          placeholder="Например: Записать ребёнка на робототехнику"
          maxlength="120"
          required
        >

        <label for="request-description">Описание</label>
        <textarea
          id="request-description"
          v-model="description"
          placeholder="Расскажите подробнее"
          rows="4"
          maxlength="2000"
          required
        />

        <div class="actions">
          <button class="secondary" type="button" @click="close">
            Отмена
          </button>

          <button
            type="submit"
            :disabled="!title.trim() || !description.trim()"
          >
            Подтвердить
          </button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<style scoped>
.request-dialog {
  width: min(460px, calc(100% - 32px));
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  padding: 24px;
  border: 1px solid #49416d;
  border-radius: 8px;
  background: #211e45;
  color: #f2efff;
}

.request-dialog::backdrop {
  background: rgb(10 8 25 / 75%);
}

.dialog-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

h2 {
  margin: 0;
  font-size: 20px;
}

label {
  display: block;
  margin: 16px 0 8px;
  font-size: 13px;
}

input,
textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  border: 1px solid #49416d;
  border-radius: 4px;
  background: #191633;
  color: #f2efff;
  font: inherit;
}

textarea {
  resize: vertical;
}

.actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 16px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: linear-gradient(100deg, #7457ff, #c23fae);
  color: white;
  font: inherit;
  cursor: pointer;
}

.secondary,
.close-button {
  border-color: #49416d;
  background: #302b58;
}

.close-button {
  padding: 4px 12px;
  font-size: 22px;
}

button:hover:not(:disabled) {
  filter: brightness(1.15);
}

button:disabled {
  opacity: .45;
  cursor: not-allowed;
}

:focus-visible {
  outline: 2px solid #42d5e9;
  outline-offset: 3px;
}

.confirmation {
  color: #86dce7;
  font-size: 13px;
  line-height: 1.5;
}

.confirmation:empty {
  display: none;
}

@media (max-width: 600px) {
  .request-dialog {
    padding: 16px;
  }

  .actions > button {
    flex: 1;
  }
}
</style>