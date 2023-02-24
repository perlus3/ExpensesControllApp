import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './configs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

const rootModule = TypeOrmModule.forRoot(dataSourceOptions);

export const TypeormImports = [
    rootModule,
    TypeOrmModule.forFeature(dataSourceOptions.entities as EntityClassOrSchema[]),
];
