#!/bin/bash

# Setup the Environment variables for the REST Server

#1. Set up the card to be used
export COMPOSER_CARD=admin@sportsnet

#2. Set up the namespace usage    always |  never
export COMPOSER_NAMESPACES=never

#3. Set up the REST server Authhentcation    true | false
export COMPOSER_AUTHENTICATION=true

#4. Set up the Passport strategy provider
export COMPOSER_PROVIDERS='{
  "google": {
    "provider": "google",
    "module": "passport-google-oauth2",
    "clientID": "807034948582-7ukakk7rna495em5g77vlhj8f7n1dv5o.apps.googleusercontent.com",
    "clientSecret": "qmp56ogOF2X-fakll-c3PUWr",
    "authPath": "/auth/google",
    "callbackURL": "/auth/google/callback",
    "scope": "https://www.googleapis.com/auth/plus.login",
    "successRedirect": "/",
    "failureRedirect": "/"
  }
}'

#5. Execute the REST server
composer-rest-server
