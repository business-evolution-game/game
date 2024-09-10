import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import chai, {expect, Assertion} from "chai";
import {createPosition, deployGameMechanicsWithRollDiceMockFixture} from "./tools";
import hre from "hardhat";
import {anyValue} from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import {ParamType} from "ethers/lib.commonjs/abi/fragments";
import assert from "assert";

describe("GameMechanics", function () {

    describe("takeTurn", function () {

        it("Should be reverted until game wasn't start", async function () {
            const {game, player2} = await loadFixture(deployGameMechanicsWithRollDiceMockFixture);
            await expect(game.takeTurn()).to.be.revertedWith("Game has not started yet.");
            await game.connect(player2).join();
            await expect(game.takeTurn()).to.not.be.revertedWith("Game has not started yet.");
        });

        it("Should be reverted for unregistered player", async function () {
            let {game, player2, player5} = await loadFixture(deployGameMechanicsWithRollDiceMockFixture);
            await game.connect(player2).join();
            game = await game.connect(player5);
            await expect(game.takeTurn()).to.be.revertedWith("Only a registered player can execute this function.");
        });

        it("Should be reverted for not current player", async function () {
            let {game, player1, player2} = await loadFixture(deployGameMechanicsWithRollDiceMockFixture);
            game = await game.connect(player2);
            await game.join();

            await expect(game.takeTurn()).to.be.revertedWithCustomError(game, "WaitingForAnotherPlayerActionError")
                .withArgs(player1.address, player2.address);
        });

        it("Should not be reverted for current player", async function () {
            let {game, player2} = await loadFixture(deployGameMechanicsWithRollDiceMockFixture);
            await game.connect(player2).join();

            await expect(game.takeTurn()).to.not.be.revertedWithCustomError(game, "WaitingForAnotherPlayerActionError");
        });

        it("Should have playerActionStatus equals to  CHOOSING_BRANCH", async function () {
            let {game, player2} = await loadFixture(deployGameMechanicsWithRollDiceMockFixture);
            await game.connect(player2).join();
            await expect(await game.currentPlayerAction()).to.be.equal(0);
            await expect(game.takeTurn()).to.not.be.revertedWithCustomError(game, "WaitingForAnotherPlayerActionError");
        });


        it("Should emit event ChoosingBranch and change playerActionStatus to CHOOSING_BRANCH", async function () {
            let {game, player1, player2} = await loadFixture(deployGameMechanicsWithRollDiceMockFixture);
            await game.connect(player2).join();
            await expect(await game.takeTurn()).to.emit(game, "ChangedPlayerStatus")
                .withArgs(player1.address, 'CHOOSING_BRANCH')
                .and.withGenericArgs("ChangedPlayerStatus", 2, ['uint8', 'uint8'], [2,3]);
            await expect(await game.currentPlayerAction()).to.be.equal(2);
        });

        describe('When player moved to not payable cell', async ()=>{
            const moveTo5Fixture = async function() {
                let {game, rollDice, player1, player2} = await loadFixture(deployGameMechanicsWithRollDiceMockFixture);
                await rollDice.setNextDiceValue(5);

                await game.connect(player2).join();
                await expect(await game.currentPlayerAction()).to.be.equal(0);
                const newPosition = createPosition(5);
                return {game, rollDice, player1, player2, newPosition};
            }

            it("Should emit event PlayerMoved and change the position", async function () {
                let {game, player1, newPosition} = await loadFixture(moveTo5Fixture);
                await expect(game.takeTurn()).to.emit(game, "PlayerMoved").withArgs(player1.address, newPosition);
                await expect((await game.players(player1.address))[2]).to.be.equal(newPosition)
            });

            it("Should change playerActionStatus to ANY_USER_ACTION", async function () {
                let {game} = await loadFixture(moveTo5Fixture);
                await game.takeTurn();
                await expect(await game.currentPlayerAction()).to.be.equal(1);
            });

            it("Should emit ChangedPlayerStatus with ANY_USER_ACTION status", async function(){
                let {game, player1, newPosition} = await loadFixture(moveTo5Fixture);
                await expect(await game.currentPlayerAction()).to.be.equal(0);

                await expect(await game.takeTurn())
                    .and.to.emit(game, "ChangedPlayerStatus").withArgs(player1.address, 'ANY_USER_ACTION', anyValue);
            });
        })
    });
});
