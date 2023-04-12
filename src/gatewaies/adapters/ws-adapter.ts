/* eslint-disable prettier/prettier */
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Server } from 'socket.io';
import * as sharedsession from 'express-socket.io-session'

// import  * as session from 'express-session';
import { Session } from '../../auth/sessions/sessions.entity';
import { TypeormStore } from 'connect-typeorm';
import { getRepository } from 'typeorm';
import * as passport from 'passport';
import * as dotenv from 'dotenv';
dotenv.config({ path: process.cwd() + '/.env' });
/**
 * Enable session tokens for web sockets by using express-socket.io-session
 */
export class EventsAdapter extends IoAdapter {
  private app: NestExpressApplication;

  constructor(app: NestExpressApplication) {
    super(app)
    this.app = app
  }

  createIOServer(port: number, options?: any): any {
    const server: Server = super.createIOServer(port, options);
    const sessionRepository = getRepository(Session);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const session = require("express-session")({
      secret: process.env.COOKIE_SECRET,
      saveUninitialized: false,
      resave: false,
      name: 'CHAT_APP_SESSION',
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // cookie expires 1 day later
      },
      store: new TypeormStore().connect(sessionRepository),
    });
    this.app.use(session)
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    server.use(sharedsession(session, {
      autoSave: true
    }))
    return server;
  }
}