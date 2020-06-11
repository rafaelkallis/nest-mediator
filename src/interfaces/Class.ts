import { Abstract, Type } from "@nestjs/common";

export type Class<T> = Abstract<T> | Type<T>;