import {MainGame, RollDiceMock} from "../../typechain-types";
import {HardhatEthersSigner} from "@nomicfoundation/hardhat-ethers/signers";

export default class Game{

    constructor(
        public gameContract:MainGame,
        public readonly rollDiceContract:RollDiceMock,
        public readonly actors:Array<HardhatEthersSigner>) {
    }

    public async joinPlayer(actorIndex:number){
        this.gameContract = await this.gameContract.connect(this.actors[actorIndex]);
        await this.gameContract.join();
    }

    public async switchPlayer(actorIndex:number){
        this.gameContract = await this.gameContract.connect(this.actors[actorIndex]);
    }

    public async takeTurn(stepOn:number, branch:number=0) {
        await this.rollDiceContract.setNextDiceValue(stepOn as any);
        await this.gameContract.takeTurn();
        if(branch){
            await this.gameContract.chooseBranch(branch as any);
        }
    }

    public async buyBusiness(){
        await this.gameContract.buyBusiness();
    }

    public async nextPlayer() {
        await this.gameContract.nextPlayer();
    }
}