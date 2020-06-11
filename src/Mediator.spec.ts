import { Test } from '@nestjs/testing';
import td from 'testdouble';
import { Mediator } from './Mediator';
import { ContextIdFactory } from '@nestjs/core';
import { HandleRequest } from './decorators/HandleRequest';
import { Request } from './interfaces/Request';
import { RequestHandler } from './interfaces/RequestHandler';
import { Injectable } from '@nestjs/common';
import { MediatorModule } from './MediatorModule';
import { ServiceLocator } from './services/ServiceLocator';
import { Event } from './interfaces/Event';
import { EventHandler } from './interfaces/EventHandler';
import { HandleEvent } from './decorators/HandleEvent';

describe(Mediator.name, () => {
    let mediator: Mediator;
    let myRequestHandlerPassedRequest: MyRequest;
    let myRequestHandlerReturn: unknown;
    let myEventHandlerPassedEvents: MyEvent[];

    class MyRequest implements Request {}

    @HandleRequest(MyRequest)
    @Injectable()
    class MyRequestHandler implements RequestHandler<MyRequest, unknown> {
        handle(request: MyRequest): unknown {
           myRequestHandlerPassedRequest = request;
           return myRequestHandlerReturn; 
        }
    }

    class MyEvent implements Event {}

    @HandleEvent(MyEvent)
    @Injectable()
    class MyEventHandler1 implements EventHandler<MyEvent> {
        handle(event: MyEvent): void {
            myEventHandlerPassedEvents.push(event);
        }

    }

    @HandleEvent(MyEvent)
    @Injectable()
    class MyEventHandler2 implements EventHandler<MyEvent> {
        handle(event: MyEvent): void | Promise<void> {
            myEventHandlerPassedEvents.push(event);
        }

    }

    beforeEach(async () => {
        myEventHandlerPassedEvents = [];
        const module = await Test.createTestingModule({
            imports: [MediatorModule],
            providers: [MyRequestHandler, MyEventHandler1, MyEventHandler2],
        }).compile();
        const contextId = ContextIdFactory.create();
        const serviceLocator = await module.resolve(ServiceLocator, contextId, { strict: false });
        mediator = await serviceLocator.getService(Mediator);
        myRequestHandlerReturn = td.object();
    });

    test('should handle request', async () => {
        const request = new MyRequest();
        const actualReturn = await mediator.send(request);
        expect(myRequestHandlerPassedRequest).toBe(request);
        expect(actualReturn).toBe(myRequestHandlerReturn);
    });

    test.todo('when no request handler should throw exception');
    test.todo('when multiple request handlers in DI container should throw exception');

    test('should handle events', async () => {
        const event = new MyEvent();
        await mediator.emit(event);
        expect(myEventHandlerPassedEvents).toHaveLength(2);
        for (const myEventHandlerPassedEvent of myEventHandlerPassedEvents) {
            expect(myEventHandlerPassedEvent).toBe(event);
        }
    });
});