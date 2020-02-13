import * as CryptoJS from "crypto-js";

class Block{
    public index:number;
    public hash:string;
    public previousHash:string;
    public data:string;
    public timestamp:number;

    static calculateBlockHash=(
        index:number,
        previousHash:string,
        data:string,
        timestamp:number)
        : string => CryptoJS.SHA256(index + previousHash + timestamp + data).toString(); //calculaite hash method

    static validateStructure = (aBlock: Block): boolean =>
        typeof aBlock.index === "number" &&
        typeof aBlock.hash === "string" &&
        typeof aBlock.previousHash === "string" &&
        typeof aBlock.timestamp === "number" &&
        typeof aBlock.data === "string";
    constructor(
        index:number,
        hash:string,
        previousHash:string,
        data:string,
        timestamp:number
    ) {
        this.index=index;
        this.hash=hash;
        this.previousHash=previousHash;
        this.data=data;
        this.timestamp=timestamp;
    }
}

const genesisBlock:Block = new Block(0,"20200202","","Hello",123456);

let blockchain: Block[] = [genesisBlock];

const getBlockchain = () : Block[] => blockchain;

const getLatesBlock = (): Block => blockchain[blockchain.length-1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime()/1000);

const createNewBlock = (data:string): Block => {
    const previousBlock: Block = getLatesBlock();
    const newIndex: number = previousBlock.index + 1;
    const newTimestamp: number = getNewTimeStamp();
    const nextHash: string = Block.calculateBlockHash(
        newIndex,
        previousBlock.hash,
        data,
        newTimestamp
    );
    const newBlock: Block = new Block(
        newIndex,
        nextHash,
        previousBlock.hash,
        data,
        newTimestamp
    );
    addBlock(newBlock);
    return newBlock;
};

const getHashforBlock = (aBlock: Block): string => Block.calculateBlockHash(aBlock.index, aBlock.previousHash, aBlock.data, aBlock.timestamp);

const isBlockVaild = (
    candidateBlock: Block,
    previousBlock: Block
): boolean =>{
    if(!Block.validateStructure(candidateBlock)){
        return false;
    }else if(previousBlock.index + 1 === candidateBlock.index){
        return false;
    }else if(previousBlock.hash === candidateBlock.previousHash){
        return false;
    }else if(getHashforBlock(candidateBlock) !== candidateBlock.hash){
        return false;
    }else{
        return true;
    }
};

const addBlock = (candidateBlock: Block): void =>{
  if(isBlockVaild(candidateBlock, getLatesBlock())){
      blockchain.push(candidateBlock);
  }
};

createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");

console.log(blockchain);

export {};
//typescript의 법칙