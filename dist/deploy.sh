#!/bin/bash

NETWORK='sportsnet'
VERSION=0.0.1
USER=admin
USERPW=adminpw
PEERADMIN="PeerAdmin@hlfv1"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"


# specify new version as first CLI argument in case of Upgrade
if [ $# -gt 0 ]; then
  VERSION=$1
fi

# Create the archive if it doesn't exist
if [[ ! -f "$DIR/$NETWORK@$VERSION.bna" ]]; then
    composer archive create --sourceType dir \
        --sourceName $DIR/../business-network -a "$DIR/$NETWORK@$VERSION.bna"
fi

# Install Business Network 
composer network install -a "$DIR/$NETWORK@$VERSION.bna" -c $PEERADMIN

if [ $# -gt 0 ]; then
  composer network upgrade -c $PEERADMIN -n $NETWORK -V $VERSION
fi

# Start Business Network
composer network start -n $NETWORK -c $PEERADMIN \
    -V $VERSION -A $USER -S $USERPW --file "$DIR/$USER@$NETWORK.card"

# Import Network Admin identity
if [ '0' -eq $(composer card list | grep "$USER@$NETWORK" | wc -l) ]; then
    composer card import -f "$DIR/$USER@$NETWORK.card"
fi;

# Create Guest identity

# Ping Business Network
composer network ping -c "$USER@$NETWORK"
