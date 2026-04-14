default:date

date:
	echo `date '+%Y%m%d'`
	git pull
	webpack --mode production
	docker build -t ojagggyo/accounthistoryNext:`date '+%Y%m%d'` .

pro:	build
build:
	git pull
	webpack --mode production
	docker build -t ojagggyo/accounthistoryNext:beta .

dev:
	git pull
	webpack
	docker build -t ojagggyo/accounthistoryNext:beta .
vps:
	git checkout -- .
	git pull
	webpack
	docker build -t ojagggyo/accounthistoryNext:vps .

test:
	echo 'Hello!!'
help:
	echo 'Usage: make [default|build|push|pull|help]'

push:
	sudo docker login -u ojagggyo
	sudo docker push ojagggyo/accounthistoryNext:beta

pull:
	docker pull ojagggyo/accounthistoryNext:beta

checkout:
	git checkout -- .
	git pull
