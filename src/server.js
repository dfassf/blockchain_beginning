const express = require('express')
const app = express()
const PORT = process.env.PORT  || 3000
const bc = require('./block.js') // export 할 내용이 추가될 수 있기 때문
const ws = require('./network.js')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended:false}))

// app.use('/',(req,res)=>{
//     res.send('zz')
// })

app.get('/blocks',(req,res)=>{
    res.send(bc.getBlocks())
})

app.get('/version',(req,res)=>{
    res.send(bc.getVersion())
})

// data=[]
// curl http://localhost:3000/mineBlock
// curl -X POST 리퀘스트 메서드
// curl -H "Content-Type:application/json"  * JSON과 같은 객체 형태로 보내는것이 베스트
// curl -d "{\"Hello World!\"}" * data의 줄임말, 따옴표 안에 따옴표는 문제가 생길 수 있어서 이렇게 침
// curl -X POST -H "Content-Type:application/json" -d "{\"data\":[\"Hello World\"]}" http://localhost:3000/mineBlock 

app.post('/mineBlock',(req,res)=>{
    const data = req.body.data
    console.log('하하')
    const result = bc.addBlock(data)
    if(result==false){
        res.send(`실패`)
    } else{
        res.send(result)
    }
})

app.get('/stop',(req,res)=>{
    res.send('server stop')
    process.exit(0)
})


// peers -> 현재 가지고 있는 sockets list ->getSockets
// addPeers -> 내가 보낼 주소값에 소켓을 생성하는 작업 connectPeers POST
// connectionToPeers 사용하려면 배열을 받아야 함
// curl -X POST -H "Content-Type:application/json" -d "{\"peers\":[\"ws://localhost:7001\",\"ws://localhost:7002\"]}" http://localhost:3000/addpeers

app.get('/peers',(req,res)=>{
    
    res.send(ws.getSockets().map(sockets=>{
        return `${socket._socket.remoteAddress}:${socket._socket.remotePort}`
    }))
})

// curl -X POST -H "Content-Type:application/json" -d "{\"peers\":[\"ws://localhost:7001\",\"ws://localhost:7002\"]}" http://localhost:3000/peers
// curl -X POST -H "Content-Type:application/json" -d "{\"peers\":[\"ws://localhost:7001\",\"ws://localhost:7002\"]}" http://localhost:3000/addPeers

app.post('/addPeers',(req,res)=>{
    const peers = req.body.peers || []
    ws.connectionToPeers(peers)
    res.send('success')
})


ws.wsInit()



app.listen(PORT,()=>{
    console.log(`ronnin like a ledi at ${PORT}`)
})

/* 

windows: set 변수명=값

mac/linux: export 변수명=값
env | grep 변수명

*/

