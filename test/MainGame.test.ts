import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import hre, {ethers} from "hardhat";
import {describe} from "mocha";
import {MainGame} from "../typechain-types";
import {deployCellManagementFixture} from "./tools";

describe("MainGame", function () {
     const deployMainGameFixture = deployCellManagementFixture;
    describe("Deployment", function () {
        it("Should set the game status to REGISTRATION", async function () {
            const {game} = await loadFixture(deployMainGameFixture);
            expect(await game.status()).to.equal(0);
        });

    });

    describe('join', function () {
        it("Should be able to join to the game", async function () {
            const {game, player1, player2} = await loadFixture(deployMainGameFixture);
            const tx = await game.connect(player2).join();

            await expect(tx).to.emit(game, "GameStarted");
            await expect(tx).to.emit(game, "WaitingForPlayerAction").withArgs(player1.address)
            // await expect(tx).to.not.emit(game, "WaitingForPlayerAction").withArgs(player2.address);
            //TODO: ensure that the WaitingForPlayerAction event have peen emitted only for one player
            expect(await game.status()).to.equal(1);
        });

        it("Should be reverted when the game is started", async function () {
            const {game, player2, player5} = await loadFixture(deployMainGameFixture);
            await game.connect(player2).join();
            await expect(game.connect(player5).join()).to.be.revertedWith('The game is already started.');
        });
    });
});
