#! /bin/bash

# $1 will be the name of the docker image to remove from minikube

#first stop the pod from running
kubectl delete pod $1

#remove image from minikube memory
minikube image rm $1