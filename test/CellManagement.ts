import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {anyValue} from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import {expect} from "chai";
import hre from "hardhat";

describe("CellManagement", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployCellManagementFixture() {
        const [player1, player2, player3, player4, player5] = await hre.ethers.getSigners();
        const MainGame = await hre.ethers.getContractFactory("MainGame");
        const game = await MainGame.deploy(2);
        return {game, player1, player2, player3, player4, player5}
    }

    describe("Deployment", function () {


        it("Should set the right owner  4", async function () {
            const {game} = await loadFixture(deployCellManagementFixture);
            const cells = (await Promise.all(new Array(60).fill(0).map((val, index) => game.cells(index))))
                .map((v, i) => ({
                    type: v[1],
                    position: Number(v[0]) & 0b00111111,
                    branch: (Number(v[0]) & 0b11000000) >> 6,
                    price: v[2],
                    rent: v[3]
                }))
                .filter(v => v.branch == 1 && v.type == 1);

            console.log("Cells array:", cells);
            //
            // // Loop through each element and print it
            // for (let i = 0; i < businessesKeysLength; i++) {
            //   const key = await game.businessesKeys(i);
            //   console.log(`businessesKey at index ${i}:`, Number(key).toString(2));
            // }
            // expect(await lock.owner()).to.equal(owner.address);
        });
    });
});
