#!/usr/bin/env bash

set -Eeuo pipefail
trap "echo '❌ Error!'" ERR

thisPath="$(dirname "$0")"

cd $thisPath; # chnage PWD if thisPath != "."

docker-compose build --no-cache

docker-compose up \
  --detach \
  --remove-orphans \
  --force-recreate

docker-compose logs --follow --tail 100
