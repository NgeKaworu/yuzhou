#!/bin/bash
set -e

tag=ngekaworu/user-center-umi

docker build --file ./Dockerfile --tag ${tag} ..;
docker push ${tag};
