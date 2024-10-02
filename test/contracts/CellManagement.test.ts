import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {newTwoPlayerGameFixture} from "./helpers/tools";
import {testPlayerPermissionForFunction} from "./helpers/permission";
import {expect} from "chai";
import GameBuilder from "./helpers/GameBuilder";
import Game from "./helpers/Game";
import {createPosition} from "../../src/tools";

describe("CellManagement", function () {

    describe("Deployment", function () {
        it("Should set the right owner  4", async function () {
            const {gameContract} = await loadFixture(newTwoPlayerGameFixture);
            const cells = (await Promise.all(new Array(60).fill(0).map((val, index) => gameContract.cells(index))))
                .map((v, i) => ({
                    type: v[1],
                    position: Number(v[0]) & 0b00111111,
                    branch: (Number(v[0]) & 0b11000000) >> 6,
                    price: v[2],
                    rent: v[3]
                }))
                .filter(v => v.branch == 1 && Number(v.type) == 1);

            console.log("Cells array:", cells);
            //TODO: implement the board structure check
        });
    });

    describe('buyBusiness', ()=>{
        testPlayerPermissionForFunction( new Error().stack, "buyBusiness");

        it("When player moved to not owned field he should be able to by it", async ()=>{
            const gh:Game = await new GameBuilder(2)
                .start(0)
                .takeTurn(2, 2)
                .createNewInstance();

            const position = createPosition(2,2);
            await expect(await gh.gameContract.buyBusiness()).to.emit(gh.gameContract, "BusinessPurchased")
                .withArgs(gh.actors[0].address, position);
            const cellInfo = await gh.gameContract.cells(await gh.gameContract.cellIndexes(position));
            await expect(cellInfo[5]).to.be.equal(gh.actors[0].address);
        });

    });
});
