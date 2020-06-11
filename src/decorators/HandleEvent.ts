import { Event } from "../interfaces/Event";
import { Map } from "../utils/Map";
import { EventHandler } from "../interfaces/EventHandler";
import { Class } from "../interfaces/Class";

export const eventHandlerStaticMap: Map<Class<EventHandler<Event>>, Class<Event>> = Map.empty();

export function HandleEvent(eventType: Class<Event>): ClassDecorator {
    return function innerHandleEvent(target: Class<EventHandler<Event>>): void {
        eventHandlerStaticMap.put(target, eventType);
    }
}