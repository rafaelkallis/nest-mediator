import { Request } from "../interfaces/Request";
import { Map } from "../utils/Map";
import { RequestHandler } from "../interfaces/RequestHandler";
import { Class } from "../interfaces/Class";

export const requestHandlerStaticMap: Map<Class<RequestHandler<Request, unknown>>, Class<Request>> = Map.empty();

export function HandleRequest(requestType: Class<Request>): ClassDecorator {
    return function innerHandleRequest(target: Class<RequestHandler<Request, unknown>>): void {
        requestHandlerStaticMap.put(target, requestType);
    }
}