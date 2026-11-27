import { requests } from '../../app/utils/requests'
import type { ApiRequest, ApiUser, ApiCustomer, ApiCategory } from '../../app/types/api'

export const users: ApiUser[] = [
  { id: 'irina', name: 'Ирина К.' },
  { id: 'dmitry', name: 'Дмитрий С.' },
]
export const customers: ApiCustomer[] = requests.map((r, i) => ({ id: String(i + 1), name: r.client }))
export const categories: ApiCategory[] = [{ id: 'clubs', name: 'Детские кружки' }]
export const apiRequests: ApiRequest[] = requests.map((r, i) => ({
  id: r.id, title: r.title, status: r.status, priority: r.priority,
  description: r.description, customerId: String(i + 1),
  assigneeId: users.find(u => u.name === r.assignee)?.id,
  categoryId: 'clubs',
}))
