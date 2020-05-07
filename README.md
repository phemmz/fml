# fml
FML is a mini market data bank to show food market location

## Installation
1. Start up your terminal (or Command Prompt on Windows OS).
2. Ensure that you have `node` installed on your PC.
3. Clone the repository by entering the command `git clone https://github.com/phemmz/fml.git` in the terminal.
4. Navigate to the project root folder using `cd fml` on your terminal (or command prompt).
5. After cloning, install the application's dependencies with the command `yarn`.
6. Create a `.env` file in your root directory as described in `.env.sample` file.
7. Variable such as DATABASE_URL (which must be a postgresql URL) is defined in the .env file and it is essential to create this file before running the application.
```
DATABASE_URL='postgres://username:password@hostname/databasename'
```
Other important variables are
JWTSECRET - needed to sign jsonwebtoken
REACT_APP_MAP_KEY - needed to access google map api
8. After this, you can start the server with the command:

### `yarn start`

Runs the frontend app in the development mode.<br />
Default PORT is 5000 but you can also run on 3000. Those are the CORS enabled ports.

Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

### `yarn dev:server`

Runs the server api in the development mode.<br />
Default PORT is 300 but you can use any port.

## Development

This application was developed using [ExpressJS](http://expressjs.com) for backend and [ReactJS](https://reactjs.org/) for the frontend. [PostgreSQL](https://www.postgresql.org/) was used for persisting data with [Sequelize](https://http://docs.sequelizejs.com) as [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping).

## API Documentation
These are the main features of the app

### Users
- There are two types of users - admin and user. Only Admin can add, update and delete markets and requires authentication to do this via login which is shown below:

```POST /login```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `email` | `string` | **Required**. Your email address |
| `password` | `string` | **Required**. Password, minimum of 6 characters |

## Response

The API endpoint return a JSON representation based on the status of the transaction

200
```javascript
{
  "message" : string,
  "token"   : string,
  "success" : bool,
  "data"    : object
}
```

### Market
- You can perform CRUD operations on the market endpoint 

```GET /market```

## Response

The API endpoint return a JSON representation based on the status of the transaction

200
```javascript
{
  "message" : string,
  "token"   : string,
  "success" : bool,
  "data"    : array
}
```

```POST /market```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | **Required**. Market name |
| `category` | `string` | **Required**. Food category |
| `description` | `string` | Brief description of market |
| `location` | `string` | **Required**. Location of the market |
| `images` | `string` | **Required**. Sample images of market. Maximum of 3 allowed |

## Response

The API endpoint return a JSON representation based on the status of the transaction

200
```javascript
{
  "message" : string,
  "success" : bool,
  "data"    : object
}
```

```PATCH /market```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | **Required**. Market id to update |
| `name` | `string` | **Required**. Market name |
| `category` | `string` | **Required**. Food category |
| `description` | `string` | Brief description of market |
| `location` | `string` | **Required**. Location of the market |
| `images` | `string` | **Required**. Sample images of market. Maximum of 3 allowed |

## Response

The API endpoint return a JSON representation based on the status of the transaction

200
```javascript
{
  "message" : string,
  "success" : bool,
  "data"    : object
}
```

```DELETE /market```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | **Required**. Market id |

## Response

The API endpoint return a JSON representation based on the status of the transaction

200
```javascript
{
  "message" : string,
  "success" : bool
}
```

## Limitations or Things to Improve on
- Mobile responsiveness is not the best
- Logic to get nearest market locations can be improved on
- Use server side rendering to protect client side keys like google map api key
