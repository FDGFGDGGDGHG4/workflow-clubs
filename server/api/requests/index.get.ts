import { apiRequests } from '../../utils/requests'
import type { RequestsResponse } from '../../../app/types/api'

export default defineEventHandler((event): RequestsResponse => {
  const q = getQuery(event)
  const value = (key: string) => typeof q[key] === 'string' ? q[key] as string : ''
  const integer = (key: string, fallback: number, max: number) => {
    const n = Number(value(key))
    return Number.isSafeInteger(n) && n > 0 ? Math.min(n, max) : fallback
  }
  const page = integer('page', 1, 1000000)
  const pageSize = integer('pageSize', 6, 100)
  const search = value('search').trim().toLocaleLowerCase('ru')
  const items = apiRequests.filter(r =>
    (!search || (r.id + ' ' + r.title).toLocaleLowerCase('ru').includes(search))
    && (!value('status') || r.status === value('status'))
    && (!value('priority') || r.priority === value('priority'))
    && (!value('customer') || r.customerId === value('customer'))
    && (!value('assignee') || r.assigneeId === value('assignee'))
    && (!value('category') || r.categoryId === value('category')),
  )
  const sort = value('sort')
  items.sort((a, b) => sort === 'title'
    ? a.title.localeCompare(b.title, 'ru')
    : sort === 'id-asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id))
  return { items: items.slice((page - 1) * pageSize, page * pageSize), total: items.length, page, pageSize }
})
