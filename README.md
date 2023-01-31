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

$sudo docker build --no-cache -f mobile-be.Dockerfile -t mobile-be-poc:2.0.0 .

$sudo docker run -e "CONSUMER_GROUP_ID=dev1" -e "BE_URL=http://192.168.1.150:3000" -e "MDM_URL=https://mfaf-mdm-poc.adldigitalservice.com" -e "RADIS_HOST=192.168.1.150" -e "RADIS_PORT=6379" --name=mobile-be-poc-1 --rm -it -d -p 3000:3000 mobile-be-poc:2.0.0


# remove -d if want see log when error 

root@ueransim:~# docker login registry.gitlab.com
Username: iamzebraman
Password: 
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded

# v1
root@ueransim:~# docker tag mobile-be:1.5.0  registry.gitlab.com/next-db-community/next-icd/socketiodemo:1.5.0
root@ueransim:~# docker push registry.gitlab.com/next-db-community/next-icd/socketiodemo:1.3.0

# v2 [radis+mdm]
docker tag mobile-be-poc:2.0.0 registry.gitlab.com/next-db-community/next-icd/mobile-be-poc:2.0.0
docker push registry.gitlab.com/next-db-community/next-icd/mobile-be-poc:2.0.0

# at ADL
git clone https://github.com/ZebraManSx/SocketIODemoHelm

kubectl create ns mobile-be

# use for test/demo
https://websocket-demo-poc.adldigitalservice.com/

    |--- /produce-topic 
    |--- /oda1-event-trigger

# create namespace
[surat443@vm-admd-jumphost-linux-001 helm]$ kubectl create namespace mobile-be-poc
namespace/mobile-be-poc created

# kubectl logs pod-name container-name
$kubectl logs -n websocket-demo socketiodemo-5fc8d58994-vpbrj socketiodemo -f

# mongo db
# ref : https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-with-docker/

$docker run --name surasak -p 27017:27017 -itd surasak/mongo-enterprise:5.0

# access mongo DB in docker 
$docker exec -it ${mongodb container id} bash