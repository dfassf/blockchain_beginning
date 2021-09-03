const WebSocket = require('ws')
const wsPORT = process.env.ws_PORT || 6001
let sockets = [] // 전역변수, socket에 연결된 peer들을 모아두는 배열

function getSockets(){return getSockets}

//socket은 event적인게 많아서 arrow를 안씀

//최초의 접속
function wsInit(){
    const server = new WebSocket.Server({port:wsPORT})
    server.on("connection",(ws)=>{ //커넥션을 하겠다 x 커넥션이 된 시점 o
        console.log(ws)
        init(ws)
    }) // 메시지를 받을 수 있는 상태로 만들어줌
}

function write(ws, message){ws.send(JSON.stringify(message))}

function broadcast(message){
    sockets.forEach(socket=>{
        write(socket,message)
    })
}

function connectionToPeers(newPeers){ //배열로 들어갈꺼다
    newPeers.forEach(peer=>{// 스트링으로 주소값 들어감 예: "ws://localhost:7001" http가 아닌 ws로 통신하기 때문
        const ws = new WebSocket()
        ws.on("open",()=>{init(ws)})
        ws.on("error",()=>{console.log("errror")})
    })
}

function init(ws){
    sockets.push(ws)

}

module.exports = {
    wsInit,
    getSockets,
    broadcast,
    connectionToPeers
}