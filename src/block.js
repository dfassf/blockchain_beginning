const fs = require('fs')
const merkle = require('merkle')
const CryptoJs = require('crypto-js')

class BlockHeader { 
    constructor(version ,index ,previousHash, time, merkleRoot){
        this.version = version 
        this.index = index  
        this.previousHash = previousHash 
        this.time = time
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
    const version = getVersion() 
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
    const previousHash = createHash(prevBlock) 
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

    const newBlock = nextBlock(data)
    if(ifValidNewBlock(newBlock, getLastBlock())){ 

        Blocks.push(newBlock) 
    return true
    }
    return false
}

function ifValidNewBlock(currentBlock, previousBlock){
    if(!isValidType(currentBlock)){
        console.log(`invalid structure ${JSON.stringify(currentBlock)}`)
        return false
    }

    if(previousBlock.header.index+1 !== currentBlock.header.index){
        console.log('invalid index')
        return false
    }

    if(createHash(previousBlock) !== currentBlock.header.previousHash){
        console.log('invalid previousBlock')
        return false
    }
    
    if(currentBlock.body.length===0){
        return false
    }

    if(merkle("sha256").sync(currentBlock.body).root !== currentBlock.header.merkleRoot){
        return false
    }
    
    
    if(!(currentBlock.body.length!==0 || 
        (merkle("sha256").sync(currentBlock.body).root === currentBlock.header.merkleRoot))
    ){
        return false
    }
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

addBlock(['hello1'])
addBlock(['hello2'])
addBlock(['hello3'])

function isValidBlock(Blocks){
    if(JSON.stringify(Blocks[0])!==
        JSON.stringify(createGenesisBlock())){
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

console.log(Blocks)

module.exports = {
    getBlocks,
    getLastBlock,
    addBlock,
    getVersion
}