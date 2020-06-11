import { Event } from './Event';

export interface EventHandler<TEvent extends Event> {
  handle(event: TEvent): void | Promise<void>;
}