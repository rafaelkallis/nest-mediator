import { Request } from './Request';

export interface RequestHandler<TRequest extends Request, T> {
  handle(request: TRequest): T | Promise<T>;
}