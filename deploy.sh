#!/bin/bash

yarn build
docker build -t osama/rota-api:latest . --no-cache
heroku container:push --app=rota-api web
heroku container:release --app=rota-api web