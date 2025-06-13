export const SESSION_CONFIG = {
  // Session timeout duration in milliseconds (default: 30 minutes)
  TIMEOUT_DURATION: 30 * 60 * 1000,
  // How often to check session status in milliseconds (default: 10 seconds)
  CHECK_INTERVAL: 10000,
  // Events to monitor for user activity
  ACTIVITY_EVENTS: ['click', 'keypress', 'scroll', 'mousemove'] as const
} as const;

// Type for the activity events
export type ActivityEvent = typeof SESSION_CONFIG.ACTIVITY_EVENTS[number]; 