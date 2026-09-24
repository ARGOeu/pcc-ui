// A shared signal the app can use to log the user out

type SessionExpiredListener = () => void

let listener: SessionExpiredListener | null = null
let notified = false

// Called by AuthProvider to register the function that logs the user out
export const onSessionExpired = (callback: SessionExpiredListener) => {
  listener = callback
}

// Call this on a 401 error code. Only logs out once, even if several requests fail at the same time
export const notifySessionExpired = (): boolean => {
  if (notified) {
    return false
  }
  notified = true
  listener?.()
  return true
}
