import { apiRequests } from '../../utils/requests'
import type { ApiRequest } from '../../../app/types/api'

export default defineEventHandler((event): ApiRequest => {
  const request = apiRequests.find(r => r.id === getRouterParam(event, 'id'))
  if (!request) throw createError({ statusCode: 404, statusMessage: 'Request not found' })
  return request
})
