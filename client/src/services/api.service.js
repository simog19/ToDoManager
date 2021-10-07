import dayjs from 'dayjs';

export class ApiException extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const fetchMethod = async (path, method, body) => {
  const options = {
    headers: new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }),
    method,
    body: body != null ? JSON.stringify(body) : undefined,
  };
  const response = await fetch(path, options);
  if (response.status >= 400) {
    const body = await response.json();
    throw new ApiException(body.message, response.status);
  }
  return response.json();
};

const createFetchClient = (baseUrl) => ({
  get: path => fetchMethod(baseUrl + path, 'GET'),
  post: (path, body) => fetchMethod(baseUrl + path, 'POST', body),
  put: (path, body) => fetchMethod(baseUrl + path, 'PUT', body),
  patch: (path, body) => fetchMethod(baseUrl + path, 'PATCH', body),
  delete: (path) => fetchMethod(baseUrl + path, 'DELETE'),
});

const _fetch = createFetchClient('/api');

/**
 * Fetches all the available tasks
 *
 * @param filter {?FilterBy}
 * @return {Promise<Array<Task>>}
 */
export const fetchTasks = async filter => {
  const tasks = await _fetch.get(`/tasks${filter ? `?filter=${filter}` : ''}`);
  return tasks.map(task => {
    if (task.deadline) {
      task.deadline = dayjs(task.deadline);
    }
    return task;
  });
};

/**
 * Creates a new Task
 *
 * @param task {Task}
 * @return {Promise<number>}
 */
export const createTask = (task) => _fetch.post('/tasks', task);

/**
 * Updates an existing Task
 *
 * @param task {Task}
 * @return {Promise}
 */
export const updateTask = (task) => _fetch.put(`/tasks/${task.id}`, task);

/**
 * Checks/unchecks a Task
 *
 * @param task {Task}
 * @return {Promise}
 */
export const updateTaskStatus = (task) => _fetch.patch(`/tasks/${task.id}`, {completed: task.completed});

/**
 * Deletes a Task
 *
 * @param task {Task}
 * @return {Promise}
 */
export const deleteTask = (task) => _fetch.delete(`/tasks/${task.id}`);

/**
 * Fetch the authenticated user
 *
 * @return {Promise}
 */
export const fetchMe = () => _fetch.get('/users/me')

/**
 * Authenticate user
 *
 * @return {Promise}
 */
export const login = (email, password) => _fetch.post('/users/login', {username: email, password: password})

export const logout = () => _fetch.delete('/users/logout');

