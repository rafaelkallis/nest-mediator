import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Mediator } from "../Mediator";
import { ServiceLocator } from "./ServiceLocator";
import { requestHandlerStaticMap, HandleRequest } from "../decorators/HandleRequest";
import { Request } from "../interfaces/Request";
import { RequestHandler } from "../interfaces/RequestHandler";
import { Class } from "../interfaces/Class";
import { Event } from "../interfaces/Event";
import { eventHandlerStaticMap } from "../decorators/HandleEvent";
import { EventHandler } from "../interfaces/EventHandler";

@Injectable()
export class MediatorImpl extends Mediator {

  private readonly serviceLocator: ServiceLocator;

  public constructor(serviceLocator: ServiceLocator) {
    super();
    this.serviceLocator = serviceLocator;
  }

  public async send<T>(request: Request): Promise<T> {
    const requestType: Class<Request> = request.constructor;
    const handlerTypes = requestHandlerStaticMap.inverse().get(requestType) as Class<RequestHandler<Request, T>>[];
    if (handlerTypes === null) {
      throw new InternalServerErrorException(`No request handler found for ${requestType.name}, did you apply @${HandleRequest.name}(${requestType.name}) ?`);
    }
    const resolvedHandlers: RequestHandler<Request, T>[] = [];
    for (const handlerType of handlerTypes) {
      const resolvedHandler: RequestHandler<Request, T> = await this.serviceLocator.getService(handlerType);
      resolvedHandlers.push(resolvedHandler);
    }
    if (resolvedHandlers.length > 1) {
      throw new InternalServerErrorException(`Conflicting request handlers for ${requestType.name}: [${resolvedHandlers.map(h => resolvedHandlers.constructor.name).join(', ')}]`);
    }
    const [handler] = resolvedHandlers;
    return await handler.handle(request);
  }

  public async emit(event: Event): Promise<void> {
    const eventType: Class<Event> = event.constructor;
    const handlerTypes = eventHandlerStaticMap.inverse().get(eventType);
    if (handlerTypes === null) {
      return;
    }
    for (const handlerType of handlerTypes) {
      const resolvedHandler: EventHandler<Event> = await this.serviceLocator.getService(handlerType);
      await resolvedHandler.handle(event);
    }
  }
}