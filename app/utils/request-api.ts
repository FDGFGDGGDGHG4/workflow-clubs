import type { ApiRequest, ApiUser, ApiCustomer, ApiCategory } from '~/types/api'
import type { SupportRequest } from './requests'

export function mapRequest(
  item: ApiRequest, users: ApiUser[], customers: ApiCustomer[], categories: ApiCategory[],
): SupportRequest & { category: string } {
  return {
    id: item.id, title: item.title || 'Без названия',
    status: item.status, priority: item.priority,
    client: customers.find(c => c.id === item.customerId)?.name || 'Клиент не указан',
    assignee: users.find(u => u.id === item.assigneeId)?.name || 'Не назначен',
    category: categories.find(c => c.id === item.categoryId)?.name || 'Без категории',
    description: item.description?.trim() || 'Описание не указано.',
  }
}

export function apiErrorMessage(error: { statusCode?: number; status?: number } | null | undefined): string {
  const status = error?.statusCode ?? error?.status
  if (status === 429) return 'Слишком много запросов. Подождите немного и повторите попытку.'
  if (status === 500) return 'На сервере временная ошибка. Попробуйте загрузить данные ещё раз.'
  if (status === 404) return 'Заявка не найдена.'
  return 'Не удалось загрузить данные. Проверьте соединение и повторите попытку.'
}
