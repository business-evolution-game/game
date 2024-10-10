import GameBuilder from "./GameBuilder";
import Game from "./Game";
import {ethers} from "ethers";
import {MainGame} from "../../typechain-types";
import {HardhatEthersSigner} from "@nomicfoundation/hardhat-ethers/signers";

export async function newTwoPlayerGameFixture():Promise<{gameContract: MainGame, actors:Array<HardhatEthersSigner>}> {
    const gh:Game =  await new GameBuilder(2)
        .start(0)
        .createNewInstance();
    return {gameContract:gh.gameContract, actors:gh.actors};
}

export async function notStartedGameFixture():Promise<{gameContract: MainGame, actors:Array<HardhatEthersSigner>}> {
    const gh:Game = await new GameBuilder(2)
        .createNewInstance();
    return {gameContract:gh.gameContract, actors:gh.actors};
}

export function createPosition(step: number, branch: number = 0): number {
    return (branch << 6) | step;
}

const matchType: Record<string, (value: any) => any> = {
    uint:BigInt,
    uint8:BigInt,
    uint16:BigInt,
    string:String,
    bool:Boolean,
};

export function getGenericValueAssertion<T>(firs:[string, T], ...args:[string, T][]) {
    args.unshift(firs);
    return (value:ethers.BytesLike)=>{
        const decodedData = (new ethers.AbiCoder()).decode(
            args.map((arg)=>arg[0]),
            value
        );

        if(args.length !== decodedData.length){
            console.error(`Expected decoded param length ${decodedData.length} to be equal to ${args.length}`);
            return false;
        }

        for(let i = 0; i < args.length; i++){
            const [solidityType, expected] = args[i];
            let key: keyof typeof matchType = solidityType as keyof typeof matchType;
            if(matchType[key](decodedData[i]) != matchType[key](expected)){
                console.error(`Expected ${value} to be equal to ${expected}`);
                return false;
            }
        }
        return true;
    }
}