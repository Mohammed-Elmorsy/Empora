export const SERVICES = {
  GATEWAY: 'gateway',
  AUTH: 'auth-service',
  PRODUCT: 'product-service',
  CART: 'cart-service',
  ORDER: 'order-service',
  NOTIFICATION: 'notification-service',
} as const;

export const RABBITMQ_EXCHANGES = {
  EVENTS: 'empora.events',
} as const;

export const RABBITMQ_QUEUES = {
  USER_CREATED: 'user.created',
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  PAYMENT_COMPLETED: 'payment.completed',
  EMAIL_NOTIFICATION: 'email.notification',
} as const;

export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
  VENDOR: 'VENDOR',
} as const;
