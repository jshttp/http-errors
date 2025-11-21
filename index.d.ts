// TypeScript definitions for http-errors

export interface HttpError extends Error {
  status: number;
  statusCode: number;
  expose: boolean;
}

interface CreateHttpError {
  (status: number, message?: string): HttpError;
  (status: number, err: Error, props?: object): HttpError;
  (status: number, props: object): HttpError;
  (message: string, status?: number): HttpError;
  (err: Error, props?: object): HttpError;
  HttpError: {
    new(status: number, message?: string): HttpError;
  };
  isHttpError(val: any): boolean;
}

declare const createError: CreateHttpError;
export = createError;
