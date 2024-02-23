#! /bin/bash

# fail on error
set -eu

#start minikube
minikube start

#Set active context of docker
docker context use default