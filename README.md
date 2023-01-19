# MobileBE

npx nest g ga events --no-spec 
npx nest g module events --no-spec

npx nest g module mdm --no-spec
npx nest g service mdm --no-spec

https://portal.azure.com/#home
# docker install on myVM
    |--- sudo apt-get remove docker docker-engine docker.io
         sudo apt-get update
         sudo apt install docker.io
# add user
    |--- sudo usermod -aG docker surasak 
    
# on my vm for build images and push image to gitlab 
# build and zip 
    |--- npm run z
# copy to myVm and extract
    |--- 7za x dist.7z

$sudo docker build --no-cache -f mobile-be.Dockerfile -t mobile-be:1.6.0 .

$sudo docker run --env "CONSUMER_GROUP_ID=dev1" --name=mobile-be-lb-dev1-1 --rm -it -d -p 3000:3000 mobile-be:1.6.0
$sudo docker run --env "CONSUMER_GROUP_ID=dev1" --name=mobile-be-lb-dev1-2 --rm -it -d -p 3001:3000 mobile-be:1.6.0

$sudo docker run --env "CONSUMER_GROUP_ID=dev2" --name=mobile-be-dev2 --rm -it -d -p 3002:3000 mobile-be:1.6.0
$sudo docker run --env "CONSUMER_GROUP_ID=dev3" --name=mobile-be-dev3 --rm -it -d -p 3003:3000 mobile-be:1.6.0

# remove -d if want see log when error 

root@ueransim:~# docker login registry.gitlab.com
Username: iamzebraman
Password: 
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
root@ueransim:~# docker tag mobile-be:1.5.0  registry.gitlab.com/next-db-community/next-icd/socketiodemo:1.5.0
root@ueransim:~# docker push registry.gitlab.com/next-db-community/next-icd/socketiodemo:1.3.0


root@ueransim:~# docker tag mobilebe:1.2.0  registry.gitlab.com/next-db-community/next-icd/socketiodemo/mobilebe:1.2.0
root@ueransim:~# docker push registry.gitlab.com/next-db-community/next-icd/mobile:1.2.0


# at ADL
git clone https://github.com/ZebraManSx/SocketIODemoHelm

kubectl create ns mobile-be

# use for test/demo
https://websocket-demo-poc.adldigitalservice.com/

    |--- /produce-topic 

# create namespace
[surat443@vm-admd-jumphost-linux-001 helm]$ kubectl create namespace mobile-be
namespace/mobile-be created

# kubectl logs pod-name container-name
$kubectl logs -n websocket-demo socketiodemo-5fc8d58994-vpbrj socketiodemo -f

# mongo db
# ref : https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-with-docker/

$docker run --name surasak -p 27017:27017 -itd surasak/mongo-enterprise:5.0

# access mongo DB in docker 
$docker exec -it ${mongodb container id} bash