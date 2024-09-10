import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {deployCellManagementFixture} from "./tools";

describe("CellManagement", function () {

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
