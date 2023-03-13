#!/bin/bash
set -e

tag=ngekaworu/time-mgt-umi

docker build --file ./Dockerfile --tag ${tag} ..;
docker push ${tag};
