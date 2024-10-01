import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {newTwoPlayerGameFixture, notStartedGameFixture} from "./tools";
import {expect} from "chai";

export function testPlayerPermissionForFunction(stack:string|undefined, functionName:string, ...args) {
    describe(`Check permission for function: ${functionName}`,async  ()=>{
        afterEach(function () {
            if (this.currentTest?.state === 'failed') {
                console.error([`Permission test was failed`, ...stack?.split('\n').slice(1, 5)].join('\n'));
            }
        });


        it(`Should revert the call for not started game`, async function () {
            let {gameContract} = await loadFixture(notStartedGameFixture);
            await expect(gameContract[functionName](...args)).to.be
                .revertedWith("Game has not started yet.");
        });

        it(`Should revert the call for not player user call`, async function () {
            let {gameContract, actors} = await loadFixture(newTwoPlayerGameFixture);
            gameContract = await gameContract.connect(actors[5]);
            await expect(gameContract[functionName](...args)).to.be
                .revertedWith("Only a registered player can execute this function.");
        });

        it(`Should revert the call for not current player for function: ${functionName}`, async function () {
            let {gameContract, actors} = await loadFixture(newTwoPlayerGameFixture);
            gameContract = await gameContract.connect(actors[1]);

            await expect(gameContract[functionName](...args)).to.be
                .revertedWithCustomError(gameContract, "WaitingForAnotherPlayerActionError")
                .withArgs(actors[0].address, actors[1].address);
        });
    });
}