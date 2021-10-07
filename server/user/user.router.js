import {Router} from 'express';
import {Strategy} from 'passport-local';
import passport from 'passport';
import bcrypt from 'bcrypt';
import {User} from './user.model.js';
import {oapi} from '../middlewares/openapi.middleware.js';

// noinspection JSCheckFunctionSignatures
passport.use(new Strategy(async (username, password, done) => {
  // verification callback for authentication
  try {
    const user = await User.query().where('email', username).first();
    if (!user) {
      return done(null, false, {message: 'Wrong credentials'});
    }

    let isValidLogin = await bcrypt.compare(password, user.hash);

    if (isValidLogin)
      return done(null, user);
    else
      return done(null, false, {message: 'Wrong credentials'});
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  User.query().findById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    })
    .catch(err => {
      done(err, null);
    });
});

const router = Router();

/**
 * @api {post} /users/login/ Authenticates an existing user
 */
router.post(
  '/login',
  oapi.path({
    tags: [User.name],
    description: 'Authenticates an existing user',
    requestBody: {
      description: 'Login DTO',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              username: {
                type: 'string',
              },
              password: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: oapi.schema(User.name),
            },
          },
        },
      },
    },
  }),
  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        const responseUser = {...user}
        delete responseUser.hash;
        return res.json(responseUser);
      });
    })(req, res, next);
  });

/**
 * @api {delete} /users/logout/ Logs out a user
 */
router.delete(
  '/logout',
  oapi.path({
    tags: [User.name],
    description: 'Logs out a user',
  }),
  (req, res) => {
    req.logout();
    res.json({message: 'Logged out'});
  },
);

export default router;
