#!/bin/bash

DIR=$(cd $(dirname $0); pwd -P)
echo $DIR

DOCKER_NAME=accounthistory
DOCKER_IMAGE=ojagggyo/accounthistorynext

start() {
docker run -d \
--name $DOCKER_NAME \
--net=mynet0 \
--ip=172.100.0.102 \
-p 3002:3000 \
$DOCKER_IMAGE:beta
}
vps() {
docker run -d \
--name $DOCKER_NAME \
--net=mynet0 \
--ip=172.100.0.102 \
-p 3002:3000 \
$DOCKER_IMAGE:vps
}

stop() {
#docker stop $DOCKER_NAME
echo 強制終了
docker kill $DOCKER_NAME
docker rm $DOCKER_NAME
}

restart() {
    stop
    start
}

logs() {
docker logs -f --tail 100 $DOCKER_NAME
#echo "(Press CTRL+C to quit)"
}

sh() {
docker exec -it $DOCKER_NAME sh
}


# Main script: Check the parameter passed to the script
case "$1" in
    start)
        start
        #logs
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs
        ;;
    sh)
        sh
        ;;
    vps)
        vps
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs|sh}"
        exit 1
        ;;
esac
