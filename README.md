# Parking-Management-System

<p align=center>
 <img src="/node/public/images/Designer.png" alt="FISH" width="300" height="300">
</p>

### Features

- Booking
- Navigation
- ...

### Stack

- Node.js
- PostgreSQL
- Docker

## Setup

### Prerequisites

- Docker

Docker will handle the dependencies such as PostgreSQL, NodeJS and NPM.
On Windows/MacOS, I'd recommend installing the Docker GUI, as it also installs all the CLI tools, check the Docker section for more.

If you're unsure about Docker at all, I highly recommend these 2 videos below, they offer most of what you need, very quickly.

[docker in 100 seconds](https://www.youtube.com/watch?v=Gjnup-PuquQ) and [setting up docker](https://www.youtube.com/watch?v=gAkwW2tuIqE)

### Build and Run

In the root directory, run:

```sh
$ docker compose up --build
```

Note that `docker-compose` is outdated, though still shows up on a lot of tutorials/guides. Use `docker compose` instead.

Which should result in output similar to this trimmed down reading:

```sh
 ✔ db 14 layers [⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿]      0B/0B      Pulled                                                                                                                                                           17.1s
 => [node 1/5] FROM docker.io/library/node:20@sha256:844b41cf784f66d7920fd673f7af54ca7b81e289985edc6cd864e7d05e0d133c                                                                                             46.5s
                    ~ a bunch of stuff

 => [node internal] load build context                                                                                                                                                                             0.1s
 => => transferring context: 633.23kB                                                                                                                                                                              0.0s
 => [node 2/5] WORKDIR /node                                                                                                                                                                                       0.9s
 => [node 3/5] COPY package*.json ./                                                                                                                                                                               0.1s
 => [node 4/5] RUN npm install                                                                                                                                                                                     5.8s
 => [node 5/5] COPY . .                                                                                                                                                                                            0.1s
 => [node] exporting to image                                                                                                                                                                                      0.6s
 => => writing image sha256:c656b5d1d1f580f5cfd91f22f16e0f442481c990b13be3ff97d58363dc34cb08                                                                                                                       0.0s
[+] Running 4/4
 ✔ Network parking-management-system_default   Created                                                                                                                                                             0.1s
 ✔ Volume "parking-management-system_db-data"  Created                                                                                                                                                             0.0s
 ✔ Container parking-management-system-db-1    Created                                                                                                                                                             0.2s
 ✔ Container parking-management-system-node-1  Created                                                                                                                                                             0.2s
Attaching to db-1, node-1

                    ~ more stuff
db-1    | 2024-04-17 19:05:08.358 UTC [1] LOG:  database system is ready to accept connections
node-1  | > node@0.0.0 start
node-1  | > node ./bin/www
```

The first build will take a while, caching will speed up future builds.
The Node and Postgres containers will be running, you can see them using:

```sh
$ docker ps
```

Which should show the 2 containers:

```sh
CONTAINER ID   IMAGE                            COMMAND                  CREATED              STATUS         PORTS                    NAMES
4743965ade0d   postgres                         "docker-entrypoint.s…"   About a minute ago   Up 6 seconds   0.0.0.0:5432->5432/tcp   parking-management-system-db-1
c0e6040f0a19   parking-management-system-node   "docker-entrypoint.s…"   About a minute ago   Up 6 seconds   0.0.0.0:8080->8080/tcp   parking-management-system-node-1
```

When you want to restart the containers, just use `ctrl-c` on the command. If you want to delete them and completely rebuild, run `docker compose down` before running `docker compose up --build`. Note that this completely wipes any existing data in the database, which gets repopulated by the startup script.

Alternatively, you can do all this in the Docker GUI or even in your editor using the right extensions.

## Database documentation

### Overview

[/database/README.md](/database/README.md)

### Schema

Todo docs

## Development notes

- Node is setup with nodemon, so things should update as you make changes, without you needing to rebuild anything. Currently does not update for server changes. Needs to be looked at again.

- Node is also setup with [this script](/node/wait-for-it.sh) from [here](https://github.com/vishnubob/wait-for-it/tree/master), which has the node container wait for the postgres server to be ready before starting node, timing out at 15 seconds. This prevents crashes when node starts up before docker, since it depends on docker. If you notice node taking a long time to start up, check the logs to make sure the script is still working.
