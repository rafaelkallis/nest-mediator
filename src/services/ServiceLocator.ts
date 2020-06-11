import { Injectable, Inject } from '@nestjs/common';
import { ModuleRef, REQUEST, ContextId, ContextIdFactory } from '@nestjs/core';
import { Request } from 'express';
import { Class } from '../interfaces/Class';

@Injectable()
export class ServiceLocator {
  private readonly moduleRef: ModuleRef;
  private readonly contextId: ContextId;

  public constructor(moduleRef: ModuleRef, @Inject(REQUEST) request: Request) {
    this.moduleRef = moduleRef;
    this.contextId = ContextIdFactory.getByRequest(request);
  }

  public async getService<T>(type: Class<T>): Promise<T> {
    try {
      return await this.moduleRef.resolve(type as any, this.contextId, {
        strict: false,
      });
    } catch (e) {
      if (e.constructor.name !== "InvalidClassScopeException") {
        throw e;
      }
    }
    return this.moduleRef.get(type as any, { strict: false });
  }
}
