#!/bin/bash
set -e

tag=ngekaworu/yingxv

docker build --file ./Dockerfile --tag ${tag} ..;
docker push ${tag};
