import { Module, DynamicModule } from "@nestjs/common";
import { Mediator, MediatorImpl } from "./Mediator";

@Module({})
export class MediatorModule {
    public static forRoot(): DynamicModule {
        return {
            module: MediatorModule,
            providers: [{ provide: Mediator, useClass: MediatorImpl }],
            exports: [Mediator],
        };
    }
}