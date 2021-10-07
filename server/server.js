import './env.js';
import express from 'express';
import morgan from 'morgan'; // logging middleware
import {Model} from 'objection';
import session from 'express-session';
import passport from 'passport';
import Knex from 'knex';
import tasksRouter from './task/task.router.js';
import usersRouter from './user/user.router.js';
import {oapi} from './middlewares/openapi.middleware.js';

const knex = Knex({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: process.env.DB_FILENAME,
    typeCast(field, next) { // Cast 0/1 SQL values to boolean
      console.log(field);
      if (field.type === 'TINY' && field.length === 1) {
        const value = field.string()
        return value ? value === '1' : null;
      }
      return next();
    },
  },
});

Model.knex(knex);

const app = new express();

app.use(morgan('dev'));
app.use(express.json());

app.use(session({
  secret: 'lorem ipsum dolor sit amet',
  resave: false,
  saveUninitialized: false
}));

// tell passport to use session cookies
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/tasks', tasksRouter);
app.use('/api/users', usersRouter);
app.use(oapi);
app.use('/docs', oapi.swaggerui);

// Activate the server
app.listen(process.env.API_PORT ?? 3000, () => {
  console.log(`Server running on ${process.env.API_BASE_URL}:${process.env.API_PORT}/`);
});
