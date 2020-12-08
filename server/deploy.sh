#!/bin/bash

echo What should the version be?
read VERSION
docker build -t bernardoquina/lireddit:$VERSION .
docker push bernardoquina/lireddit:$VERSION
ssh root@165.232.106.15 "docker pull bernardoquina/lireddit:$VERSION && docker tag bernardoquina/lireddit:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"