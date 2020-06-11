import { Module } from "@nestjs/common";
import { Mediator } from "./Mediator";
import { MediatorImpl } from "./services/MediatorImpl";
import { ServiceLocator } from "./services/ServiceLocator";

@Module({
            providers: [{ provide: Mediator, useClass: MediatorImpl }, ServiceLocator],
            exports: [Mediator],
})
export class MediatorModule {
    // public static forRoot(): DynamicModule {
    //     return {
    //         module: MediatorModule,
    //     };
    // }
}