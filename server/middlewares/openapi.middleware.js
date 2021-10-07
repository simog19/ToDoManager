import openapi from '@wesleytodd/openapi';

export const oapi = openapi({
  openapi: '3.0.0',
  info: {
    title: 'ToDo Manager API',
    description: 'Web Applications I ToDo app',
    version: '1.0.0',
  },
});
