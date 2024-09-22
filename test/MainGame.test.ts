import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import {describe} from "mocha";
import {MainGame} from "../typechain-types";
import {newTwoPlayerGameFixture, notStartedGameFixture} from "./helpers/tools";

describe("MainGame", function () {
    describe("Deployment", function () {
        it("Should set the game status to REGISTRATION", async function () {
            const {gameContract} = await loadFixture(notStartedGameFixture);
            expect(await gameContract.status()).to.equal(0);
        });

    });

    describe('join', function () {
        it("Should be able to join to the game", async function () {
            let {gameContract, actors} = await loadFixture(notStartedGameFixture);
            const tx = await gameContract.connect(actors[1]).join();

            await expect(tx).to.emit(gameContract, "GameStarted");
            await expect(tx).to.emit(gameContract, "WaitingForPlayerAction").withArgs(actors[0].address)
            // await expect(tx).to.not.emit(game, "WaitingForPlayerAction").withArgs(player2.address);
            //TODO: ensure that the WaitingForPlayerAction event have peen emitted only for one player
            expect(await gameContract.status()).to.equal(1);
        });

        it("Should be reverted when the game is started", async function () {
            const {gameContract, actors} = await loadFixture(newTwoPlayerGameFixture);
            await expect(gameContract.connect(actors[5]).join()).to.be.revertedWith('The game is already started.');
        });

        it("Should be reverted for twice joining call for the same address", async function () {
            let {gameContract, actors} = await loadFixture(notStartedGameFixture);
            await expect(gameContract.connect(actors[0]).join()).to.be.revertedWith('You are already joined');
        });
    });
});
