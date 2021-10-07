import {Router} from 'express';
import {check, validationResult} from 'express-validator';
import {Task} from './task.model.js';
import {serializeDate} from '../utils.js';
import {oapi} from '../middlewares/openapi.middleware.js';
import {isLoggedIn} from '../middlewares/auth.middleware.js';

const router = Router();

router.use(isLoggedIn);

/**
 * @enum {string}
 */
export const FilterBy = {
  ALL: '',
  IMPORTANT: 'IMPORTANT',
  TODAY: 'TODAY',
  NEXT_7_DAYS: 'NEXT_7_DAYS',
  PRIVATE: 'PRIVATE',
};

/**
 * @api {get} /tasks/ List tasks
 */
router.get(
  '/',
  oapi.path({
    tags: [Task.name],
    description: 'List tasks',
    parameters: [
      {
        in: 'query',
        name: 'filter',
        schema: {
          type: 'string',
          enum: Object.values(FilterBy),
        },
      },
    ],
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: oapi.schema(Task.name),
            },
          },
        },
      },
    },
  }),
  (req, res) => {
    /** @type {FilterBy} */
    const filter = req.query.filter ?? FilterBy.ALL;
    const user = /** @type {User} */ req.user;
    const filterQuery = user.$relatedQuery('tasks');
    switch (filter) {
      case FilterBy.IMPORTANT:
        filterQuery.where('important', true);
        break;
      case FilterBy.TODAY: {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setUTCDate(today.getUTCDate() + 1);
        filterQuery
          .where('deadline', '>=', serializeDate(today))
          .where('deadline', '<', serializeDate(tomorrow));
        break;
      }
      case FilterBy.NEXT_7_DAYS: {
        const tomorrow = new Date();
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
        tomorrow.setUTCHours(0, 0, 0, 0);
        const nextWeek = new Date();
        nextWeek.setUTCDate(tomorrow.getUTCDate() + 7); // TODO is this right?
        filterQuery
          .where('deadline', '>=', serializeDate(tomorrow))
          .where('deadline', '<', serializeDate(nextWeek));
        break;
      }
      case FilterBy.PRIVATE:
        filterQuery.where('private', true);
        break;
      case FilterBy.ALL:
        break;
      default:
        return res.status(400);
    }

    filterQuery
      .then(tasks => res.json(tasks))
      .catch(() => res.status(500));
  },
);

/**
 * @api {get} /tasks/:id Gets a task by id
 */
router.get(
  '/:id',
  oapi.path({
    tags: [Task.name],
    description: 'Gets a task by id',
    parameters: [
      {
        in: 'path',
        name: 'id',
      },
    ],
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              schema: oapi.schema(Task.name),
            },
          },
        },
      },
    },
  }),
  (req, res) => {
    const {id} = req.params;
    const user = /** @type {User} */ req.user;
    user.$relatedQuery('tasks')
      .findById(id)
      .then(task => {
        if (task === undefined) {
          return res.status(404).json({message: `Task ${id} not found`});
        }
        return res.json(task);
      })
      .catch(e => res.status(503).json({message: `Task retrieval failed: ${e.message}`}));
  }
);

/**
 * @api {post} /tasks/ Creates a new task
 */
router.post('/', [
    check('description').isString().notEmpty(),
    check('important').isBoolean().toBoolean(),
    check('private').isBoolean().toBoolean(),
    check('deadline').isISO8601().optional({nullable: true}),
  ],
  oapi.path({
    tags: [Task.name],
    description: 'Creates a new task',
    requestBody: {
      description: 'Create task DTO',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              description: {
                type: 'string',
              },
              important: {
                type: 'boolean',
              },
              private: {
                type: 'boolean',
              },
              deadline: {
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
              type: 'object',
              schema: oapi.schema(Task.name),
            },
          },
        },
      },
    },
  }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({message: errors.array().join('\n')});
    }
    const body = /** @type {Task} */ req.body;
    const user = /** @type {User} */ req.user;
    user.$relatedQuery('tasks')
      .insert({
        description: body.description,
        important: body.important,
        private: body.private,
        deadline: body.deadline ?? '',
        completed: false,
      })
      /** @param task {Task} */
      .then((task) => res.status(201).json(task))
      .catch((e) => res.status(503).json({message: `Task inserted failed: ${e.message}`}));
  }
);

/**
 * @api {put} /tasks/:id Updates an existing task
 */
router.put('/:id', [
    check('description').isString().notEmpty(),
    check('important').isBoolean().toBoolean(),
    check('private').isBoolean().toBoolean(),
    check('deadline').isISO8601().optional({nullable: true}),
  ],
  oapi.path({
    tags: [Task.name],
    description: 'Updates an existing task',
    requestBody: {
      description: 'Update task DTO',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              description: {
                type: 'string',
              },
              important: {
                type: 'boolean',
              },
              private: {
                type: 'boolean',
              },
              deadline: {
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
              type: 'object',
              schema: oapi.schema(Task.name),
            },
          },
        },
      },
    },
  }),
  (req, res) => {
    const errors = validationResult(req);
    const body = /** @type {Task} */ req.body;
    if (!errors.isEmpty()) {
      return res.status(422).json({message: errors.array().join('\n')});
    } else if (parseInt(req.params.id) !== body.id) {
      return res.status(422).json({message: 'Request params id and request body id do not match'});
    }
    const user = /** @type {User} */ req.user;
    user.$relatedQuery('tasks')
      .findById(req.params.id)
      .patch({
        id: req.params.id,
        description: body.description,
        important: body.important,
        private: body.private,
        deadline: body.deadline ?? '',
      })
      .then(updatedCount => {
        if (updatedCount === 0) {
          return res.status(404).json({message: `Task ${body.id} not found`});
        }
        return res.status(200).json(body);
      })
      .catch((e) => res.status(503).json({message: `Task update failed: ${e.message}`}));
  }
);

/**
 * @api {patch} /tasks/:id Updates the `completed` flag of an existing task
 */
router.patch('/:id', [
    check('completed').isBoolean().toBoolean(),
  ],
  oapi.path({
    tags: [Task.name],
    description: 'Updates the `completed` flag of an existing task',
    requestBody: {
      description: 'Update task status DTO',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              completed: {
                type: 'boolean',
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
              type: 'object',
              schema: oapi.schema(Task.name),
            },
          },
        },
      },
    },
  }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }
    const body = /** @type {Task} */ req.body;
    const user = /** @type {User} */ req.user;
    user.$relatedQuery('tasks')
      .findById(req.params.id)
      .patch({
        completed: body.completed,
      })
      .then(updatedCount => {
        if (updatedCount === 0) {
          return res.status(404).json({message: `Task ${req.params.id} not found`});
        }
        return res.status(200).json(body);
      })
      .catch((e) => res.status(503).json({message: `Task update failed: ${e.message}`}));
  }
);

/**
 * @api {delete} /tasks/:id Deletes an existing task
 */
router.delete(
  '/:id',
  oapi.path({
    tags: [Task.name],
    description: 'Deletes an existing task',
    parameters: [
      {
        in: 'path',
        name: 'id',
      },
    ],
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              schema: oapi.schema(Task.name),
            },
          },
        },
      },
    },
  }),
  (req, res) => {
    const {id} = req.params;
    const user = /** @type {User} */ req.user;
    user.$relatedQuery('tasks')
      .deleteById(id)
      .then(task => res.status(200).json(task))
      .catch(e => res.status(503).json({message: `Task delete failed: ${e.message}`}));
  },
);

export default router;
