const fs = require('fs')
const merkle = require('merkle')
const CryptoJs = require('crypto-js')
const { runInThisContext } = require('vm')
const { time } = require('console')

/* 사용법 */
// const tree = merkle("sha256").sync([]) // tree 구조 
// tree.root()

class BlockHeader { 
    constructor(version ,index ,previousHash, time, merkleRoot){
        this.version = version 
        this.index = index  // 마지막 블럭의 index + 1 
        this.previousHash = previousHash // 마지막 블럭 -> header -> string 연결  -> SHA256
        this.time = time  //
        this.merkleRoot = merkleRoot 
    }
}

class Block {
    constructor(header,body){
        this.header = header
        this.body = body
    }
}

let Blocks = [createGenesisBlock()] 

function getBlocks(){
    return Blocks
}

function getLastBlock() {
   return Blocks[Blocks.length - 1]
}

function createGenesisBlock(){
    // 1. header 만들기 
    // 5개의 인자값을 만들어야되여.
    const version = getVersion() // 1.0.0
    const index = 0
    const time = getCurrentTime() 
    const previousHash = '0'.repeat(64)
    const body = ['hello block']

    const tree = merkle('sha256').sync(body)
    const root = tree.root() || '0'.repeat(64)

    const header = new BlockHeader(version,index,previousHash,time,root)
    return new Block(header,body)
}

function nextBlock(data){
    const prevBlock = getLastBlock()
    const version = getVersion()
    const index = prevBlock.header.index + 1 
    const previousHash = createHash(prevBlock) // prevBlock.header.previousHash
    /* 이전해쉬값   
        version+index+previousHash+time+merkleRoot->함수로 따로 빼기
    */
    const time = getCurrentTime()

    const merkleTree = merkle("sha256").sync(data)
    const merkleRoot = merkleTree.root() || '0'.repeat(64)

    const header = new BlockHeader(version,index,previousHash,time,merkleRoot) 
    return new Block(header,data)
}

function createHash(block){
    const{
        version,
        index,
        previousHash,
        time,
        merkleRoot
    } = block.header
    const blockString = version+index+previousHash+time+merkleRoot
    const Hash = CryptoJs.SHA256(blockString).toString()
    return Hash
}

function addBlock(data){
    //내가 받은 블록과 비교 코드가 좀 길어지기 때문에 함수로 별도로 빼는 것이 간결하게 짜는 방법
    const newBlock = nextBlock(data)
    if(ifValidNewBlock(newBlock, getLastBlock())){ // 생성할 블록과 직전 블록과 비교 

        Blocks.push(newBlock) 
    return true
    }
    return false
}

// 1. type 검사: object/string/number

function ifValidNewBlock(currentBlock, previousBlock){
    if(!isValidType(currentBlock)){
        console.log(`invalid structure ${JSON.stringify(currentBlock)}`)
        return false
    }
    //if index is valid
    if(previousBlock.header.index+1 !== currentBlock.header.index){
        console.log('invalid index')
        return false
    }
    //previousHash check(***IMPORTANT***)
    /*  어떻게 만들어졌냐
        해당 블록의 header의 내용 합쳐서 sha256으로 암호화
        제네시스블록 기준 두번째 블록

    */
    if(createHash(previousBlock) !== currentBlock.header.previousHash){
        console.log('invalid previousBlock')
        return false
    }

    // body check
    // currentBlock.body => merkleTree root => result !== currentBlock.header.merkleRoot
    // body!==empty i.e  currentBlock.body.length !==0 && current.body.merkleRoot!== current.header.merkleRoot
    
    if(currentBlock.body.length===0){
        return false
    }

    if(merkle("sha256").sync(currentBlock.body).root !== currentBlock.header.merkleRoot){
        return false
    }
    
    
    if(!(currentBlock.body.length!==0 || 
        (merkle("sha256").sync(currentBlock.body).root === currentBlock.header.merkleRoot))
    ){
        console.log('노노노노')
        // return false
    }else{console.log('예스')}
    return true
}

function isValidType(block){

    return(
        typeof(block.header.version)==="string" &&
        typeof(block.header.index)==="number" &&
        typeof(block.header.previousHash)==="string" &&
        typeof(block.header.time)==="number" &&
        typeof(block.header.merkleRoot)==="string" &&
        typeof(block.body )==="object" 
    )
}

function getVersion(){
    const {version} = JSON.parse(fs.readFileSync("../package.json"))
    return version
}

function getCurrentTime(){
    return Math.ceil(new Date().getTime()/1000) 
}

// class 
// { header body } 1차 목표는 제네시스 블럭을 만드는것 
addBlock(['hello1'])
addBlock(['hello2'])
addBlock(['hello3'])


/*

제네시스 블럭이 유효한지, 데이터가 바뀐 적이 없는지
block 모든 배열 검사

*/

function isValidBlock(Blocks){
    if(JSON.stringify(Blocks[0])!==
        JSON.stringify(createGenesisBlock())){ //객체로 뜨고 false로 뜰거기 때문에 string으로
        console.log('genesis block error')
        return false
    }

    let tempBlocks = [Blocks[0]]
    for(let i=1; i<Blocks.length; i++){
        if(isValidNewBlock(Blocks[i],Blocks[i-1])){
            tempBlocks.push(Blocks[i])
        }
    }
}

module.exports = {
    getBlocks,
    getLastBlock,
    addBlock,
    getVersion
}