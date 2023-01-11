#!/bin/bash

docker run --env "BE_INSTANCE=dev1" --name=mobile-be-dev1 --rm -it -d -p 3000:3000 mobile-be:1.6.0
docker run --env "BE_INSTANCE=dev2" --name=mobile-be-dev2 --rm -it -d -p 3001:3000 mobile-be:1.6.0

docker run --name=nginx-mobile-be --rm -it -d -p 80:80 nginx-mobile-be:1.0.0

docker ps -a