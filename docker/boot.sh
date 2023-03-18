
docker compose stop
docker compose rm -f
docker compose pull   
docker compose --env-file ~/.env up -d