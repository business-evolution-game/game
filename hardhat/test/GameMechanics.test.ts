import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import {getGenericValueAssertion, newTwoPlayerGameFixture} from "./helpers/tools";
import {anyValue} from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import {testPlayerPermissionForFunction} from "./helpers/permission";
import GameBuilder from "./helpers/GameBuilder";
import Game from "./helpers/Game";
import {createPosition} from "@business-evolution/core/tools";


describe("GameMechanics", async function () {
    const moveTo5Fixture = async function() {
        const gh:Game = await new GameBuilder(2)
            .start(0)
            .createNewInstance();
        await gh.rollDiceContract.setNextDiceValue(5);
        const newPosition = createPosition(5);
        return {gh, newPosition};
    }



    describe("takeTurn", async function () {
        testPlayerPermissionForFunction( new Error().stack, "takeTurn");

        it("Should not be reverted for current player", async function () {
            let {gameContract} = await loadFixture(newTwoPlayerGameFixture);
            await expect(gameContract.takeTurn()).to.not.be.revertedWithCustomError(gameContract, "WaitingForAnotherPlayerActionError");
        });

        it("Should have playerActionStatus equals to  CHOOSING_BRANCH", async function () {
            let {gameContract} = await loadFixture(newTwoPlayerGameFixture);
            await expect(await gameContract.currentPlayerAction()).to.be.equal(0);
            await expect(gameContract.takeTurn()).to.not.be.revertedWithCustomError(gameContract, "WaitingForAnotherPlayerActionError");
        });


        it("Should emit event ChangedPlayerStatus(CHOOSING_BRANCH)", async function () {
            let {gameContract, actors} = await loadFixture(newTwoPlayerGameFixture);
            await expect(await gameContract.takeTurn()).to.emit(gameContract, "ChangedPlayerStatus")
                .withArgs(actors[0].address, 'CHOOSING_BRANCH', getGenericValueAssertion(['uint8', BigInt(2)],['uint8', BigInt(3)]));
            await expect(await gameContract.currentPlayerAction()).to.be.equal(2);
        });

        describe('When player moved to not payable cell', async ()=>{

            it("Should emit event PlayerMoved and change the position", async function () {
                let {gh, newPosition} = await loadFixture(moveTo5Fixture);
                await expect(gh.gameContract.takeTurn())
                    .to.emit(gh.gameContract, "PlayerMoved")
                    .withArgs(gh.actors[0].address, newPosition);
                await expect((await gh.gameContract.players(gh.actors[0].address as any))[2]).to.be.equal(newPosition)
            });

            it("Should change playerActionStatus to ANY_USER_ACTION", async function () {
                let {gh} = await loadFixture(moveTo5Fixture);
                await gh.gameContract.takeTurn();
                await expect(await gh.gameContract.currentPlayerAction()).to.be.equal(1);
            });

            it("Should emit ChangedPlayerStatus with ANY_USER_ACTION status", async function(){
                let {gh} = await loadFixture(moveTo5Fixture);
                await expect(await gh.gameContract.currentPlayerAction()).to.be.equal(0);

                await expect(await gh.gameContract.takeTurn())
                    .and.to.emit(gh.gameContract, "ChangedPlayerStatus").withArgs(gh.actors[0].address, 'ANY_USER_ACTION', anyValue);
            });
        });
    });

    describe('chooseBranch',  async ()=>{
        testPlayerPermissionForFunction( new Error().stack, "chooseBranch", 2);

        it("Should revert the call for not on the choosing branch state", async function () {
            let {gameContract} = await loadFixture(newTwoPlayerGameFixture);
            await expect(gameContract.chooseBranch(3)).to.be
                .revertedWith("You are not on the choosing branch state");
        });

        it("Should not revert the call for the choosing branch state", async function () {
            let {gameContract} = await loadFixture(newTwoPlayerGameFixture);
            await gameContract.takeTurn();
            await expect(gameContract.chooseBranch(3)).to.be.not
                .revertedWith("You are not on the choosing branch state");
        });

        it("Should not revert the call for the choosing branch state", async function () {
            let {gameContract} = await loadFixture(newTwoPlayerGameFixture);
            await gameContract.takeTurn();
            await expect(gameContract.chooseBranch(5)).to.be
                .revertedWith("You truing move to branch that out of the available branches");
        });

        it("When user moved to payable cell Should emit Should emit event ChangedPlayerStatus(WAITING_PAYMENT)", async function () {
            const gameHelper:Game = await new GameBuilder(2)
                .start(0)
                .takeTurn(2, 2)
                .buyBusiness()
                .nextPlayer()
                .createNewInstance();

            await gameHelper.switchPlayer(1);

            await gameHelper.gameContract.takeTurn();
            await expect(await gameHelper.gameContract.chooseBranch(2)).to.emit(gameHelper.gameContract, "ChangedPlayerStatus")
                .withArgs(gameHelper.actors[1].address, 'WAITING_PAYMENT', getGenericValueAssertion(['uint', BigInt(500)]));

            await expect(await gameHelper.gameContract.currentPlayerAction()).to.be.equal(3);
        });

        it("When user moved the player position should be changed", async function () {
            let {gameContract, actors} = await loadFixture(newTwoPlayerGameFixture);
            await gameContract.takeTurn();
            await gameContract.chooseBranch(2);
            await expect((await gameContract.players(actors[0].address))[2]).to.be.equal(createPosition(2, 2));
        });
    })

    describe("When player moved to not owned Business cell", async ()=>{
        describe('on the multiple branch position',  async ()=>{

            it("The player status should be changed to AUCTION ", async function () {
                let {gameContract, actors} = await loadFixture(newTwoPlayerGameFixture);

                const newPosition = createPosition(2, 2);
                await gameContract.takeTurn();

                await expect(await gameContract.chooseBranch(2)).to.emit(gameContract, "ChangedPlayerStatus")
                    .withArgs(actors[0].address, 'AUCTION', getGenericValueAssertion(['uint8', BigInt(newPosition)]));
                await expect(await gameContract.currentPlayerAction()).to.be.equal(4);
            });

        })
    });

    describe('makePayment',  async ()=>{

        testPlayerPermissionForFunction( new Error().stack, "makePayment");

        it("Should revert the call for not on the waiting for payment state", async function () {
            let {gameContract} = await loadFixture(newTwoPlayerGameFixture);
            await expect(gameContract.makePayment()).to.be
                .revertedWith("You are not on the waiting for payment state");
        });

        it.skip("Should revert the call for low balance", async function () {
            let {gameContract} = await loadFixture(newTwoPlayerGameFixture);
            //TODO: write the test
            await expect(gameContract.makePayment()).to.be
                .revertedWith("Your balance is too low.");
        });

        it.skip("Should revert the call for low balance", async function () {
            let {gameContract} = await loadFixture(newTwoPlayerGameFixture);
            await gameContract.takeTurn();
            await gameContract.chooseBranch(2);
            //TODO:change the test
            await expect(gameContract.makePayment()).to.be
                .revertedWith("Your balance is too low.");
        });



    });

    describe('nextPlayer',  async ()=> {
        testPlayerPermissionForFunction(new Error().stack, "nextPlayer");

        it.skip("Should revert the call for not finishing player step status", async function () {
            let {gameContract} = await loadFixture(newTwoPlayerGameFixture);
            //TODO: write the test
        });

        it("Should change the player to next one", async function () {
            let {gameContract, actors} = await loadFixture(newTwoPlayerGameFixture);
            await gameContract.takeTurn();
            await gameContract.chooseBranch(2);
            await gameContract.buyBusiness();
            await expect(gameContract.nextPlayer()).to.emit(gameContract, "WaitingForPlayerAction").withArgs(actors[1].address)
        });
    });
});
