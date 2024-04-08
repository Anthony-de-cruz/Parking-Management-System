# The Database

The DB is to be run with `docker-compose`. To be used with the `pg` node package.

# Startup

### Linux/MacOS

```sh
$ docker-compose up
```

### Windows

Just use the Docker GUI, download and documentation below.

https://docs.docker.com/desktop/

# Connect

Default IPv4: `0.0.0.0`, Port: `5432`

# Interaction

### Node

The `pg` library does the heavy lifting.

Excerpt from the documentation:

#### Installation

```sh
$ npm install pg
```

#### Usage

```js
import pg from "pg";
const { Client } = pg;
const client = new Client();
await client.connect();

const res = await client.query("SELECT $1::text as message", ["Hello world!"]);
console.log(res.rows[0].message); // Hello world!
await client.end();
```

https://node-postgres.com/

### GUIs

Most editors, like VSCode, have Postgres extensions. They should work well, but I'd recommend using a dedicated editor like DataGrip or pgAdmin 4.

### CLIs

`psql` comes installed with postgres.

You can access the PostgresCLI to write queries by connecting with:

```sh
$ psql -h <hostname> -p <port> -U <username> -d <database_name>
```

Which, in our case, would be:

```sh
$ psql -h 0.0.0.0 -p 5432 -U postgres -d postgres
Password for user postgres: <password> (which is literally 'password')
Type "help" for help.
```

You can then write your queries:

```sh
postgres=# SELECT * FROM "User";
 userid | username | password  |    email
--------+----------+-----------+-------------
      1 | bob      | password  | bob@bob.bob
      2 | job      | password2 | job@bob.bob
(2 rows)
```

And quit with:

```sh
postgres=# \q
```

Alternatively, you can add the query directly in the connection command:

```sh
$ psql -h <hostname> -p <port> -U <username> -d <database_name> -c 'your_query'
```

Which, in our case, would be:

```sh
$ psql -h 0.0.0.0 -p 5432 -U postgres -d postgres -c 'SELECT * FROM "User";'
Password for user postgres:
 userid | username | password  |    email
--------+----------+-----------+-------------
      1 | bob      | password  | bob@bob.bob
      2 | job      | password2 | job@bob.bob
(2 rows)
```
