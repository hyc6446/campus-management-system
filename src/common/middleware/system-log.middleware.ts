// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';

// @Injectable()
// export class SystemLogMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     const startTime = Date.now();
//     const { method, originalUrl, ip, headers } = req;
//     const userAgent = headers['user-agent'] || 'unknown';

//     console.log(`[SYSTEM] ${new Date().toISOString()} - ${method} ${originalUrl} - IP: ${ip} - UserAgent: ${userAgent}`);

//     res.on('finish', () => {
//       const endTime = Date.now();
//       const duration = endTime - startTime;
//       const statusCode = res.statusCode;

//       console.log(`[SYSTEM] ${new Date().toISOString()} - ${method} ${originalUrl} ${statusCode} - Duration: ${duration}ms - IP: ${ip}`);
//     });

//     next();
//   }
// }