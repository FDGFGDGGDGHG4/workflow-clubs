import { appendComment } from '../../../utils/request-repository'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  return appendComment(getRouterParam(event, 'id') || '', body?.text, body?.operationId)
})
