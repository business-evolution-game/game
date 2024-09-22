import hre from "hardhat";
import Game from "./Game";
import {MainGame, RollDiceMock} from "../../typechain-types";


export default class GameBuilder {

    private readonly actions:Array<(game:Game)=>Promise<void>>;

    private readonly playerCount:number;

    private constructor(playerCount:number = 2) {
        this.playerCount=playerCount;
        this.actions=[];
    }

    public start(currentPlayerIndex:number):GameBuilder{
        for(let i=1; i<this.playerCount; i++){
            this.joinPlayers(i);
        }
        this.switchPlayer(currentPlayerIndex);
        return this;
    }

    public joinPlayers(...actorIndexes:number[]):GameBuilder {
        for(let i of actorIndexes) {
            this.actions.push(async (game) => {
                await game.joinPlayer(i);
            });
        }
        return this;
    }

    public switchPlayer(actorIndex:number):GameBuilder {
        this.actions.push(async (game)=>{
            await game.switchPlayer(actorIndex);
        });
        return this;
    }

    public takeTurn(stepOn:number, branch:number=0) {
        this.actions.push(async (game)=>{
            await game.takeTurn(stepOn, branch);
        });
        return this;
    }

    public buyBusiness(){
        this.actions.push(async (game)=>{
            await game.buyBusiness();
        });
        return this;
    }

    public nextPlayer(){
        this.actions.push(async (game)=>{
            await game.nextPlayer();
        });
        return this;
    }

    public async createNewInstance():Promise<Game>{
        const actors = await hre.ethers.getSigners();
        const RollDice = await hre.ethers.getContractFactory("RollDiceMock");
        const rollDice = (await RollDice.deploy(2)) as RollDiceMock;

        const MainGame = await hre.ethers.getContractFactory("MainGame");
        let game:MainGame = (await MainGame.deploy(rollDice, this.playerCount)) as MainGame;

        let currentStage = new Game(game, rollDice, actors);
        for(const action of this.actions) {
            await action(currentStage);
        }

        return currentStage;
    }
}