docker build --no-cache -f nginx.Dockerfile -t nginx-mobile-be:1.0.0 .
docker run --name=nginx-mobile-be --rm -it -d -p 80:80 nginx-mobile-be:1.0.0