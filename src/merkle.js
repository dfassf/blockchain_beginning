
// npm i merkletreejs crypto-js merkle
const {MerkleTree} = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')

const testSet = ['a', 'b', 'c'].map(x=>SHA256(x))



const tree = new MerkleTree(testSet,SHA256) //클래스라서, 각각 대상과 방법 인자값으로

const root = tree.getRoot() // 루트 가져오기
const testRoot = 'a'

const leaf = SHA256(testRoot)

const proof = tree.getProof(leaf)

console.log(tree.verify(proof, leaf, root))
console.log(tree.toString())