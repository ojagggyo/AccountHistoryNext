#!/bin/bash -x

docker run -d \
--name accounthistory \
--net=mynet0 \
--ip=172.100.0.102 \
-p 3002:3000 \
ojagggyo/accounthistorynext:`date '+%Y%m%d'`
#ojagggyo/accounthistory:`basename ${0%.*}`
