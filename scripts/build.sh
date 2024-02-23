#! /bin/bash

# $1 will be the https git clone link
# $2 will be the name of the docker image, this will be a dropdown that the frontend selects

#minikube should already be started, if not run "minikube start"

# fail on error
set -eu

#create temp workspace and clone project into it
mkdir tempWorkspace
cd tempWorkspace
git clone $1 #will clone input that was sent to backend

#navigate to the newly cloned folder, which should be the only folder in the directory
cd *

#build the docker image
docker build -t $2 . #will build a docker image named the second input

#push the newly created local docker image directly to Minikube
minikube image load $2 --overwrite
#can run "minikube image ls" to verify it loaded

#run image in kube cluster
kubectl run $2 --image=$2 --image-pull-policy=Never --restart=Never