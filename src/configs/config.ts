import * as dotenv from 'dotenv';

dotenv.config();

const APP_ENV = process.env['APP_ENV'] || 'development';

export const config = {
  APP_ENV,
  APP_IP: process.env['APP_IP'],
  APP_PORT: process.env['APP_PORT'],

  TYPEORM_HOST: process.env['TYPEORM_HOST'],
  TYPEORM_USERNAME: process.env['TYPEORM_USERNAME'],
  TYPEORM_PASSWORD: process.env['TYPEORM_PASSWORD'],
  TYPEORM_DATABASE: process.env['TYPEORM_DATABASE'],
  TYPEORM_PORT: process.env['TYPEORM_PORT'],
  TYPEORM_SYNC: process.env['TYPEORM_SYNC'] === 'true',
  JWT_SECRET: process.env['JWT_SECRET'],
  JWT_EXPIRES_ACCESS: process.env['JWT_EXPIRES_ACCESS'],
  JWT_EXPIRES_REFRESH: process.env['JWT_EXPIRES_REFRESH'],
};

console.log('');
console.log('-- CONFIG INIT --');
console.log('APP_ENV = ', config.APP_ENV);
console.log('APP_IP = ', config.APP_IP);
console.log('APP_PORT = ', config.APP_PORT);
console.log('TYPEORM_HOST = ', config.TYPEORM_HOST);
console.log('TYPEORM_SYNC = ', config.TYPEORM_SYNC);
console.log('-- CONFIG END --');
