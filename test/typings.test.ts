// TypeScript compilation test for http-errors
import { HttpError } from '../index';
import * as createError from '../index';

// Test that HttpError can be used as a type
let err: HttpError = createError(404, 'not found');
err.status;
err.expose;

// Test that HttpError can be extended (workaround for abstract class)
class MyHttpError extends (createError.HttpError as { new(status: number, message: string): HttpError }) {
  custom: boolean;
  constructor(message: string) {
    super(418, message);
    this.custom = true;
  }
}
const myErr = new MyHttpError('I am a teapot');
myErr.status;
myErr.custom;
