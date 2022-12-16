import { ClientKafka } from "@nestjs/microservices";

const body ={"key":"deviceid-34_appid-56","command":"mfaf.createDeliveryAddress"
,"value":{"session-id":"abc1234","invoke-id":"inv-1","address":"99/99 Chatuchark Bangkok"},"modifytime":"2022-12-16T08:13:18.633Z"}
const client = "SiHmITdIComg6q5zAAAB";
const key = body["key"];
var aa = new Map();
aa.set(key,client);


console.log(aa)
