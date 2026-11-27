import { randomUUID } from 'node:crypto'
import { apiRequests, users } from './requests'
import { priorities, statuses } from '../../app/utils/requests'
import type { ApiRequest, RequestActivity } from '../../app/types/api'

type SavedRequest = { request: ApiRequest; activity: RequestActivity }
let queue: Promise<unknown> = Promise.resolve()

export async function readRecord(id: string): Promise<SavedRequest> {
  const seed = apiRequests.find(item => item.id === id)
  if (!seed) throw createError({ statusCode: 404, statusMessage: 'Request not found' })
  return await useStorage('workflow').getItem<SavedRequest>(id) ?? {
    request: structuredClone(seed),
    activity: { comments: [], history: [{ id: 'created', text: 'Заявка создана', createdAt: '2026-10-05T09:14:00.000Z' }] },
  }
}
export async function readRequests() {
  return Promise.all(apiRequests.map(async seed => (await readRecord(seed.id)).request))
}
function serialize<T>(operation: () => Promise<T>): Promise<T> {
  const next = queue.then(operation, operation)
  queue = next.catch(() => undefined)
  return next
}
export function changeRequest(id: string, body: Record<string, unknown>) {
  return serialize(async () => {
    const record = await readRecord(id)
    if (body.version !== record.request.version) throw createError({ statusCode: 409, statusMessage: 'Request was changed by another user' })
    const fields = ['priority', 'status', 'assigneeId'] as const
    const changed = fields.filter(field => Object.hasOwn(body, field))
    if (changed.length !== 1) throw createError({ statusCode: 400, statusMessage: 'Change exactly one field' })
    const field = changed[0]!
    const value = body[field]
    if (field === 'priority' && !priorities.includes(value as never)
      || field === 'status' && !statuses.includes(value as never)
      || field === 'assigneeId' && value !== null && !users.some(user => user.id === value)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid field value' })
    }
    Object.assign(record.request, { [field]: value, version: record.request.version + 1 })
    const label = field === 'priority' ? 'Приоритет' : field === 'status' ? 'Статус' : 'Исполнитель'
    const display = field === 'assigneeId' ? users.find(user => user.id === value)?.name ?? 'Не назначен' : value
    record.activity.history.push({ id: randomUUID(), text: `${label}: ${display}`, createdAt: new Date().toISOString() })
    // Persist before responding: a failed write never appears as a successful mutation.
    await useStorage('workflow').setItem(id, record)
    return record.request
  })
}
export function appendComment(id: string, text: unknown, operationId: unknown) {
  return serialize(async () => {
    if (typeof text !== 'string' || !text.trim() || text.trim().length > 4000
      || typeof operationId !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(operationId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid comment' })
    }
    const record = await readRecord(id)
    // Repeating a request after a lost response must not duplicate a comment.
    if (!record.activity.comments.some(comment => comment.id === operationId)) {
      record.activity.comments.push({ id: operationId, author: 'Вы', text: text.trim(), createdAt: new Date().toISOString() })
      await useStorage('workflow').setItem(id, record)
    }
    return record.activity
  })
}
