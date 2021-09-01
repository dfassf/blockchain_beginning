const fs = require('fs')
const merkle = require('merkle')
const CryptoJs = require('crypto-js')


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

function createGenesisBlock(){
    //1. header 만들기: 5개 인자 필요
    const version = getVersion() // 1.0.0
    const index = 0
    const time = getCurrentTime()
    const previousHash = '0'.repeat(64)
    const body = ['hello block']

    const tree = merkle('sha256').sync(body)
    const root = tree.root() || '0'.repeat(64)
    
    const header = new BlockHeader(version, index, previousHash, time, root)
    
    return new Block(header,body)
    
    // const merkleRoot =        //바디 내용 필요
}

let Blocks =[createGenesisBlock()]

function getPreviousHash(){
    const newVersion = getLastBlock().header.version
    const newIndex = getLastBlock().header.index.toString()
    const newPreviousHash = getLastBlock().header.previousHash
    const newTime = getLastBlock().header.time.toString()
    const newRoot = getLastBlock().header.merkleRoot
    const result = newVersion+newIndex+newPreviousHash+newTime+newRoot
    console.log(newPreviousHash,'뉴덱')
    return result.toString()
}


function addBlock(){
    //헤더 다 스트링으로 순서대로 연결->sha256
    const version = getVersion() // 1.0.0
    const index = getLastBlock().header.index+1
    const time = getCurrentTime()
    const previousHash = getPreviousHash()
    const body = [`hello block${index+1}`]

    const tree = merkle('sha256').sync(body)
    const root = tree.root() || '0'.repeat(64)
    
    const header = new BlockHeader(version, index, previousHash, time, root)

    return new Block(header,body)
}

function getBlock(){
    return Blocks
}

//마지막 블럭 가져오기
function getLastBlock(){
    return Blocks[Blocks.length-1]
}

function pushBlock(){
    Blocks.push(addBlock())
}

pushBlock()
pushBlock()
pushBlock()
// console.log(Blocks)




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

