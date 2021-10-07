import {Model} from 'objection';
import {oapi} from '../middlewares/openapi.middleware.js';

export class Task extends Model {
  static get tableName() {
    return 'tasks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        description: {
          type: 'string',
        },
        deadline: {
          type: 'string',
        },
        important: {
          type: 'boolean',
        },
        private: {
          type: 'boolean',
        },
        completed: {
          type: 'boolean',
        },
      },
    };
  }

  $parseDatabaseJson(json) {
    json = super.$parseDatabaseJson(json);
    Object.entries(Task.jsonSchema.properties)
      .filter(([_, v]) => v.type === 'boolean')
      .forEach(([k, _]) => {
        json[k] = json[k] != null ? Boolean(json[k]) : null;
      });
    return json;
  }
}

oapi.schema(Task.name, Task.jsonSchema);
