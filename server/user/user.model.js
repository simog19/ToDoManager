import {Model} from 'objection';
import {oapi} from '../middlewares/openapi.middleware.js';
import {Task} from '../task/task.model.js';

export class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
        },
        name: {
          type: 'string',
        },
        hash: {
          type: 'string',
        },
      },
    };
  }

  static get relationMappings() {
    return {
      tasks: {
        relation: Model.HasManyRelation,
        modelClass: Task,
        join: {
          from: 'users.id',
          to: 'tasks.user',
        },
      },
    };
  }
}

oapi.schema(User.name, User.jsonSchema);
