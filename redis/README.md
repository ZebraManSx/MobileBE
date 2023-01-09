# ==== install redis  
	|--- ref : https://www.jittagornp.me/blog/install-docker-redis-on-ubuntu-18.04/

docker run -d -p 6379:6379 -v /home/surasak/redis/data:/data --name redis --restart=always redis:7.0.7-alpine


# ====check process
surasak@ueransim:~/redis$ docker ps -a
CONTAINER ID   IMAGE                COMMAND                  CREATED          STATUS                   PORTS                                       NAMES
9e15b0403e9e   redis:7.0.7-alpine   "docker-entrypoint.s…"   19 seconds ago   Up 17 seconds            0.0.0.0:6379->6379/tcp, :::6379->6379/tcp   redis



# ===== use Redis CLI 
	|--- ref : https://redis.io/docs/manual/cli/

surasak@ueransim:~/redis/data$ docker exec -it 9e15b0403e9e redis-cli
127.0.0.1:6379>


# ===== use 
127.0.0.1:6379> set myKey "test1234"
OK

127.0.0.1:6379> get myKey
"test1234"

127.0.0.1:6379> MONITOR.
