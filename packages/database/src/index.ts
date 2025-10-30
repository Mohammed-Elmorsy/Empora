// Database utilities
// Each service will have its own Prisma client

export interface DatabaseConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  healthCheck(): Promise<boolean>;
}

export abstract class BasePrismaService implements DatabaseConnection {
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract healthCheck(): Promise<boolean>;
}
