import { readRecord } from '../../utils/request-repository'

export default defineEventHandler(async event => (await readRecord(getRouterParam(event, 'id') || '')).request)
