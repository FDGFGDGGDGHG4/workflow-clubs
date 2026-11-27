import { defineStore } from 'pinia'
import type { Priority, RequestStatus } from '~/utils/requests'

export interface UndoChange {
  id: string
  field: 'status' | 'priority'
  previous: Priority | RequestStatus
  value: Priority | RequestStatus
  version: number
}

export const useRequestUiStore = defineStore('requestUi', {
  state: () => ({
    notice: null as null | { kind: 'success' | 'error'; title: string; message?: string; requestId?: string },
    undo: null as UndoChange | null,
    busy: false,
  }),
})
