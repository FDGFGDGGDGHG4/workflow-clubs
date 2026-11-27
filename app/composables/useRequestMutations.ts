import type { ApiRequest, RequestsResponse } from '~/types/api'
import type { Priority, RequestStatus } from '~/utils/requests'
import { useRequestUiStore } from '~/stores/requestUi'

type Field = 'priority' | 'status' | 'assigneeId'
export function useRequestMutations() {
  const app = useNuxtApp()
  const ui = useRequestUiStore()
  const keys = () => Object.keys(app.payload.data).filter(key => key.startsWith('request:') || key.startsWith('request-list:'))
  function cached(id: string) {
    for (const key of keys()) {
      const data = useNuxtData<ApiRequest | RequestsResponse>(key).data.value
      const item = data && ('items' in data ? data.items.find(item => item.id === id) : data.id === id ? data : null)
      if (item) return item
    }
  }
  function replace(id: string, transform: (item: ApiRequest) => ApiRequest) {
    for (const key of keys()) {
      const ref = useNuxtData<ApiRequest | RequestsResponse>(key).data
      const data = ref.value
      if (!data) continue
      if ('items' in data) ref.value = { ...data, items: data.items.map(item => item.id === id ? transform(item) : item) }
      else if (data.id === id) ref.value = transform(data)
    }
  }
  async function refresh() {
    await refreshNuxtData([...keys(), ...Object.keys(app.payload.data).filter(key => key.startsWith('activity:'))])
  }
  async function change(id: string, field: Field, value: string | null, undoing = false) {
    if (ui.busy) return false
    ui.busy = true
    ui.notice = null
    let previous: ApiRequest | undefined
    try {
      previous = cached(id) ?? await $fetch<ApiRequest>('/api/requests/' + encodeURIComponent(id))
      if (!undoing && previous[field] === value) return true
      const version = undoing ? ui.undo!.version : previous.version
      // Update the same Nuxt cache that pages and lists already consume.
      if (field === 'priority') replace(id, item => ({ ...item, priority: value as Priority }))
      const saved = await $fetch<ApiRequest>('/api/requests/' + encodeURIComponent(id), {
        method: 'PATCH', body: { [field]: value, version }, retry: 0,
      })
      replace(id, () => saved)
      if (undoing) ui.undo = null
      else if (field === 'priority' || field === 'status') {
        ui.undo = { id, field, previous: previous[field], value: value as Priority | RequestStatus, version: saved.version }
      } else if (ui.undo?.id === id) ui.undo.version = saved.version
      const label = field === 'priority' ? 'Приоритет изменён' : field === 'status' ? 'Статус изменён' : 'Исполнитель изменён'
      ui.notice = { kind: 'success', title: undoing ? 'Изменение отменено' : field === 'assigneeId' ? label : `${label} на «${value}»` }
      // Reconcile filtering, counts, other pages and history with the server response.
      try {
        await refresh()
      } catch {
        ui.notice = {
          kind: 'success', title: undoing ? 'Изменение отменено' : label,
          message: 'Изменение сохранено, но не удалось обновить связанные данные. Обновите страницу, чтобы загрузить их снова.',
        }
      }
      return true
    } catch (error: any) {
      if (previous && field === 'priority') replace(id, item => ({ ...item, priority: previous!.priority }))
      const status = error?.statusCode ?? error?.status
      ui.notice = {
        kind: 'error', title: 'Изменение не сохранено', requestId: id,
        message: status === 409
          ? 'Заявка была изменена другим сотрудником. Предыдущее значение восстановлено. Обновите заявку и попробуйте снова.'
          : status === 500
            ? 'На сервере произошла ошибка (500). Предыдущее значение восстановлено. Попробуйте ещё раз.'
            : 'Не удалось сохранить изменение. Предыдущее значение восстановлено. Проверьте соединение и обновите заявку.',
      }
      return false
    } finally { ui.busy = false }
  }
  const undo = () => ui.undo ? change(ui.undo.id, ui.undo.field, ui.undo.previous, true) : Promise.resolve(false)
  return { change, undo, refresh }
}
