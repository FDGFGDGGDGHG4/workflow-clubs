import { changeRequest } from '../../utils/request-repository'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw createError({ statusCode: 400, statusMessage: 'Invalid request body' })
  return changeRequest(getRouterParam(event, 'id') || '', body)
})
