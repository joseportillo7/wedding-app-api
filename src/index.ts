import express, {Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app:Express = express();

const port = process.env.PORT;

app.get('/Welcome', (req:Request, res:Response) => {
  res.send('Wedding API server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});