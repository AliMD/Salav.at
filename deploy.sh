#!/usr/bin/env bash

set -Eeuo pipefail
trap "echo '❌ Error'" ERR

thisPath="$(pwd)"

echoStep () {
    echo "🔹 $1"
}

error () {
    echo "❌ $1"
    exit 1
}

remoteShell () {
    server=$1; shift;
    echoStep "remoteShell"
    ssh $server -tt $@
}

servicePath="/srv/salav.at"

syncFolder () {
    server=$1; shift;
    echoStep "syncFolder"

    remoteShell $server "mkdir -p $servicePath"
    echoStep "Uploading ..."
    rsync \
      -Pazzh --delete \
      --exclude=deploy.sh \
      --exclude=/node_modules \
      --exclude=/.git \
      --exclude=/build \
      --exclude=/design \
      --exclude=/js \
      --exclude=/src \
      --exclude=/font \
      --exclude=/image \
      ./ $server:$servicePath/
}

syncAndUp () {
    server=$1; shift;
    echoStep "syncAndUp"
    syncFolder $server
    remoteShell $server "cd $servicePath; chmod +x _up.sh; ./_up.sh"
}

dcDown () {
    server=$1; shift;
    echoStep "Down service"
    remoteShell $server "cd $servicePath; docker-compose ps; docker-compose down --remove-orphans; docker-compose ps"
}

echoStep "sync: Starting ..."

if [[ "${1:-}" == "--down" ]]
then
    dcDown root@srv.salav.at

else
    syncAndUp root@srv.salav.at

fi

echoStep "sync: done"
