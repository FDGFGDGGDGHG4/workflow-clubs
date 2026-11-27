import type { Priority, RequestStatus } from '../utils/requests'

export interface ApiUser { id: string; name: string }
export interface ApiCustomer { id: string; name: string }
export interface ApiCategory { id: string; name: string }
export interface ApiComment { id: string; author: string; text: string; createdAt: string }
export interface ApiHistory { id: string; text: string; createdAt: string }
export interface RequestActivity { comments: ApiComment[]; history: ApiHistory[] }
export interface ApiRequest {
  id: string
  version: number
  title: string
  status: RequestStatus
  priority: Priority
  customerId?: string | null
  assigneeId?: string | null
  categoryId?: string | null
  description?: string | null
}
export interface RequestsResponse {
  items: ApiRequest[]
  total: number
  page: number
  pageSize: number
}
