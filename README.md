# BigLab 2 - Class: 2021 WA1

## Team name: LUSIUM

Team members:
* s290198 GALOTA SIMONE
* s289376 PEPATO UMBERTO
* s290683 PEZZOLLA LUCA

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/GH-Classroom-BigLab-Instructions.pdf), covering this and the next BigLab.

Once cloned this repository, instead, write your names in the above section.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## List of APIs offered by the server

Provide a short description for API with the required parameters, follow the proposed structure.

* [HTTP Method] [URL, with any parameter]
* [One-line about what this API is doing]
* [Sample request, with body (if any)]
* [Sample response, with body (if any)]
* [Error responses, if any]

## APIs

A live OpenAPI (Swagger) documentation of our project is available at `<server url>/docs`.

### List Tasks

URL: `/api/tasks`

HTTP Method: GET

Description: Retrieve the list of all the tasks

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: An array of Task objects.
```
[ {id, description, important, private, deadline, completed, user} ]
```

### List Tasks (filtered)

URL: `/api/tasks?filter=:filterName`

HTTP Method: GET

Description: Retrieve the list of all the tasks filtered by a specific filter

Request body:  _None_

Response: `200 OK` (success), `400 Bad Request` (invalid filter)  or `500 Internal Server Error` (generic error).

Response body: An array of Task objects.
```
[ {id, description, important, private, deadline, completed, user}, {} ]
```

### Get a Task

URL: `/api/tasks/:id`

HTTP Method: GET

Description: Retrieve a task given its id

Request body:  _None_

Response: `200 OK` (success), `404 Not Found` (invalid Task-id)  or `500 Internal Server Error` (generic error).

Response body: An object describing a task.
```
{id, description, important, private, deadline, completed, user}
```
### Create a new Task

URL: `/api/tasks`

HTTP Method: POST

Description: Create a new task, by providing all relevant information (except the "id")

Request body:
```typescript
{
    description: string;
    important: boolean;
    private: boolean;
    deadline: string;
}
```

Response: `201 Created` (success), `422 Unprocessable Entity` (invalid request body)  or `503 Service Unavailable` (generic error).

Response body: An object, describing a task.
```
{id, description, important, private, deadline, completed, user}
```

### Update a task

URL: `/api/tasks/:id`

HTTP Method: PUT

Description: Update an existing task by providing all relevant information

Request body: An object representing the entire task
```typescript
{
    description: string;
    important: boolean;
    private: boolean;
    deadline: string;
}
```

Response: `200 OK` (success), `422 Unprocessable Entity` (invalid request body)  or `503 Service Unavailable` (generic error)

Response body: An object, describing a task.
```
{id, description, important, private, deadline, completed, user}
```

### Mark a task as completed/uncompleted

URL: `/api/tasks/:id`

HTTP Method: PATCH

Description: Mark an existing task as completed/uncompleted

Request body:
```typescript
{
    completed: boolean;
}
```

Response: `200 OK` (success), `422 Unprocessable Entity` (invalid request body)  or `503 Service Unavailable` (generic error)

Response body: An object, describing a task.
```
{id, description, important, private, deadline, completed, user}
```

### Delete a task

URL: `/api/tasks/:id`

HTTP Method: DELETE

Description: Delete an existing task by providing its code.

Request body: _None_

Response: `204 No Content` (success), `404 Not Found` (invalid Task-id)  or `503 Service Unavailable` (generic error).

Response body: _None_

### Login

URL: `/api/login`

HTTP Method: POST

Description: Login.

Request body:
```typescript
{
    email: string;
    password: string;
}
```

Response: `200 OK` (success), `404 Not Found` (invalid email)  or `503 Service Unavailable` (generic error).

Response body: an object representing the user.
```
{id, email, name}
```


### Logout

URL: `/api/logout`

HTTP Method: DELETE

Description: Logout.

Request body: _None_

Response: `200 OK` (success), `404 Not Found` (invalid email)  or `503 Service Unavailable` (generic error).

Response body: _None_
