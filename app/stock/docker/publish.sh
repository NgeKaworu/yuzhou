#!/bin/bash
set -e

tag=ngekaworu/stock-umi

docker build --file ./Dockerfile --tag ${tag} ..;
docker push ${tag};
