import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';

import '@shared/infra/typeorm';

import '@shared/container';

const app = express();

app.use(cors());

app.use(express.json());
// Rota para acessar os arquivos na pasta
app.use("/files", express.static(uploadConfig.tmpFolder));
app.use(routes);

app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
      return response
        .status(error.statusCode)
        .json({ status: 'error', message: error.message });
    }

    // eslint-disable-next-line no-console
    console.error(error);

    return response.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  },
);

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('¯\\_(ツ)_/¯ Server started on port 3333!');
});
