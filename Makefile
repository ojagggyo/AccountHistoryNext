default:date

date:
	echo `date '+%Y%m%d'`
	git pull
	webpack --mode production
	docker build -t ojagggyo/accounthistorynext:`date '+%Y%m%d'` .

pro:	build
build:
	git pull
	webpack --mode production
	docker build -t ojagggyo/accounthistorynext:beta .

dev:
	git pull
	webpack
	docker build -t ojagggyo/accounthistorynext:beta .
vps:
	git checkout -- .
	git pull
	webpack
	docker build -t ojagggyo/accounthistorynext:vps .

test:
	echo 'Hello!!'
help:
	echo 'Usage: make [default|build|push|pull|help]'

push:
	sudo docker login -u ojagggyo
	sudo docker push ojagggyo/accounthistorynext:beta

pull:
	docker pull ojagggyo/accounthistorynext:beta

checkout:
	git checkout -- .
	git pull
