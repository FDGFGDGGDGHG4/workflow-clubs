import { onScopeDispose } from 'vue'

export function useDebounce<T>(callback: (value: T) => void, delay = 350) {
  let timer: ReturnType<typeof setTimeout> | undefined
  const cancel = () => { clearTimeout(timer) }
  const run = (value: T) => {
    cancel()
    timer = setTimeout(() => callback(value), delay)
  }
  onScopeDispose(cancel)
  return { run, cancel }
}
