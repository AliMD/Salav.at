#!/usr/bin/env bash

set -Eeuo pipefail
trap "echo '❌ Error!'" ERR

thisPath="$(dirname "$0")"

cd $thisPath; # chnage PWD if thisPath != "."

if [[ ${1:-} == '--pull' ]]
then
  docker-compose pull
  docker-compose build --pull
fi

docker-compose up \
  --detach \
  --remove-orphans \
  --force-recreate \
  --build \
&& docker-compose logs --follow --tail 100
