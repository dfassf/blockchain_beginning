const fs = require('fs')
const merkle = require('merkle')
const CrytoJs = require('crypto-js')

class BlockHeader{
    constructor(version, index, previousHash, time, merkleRoot){
        this.version = version
        this.index = index
        this.previousHash = previousHash // 마지막 block 가져와서 header를 읽은 다음 string으로 읽은 다음
                                         // sha256으로 변환할 수 있어야 함
        this.time = time
        this.merkleRoot = merkleRoot
    }
}

class Block{
    constructor(header,body){
        this.header = header
        this.body = body
    }
}

function createGenesisBlock(idx){
    //1. header 만들기: 5개 인자 필요
    let version = getVersion() // 1.0.0
    console.log(idx,'idx')
    let index
    idx==undefined ? index = 0 : index = idx
    let time = getCurrentTime()
    let previousHash = '0'.repeat(64)
    let body = ['hello block']

    let tree = merkle('sha256').sync(body)
    let root = tree.root() || '0'.repeat(64)
    
    let header = new BlockHeader(version, index, previousHash, time, root)

    return new Block(header,body)
    
    // const merkleRoot =        //바디 내용 필요
}

function addBlock(){
    if(Blocks.length==0){
        console.log('pass if')
        let newBlock = createGenesisBlock(0)
        Blocks.push(newBlock)
    }else{
        console.log('pass else')
        let idx = getLastBlock().header.index+1
        let newBlock = createGenesisBlock(idx)
        Blocks.push(newBlock)
    }

}

let Blocks =[]

function getBlock(){
    return Blocks
}

//마지막 블럭 가져오기
function getLastBlock(){

    return Blocks[Blocks.length-1]
}

addBlock()

addBlock()

addBlock()





// const blockchain = new Block(new BlockHeader(1,2,3,4,5),['hello'])
// console.log(blockchain)

// const header = new BlockHeader(1,2,3,4,5)
// const header2 = new BlockHeader(2,3,4,5,6)

// console.log(header)
// console.log(header2)

// 사용법
// const tree = merkle('sha256').sync([]) //tree구조
// tree.root()

function getVersion(){
    // 어떤 파일 읽을거냐
    const package = fs.readFileSync("../package.json")
    // console.log(JSON.parse(package).version) //toString하지 않아도 변환됨
    // const {package} = JSON.parse(fs.readFileSync("../package.json"))
    return JSON.parse(package).version
}

function getCurrentTime(){
    return Math.ceil(new Date().getTime())
}




getVersion()
getCurrentTime()
