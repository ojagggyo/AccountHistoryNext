#!/bin/bash
#別マシンでビルドしたイメージ

#docker run -d \
#--name accounthistory \
#--net=mynet0 \
#--ip=172.100.0.102 \
#-p 3002:3000 \
#ojagggyo/accounthistory:next

#docker pull ojagggyo/accounthistorynext:vps

docker run -d \
--name accounthistory \
--net=mynet0 \
--ip=172.100.0.102 \
-p 3002:3000 \
ojagggyo/accounthistorynext:vps
