# The Database

### Useful Documentation
https://hub.docker.com/_/postgres
https://node-postgres.com/
## Interaction

### Node

The `pg` library does the heavy lifting.
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
$ psql -h <hostname> -p <port> -U <username> -d <database_name> -c '<your_query>'
```

Which, in our case, would be:

```sh
$ psql -h 0.0.0.0 -p 5432 -U postgres -d postgres -c 'SELECT * FROM "User";'
Password for user postgres: <password> (which is literally 'password')
 userid | username | password  |    email
--------+----------+-----------+-------------
      1 | bob      | password  | bob@bob.bob
      2 | job      | password2 | job@bob.bob
(2 rows)
```

# Schema

### Objectives
#### User
- View, create, update and delete their account. 
- View, create, update and delete their registered vehicles.
- View, create, update and delete their bookings.
- View car parks and spaces.
- View booking timetable.
#### Admin
- View, create, update and delete accounts.
- View, create, update and delete registered vehicles.
- View, create, update and delete bookings.
- View, create, update and delete car parks and spaces.
- View, create, update and delete bookings.