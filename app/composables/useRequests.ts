import { computed } from 'vue'
import type { ApiUser, ApiCustomer, ApiCategory } from '~/types/api'
import { mapRequest, apiErrorMessage } from '~/utils/request-api'

export function useRequestLookups() {
  const users = useFetch<ApiUser[]>('/api/users', { retry: 0 })
  const customers = useFetch<ApiCustomer[]>('/api/customers', { retry: 0 })
  const categories = useFetch<ApiCategory[]>('/api/categories', { retry: 0 })
  const pending = computed(() => [users, customers, categories].some(r => r.status.value === 'pending'))
  const error = computed(() => users.error.value || customers.error.value || categories.error.value)
  const refresh = () => Promise.all([users.refresh(), customers.refresh(), categories.refresh()])
  const map = (item: Parameters<typeof mapRequest>[0]) =>
    mapRequest(item, users.data.value ?? [], customers.data.value ?? [], categories.data.value ?? [])
  return { users, customers, categories, pending, error, refresh, map }
}

export function useRequests() {
  const route = useRoute()
  const router = useRouter()
  const text = (key: string) => typeof route.query[key] === 'string' ? route.query[key] as string : ''
  const positive = (key: string, fallback: number, max: number) => {
    const n = Number(text(key))
    return Number.isSafeInteger(n) && n > 0 ? Math.min(n, max) : fallback
  }
  const query = computed(() => ({
    search: text('search'), status: text('status'), priority: text('priority'),
    customer: text('customer'), assignee: text('assignee'), category: text('category'),
    sort: ['id-asc', 'title'].includes(text('sort')) ? text('sort') : 'id-desc',
    page: positive('page', 1, 1000000), pageSize: positive('pageSize', 6, 100),
  }))
  function update(values: Record<string, string | number>, replace = false) {
    const next = { ...route.query }
    for (const [key, value] of Object.entries(values)) {
      if (value === '') delete next[key]
      else next[key] = String(value)
    }
    return router[replace ? 'replace' : 'push']({ query: next })
  }
  const lookups = useRequestLookups()
  const response = useFetch('/api/requests', { key: computed(() => 'request-list:' + JSON.stringify(query.value)), query, retry: 0 })
  const pending = computed(() => response.status.value === 'pending' || lookups.pending.value)
  const error = computed(() => response.error.value || lookups.error.value)
  const message = computed(() => apiErrorMessage(error.value))
  const items = computed(() => (response.data.value?.items ?? []).map(lookups.map))
  const total = computed(() => response.data.value?.total ?? 0)
  const pages = computed(() => Math.max(1, Math.ceil(total.value / query.value.pageSize)))
  const refresh = () => Promise.all([response.refresh(), lookups.refresh()])
  return { query, update, lookups, pending, error, message, items, total, pages, refresh }
}
