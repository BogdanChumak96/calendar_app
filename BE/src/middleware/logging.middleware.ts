import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, query, params } = req;

    this.logger.log(`Incoming Request: ${method} ${originalUrl}`);
    this.logger.debug(`Params: ${JSON.stringify(params)}`);
    this.logger.debug(`Query: ${JSON.stringify(query)}`);
    this.logger.debug(`Body: ${JSON.stringify(body)}`);

    const startTime = Date.now();
    const oldSend = res.send;

    res.send = (data) => {
      const duration = Date.now() - startTime;
      this.logger.log(`Outgoing Response: ${method} ${originalUrl}`);
      this.logger.debug(`Response Body: ${data}`);
      this.logger.log(`Duration: ${duration}ms`);

      res.send = oldSend;
      return res.send(data);
    };

    next();
  }
}
