import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './configs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { config } from './configs/config';

const rootModule = TypeOrmModule.forRoot(dataSourceOptions);

export const TypeormImports = [
  rootModule,
  JwtModule.register({
    secret: config.JWT_SECRET,
    signOptions: { expiresIn: config.JWT_EXPIRES_ACCESS },
  }),
  PassportModule.register({
    session: false,
  }),
  TypeOrmModule.forFeature(dataSourceOptions.entities as EntityClassOrSchema[]),
];
