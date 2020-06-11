import { Injectable } from '@nestjs/common';
import { Request } from './interfaces/Request';
import { Event } from './interfaces/Event';

@Injectable()
export abstract class Mediator {
  /**
   * 
   * @param request The request to send.
   */
  public abstract send<T>(request: Request): Promise<T>;

  /**
   * 
   * @param event 
   */
  public abstract emit(event: Event): Promise<void>;
}