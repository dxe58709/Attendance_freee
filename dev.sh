NAME=freee_database
DB_USERNAME=freee
DB_PASSWORD=L8Hwb3Oke5Rjx73
DB_NAME=freee

# RESET CONTAINERS
docker stop $NAME |> /dev/null
docker rm $NAME |> /dev/null

# INIT CONTAINERS
docker run -it -d \
    --name $NAME \
    -e MYSQL_RANDOM_ROOT_PASSWORD=yes \
    -e MYSQL_USER=$DB_USERNAME \
    -e MYSQL_PASSWORD=$DB_PASSWORD \
    -e MYSQL_DATABASE=$DB_NAME \
    -p 3306:3306/tcp \
    -p 33060:33060/tcp \
    -v="./docker-entrypoint-initdb.d/":/docker-entrypoint-initdb.d \
    mariadb:latest

sleep 5
# TRY LOGIN TO DATABASE
mysql -u freee -p -h $(docker inspect --format '{{ .NetworkSettings.IPAddress }}' $NAME)