import { Injectable } from '@nestjs/common';

export interface Request {}
export interface Notification {}

export interface RequestHandler {
  handle<T>(request: Request): T | Promise<T>;
}

export interface NotificationHandler {
  handle(notification: Notification): void | Promise<void>;
}

export abstract class Mediator {
  public abstract send<T>(request: Request): Promise<T>;
  public abstract publish(notification: Notification): Promise<void>;
}

@Injectable()
export class MediatorImpl extends Mediator {
  public send<T>(request: Request): Promise<T> {
    throw new Error("Method not implemented.");
  }
  public publish(notification: Notification): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
