import GameBuilder from "./GameBuilder";
import Game from "./Game";

export async function newTwoPlayerGameFixture() {
    const gh:Game =  await new GameBuilder(2)
        .start(0)
        .createNewInstance();
    return {gameContract:gh.gameContract, actors:gh.actors};
}

export async function notStartedGameFixture() {
    const gh:Game = await new GameBuilder(2)
        .createNewInstance();
    return {gameContract:gh.gameContract, actors:gh.actors};
}

export function createPosition(step:number, branch:number=0):number{
    return (branch<<6) | step;
}