import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import worker from './jobs/worker';
import validateEnvironmentVars from './validator';

class App {

  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    dotenv.config();
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use( express.json());
    worker.init();
    validateEnvironmentVars();
  }

  private routes(): void {
    this.app.use('/',((req, res) => res.status(200).json({message:'hello it works'})));
  }

}

export default new App().app;
