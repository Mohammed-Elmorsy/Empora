export interface DatabaseConfig {
  url: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
}

export interface RabbitMQConfig {
  url: string;
  exchange: string;
  queues: string[];
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
}

export interface ServiceConfig {
  name: string;
  port: number;
  environment: 'development' | 'production' | 'test';
  database: DatabaseConfig;
  rabbitmq: RabbitMQConfig;
  redis: RedisConfig;
}

export function validateConfig<T>(config: T): T {
  const missingKeys: string[] = [];

  Object.entries(config as Record<string, any>).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      missingKeys.push(key);
    }
  });

  if (missingKeys.length > 0) {
    throw new Error(`Missing required configuration: ${missingKeys.join(', ')}`);
  }

  return config;
}
