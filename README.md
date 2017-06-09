# docker-mean
Docker [mongoDB, express, ANGULARJS, Node.js]

## Development and deployment With Docker

Install Docker

Install Compose

Local development and testing with compose:

$ docker-compose up
Local development and testing with just Docker:
$ docker build -t mean .
$ docker run -p 27017:27017 -d --name db mongo
$ docker run -p 3000:3000 --link db:db_1 mean
$

## To enable live reload, forward port 35729 and mount /app and /public as volumes:
$ docker run -p 3000:3000 -p 35729:35729 -v /Users/mdl/workspace/mean-stack/mean/public:/home/mean/public -v /Users/mdl/workspace/mean-stack/mean/app:/home/mean/app --link db:db_1 mean
Production deploy with Docker

## Production deployment with compose:
$ docker-compose -f docker-compose-production.yml up -d
Production deployment with just Docker:
$ docker build -t mean -f Dockerfile-production .
$ docker run -p 27017:27017 -d --name db mongo
$ docker run -p 3000:3000 --link db:db_1 mean

## Credits
Inspired by the great work of [Madhusudhan Srinivasa](https://github.com/madhums/)
The MEAN name was coined by [Valeri Karpov](http://blog.mongodb.org/post/49262866911/the-mean-stack-mongodb-expressjs-angularjs-and).

## License
[The MIT License](LICENSE.md)
