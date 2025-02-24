import express, { Request, Response ,Application,NextFunction} from 'express';
import cors from "cors";
import helmet from 'helmet';
import compression from 'compression';
import router from './routes';

const appMiddleWare=(app:Application)=>{
    app.use(cors());
   
  app.use(
    express.json({
      limit: '5mb', // TO be moved to config,
    })
  );

  // parse urlencoded request body
  app.use(
    express.urlencoded({
      extended: false,
      parameterLimit: 10,
      limit: '5mb',
    })
  );

 // set security HTTP headers
 app.use(helmet());
   
    // app.use();

  // enables the "gzip" / "deflate" compression for response
  app.use(compression({ threshold: 2048 }));

  app.use('/ping', (req: Request, res: Response) => {
     res.status(200).send({ message: 'Pong ' }).end();
  });
router(app);
  // All unhandled routes
  app.use((req: Request, res: Response, next: NextFunction) => {
    const error: any = new Error('Page not found!');
    error.status = 404;
    next(error);
  });

  // All unhandled errors
  app.use((error: any, req: Request, res: Response) => {
    res.status(error.status || 500);
    res.json({
      message: error.message,
    });
  });
}

export default appMiddleWare;