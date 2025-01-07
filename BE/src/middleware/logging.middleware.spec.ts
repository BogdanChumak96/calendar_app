import { LoggingMiddleware } from './logging.middleware';
import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

describe('LoggingMiddleware', () => {
  let middleware: LoggingMiddleware;
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger('HTTP');
    jest.spyOn(logger, 'log').mockImplementation(() => {});
    jest.spyOn(logger, 'debug').mockImplementation(() => {});
    middleware = new LoggingMiddleware();
    (middleware as any).logger = logger;
  });

  it('should log incoming request details and outgoing response details', () => {
    const mockRequest = {
      method: 'GET',
      originalUrl: '/test',
      body: { test: 'data' },
      query: { search: 'query' },
      params: { id: '123' },
    } as unknown as Request;

    const mockResponse = {
      send: jest.fn(),
    } as unknown as Response;

    const mockNext = jest.fn() as NextFunction;

    middleware.use(mockRequest, mockResponse, mockNext);

    expect(logger.log).toHaveBeenCalledWith(
      `Incoming Request: ${mockRequest.method} ${mockRequest.originalUrl}`,
    );
    expect(logger.debug).toHaveBeenCalledWith(
      `Params: ${JSON.stringify(mockRequest.params)}`,
    );
    expect(logger.debug).toHaveBeenCalledWith(
      `Query: ${JSON.stringify(mockRequest.query)}`,
    );
    expect(logger.debug).toHaveBeenCalledWith(
      `Body: ${JSON.stringify(mockRequest.body)}`,
    );

    const mockSend = jest.fn();
    mockResponse.send = mockSend;

    const responseData = { message: 'test response' };
    mockSend.mockReturnValue(responseData);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should call next middleware', () => {
    const mockRequest = {} as Request;
    const mockResponse = {} as Response;
    const mockNext = jest.fn();

    middleware.use(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
