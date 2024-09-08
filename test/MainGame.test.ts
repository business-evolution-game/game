import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import hre from "hardhat";
import {describe} from "mocha";
import {MainGame} from "../typechain-types";

describe("MainGame", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployMainGameFixture(countPlayer=2) {
        const [player1, player2, player3, player4, player5] = await hre.ethers.getSigners();
        const MainGame = await hre.ethers.getContractFactory("MainGame");
        const game:MainGame = (await MainGame.deploy(countPlayer)) as MainGame;
        return {game, player1, player2, player3, player4, player5}
    }

    describe("Deployment", function () {
        it("Should set the game status to REGISTRATION", async function () {
            const {game} = await loadFixture(deployMainGameFixture);
            expect(await game.status()).to.equal(0);
        });


        // it("Should set the right owner  4", async function () {
        //     const {game} = await loadFixture(deployMainGameFixture);
        //     const cells = (await Promise.all(new Array(60).fill(0).map((val, index) => game.cells(index))))
        //         .map((v, i) => ({
        //             type: v[1],
        //             position: Number(v[0]) & 0b00111111,
        //             branch: (Number(v[0]) & 0b11000000) >> 6,
        //             price: v[2],
        //             rent: v[3]
        //         }))
        //         .filter(v => v.branch == 1 && v.type == 1);
        //
        //     console.log("Cells array:", cells);
        //     //
        //     // // Loop through each element and print it
        //     // for (let i = 0; i < businessesKeysLength; i++) {
        //     //   const key = await game.businessesKeys(i);
        //     //   console.log(`businessesKey at index ${i}:`, Number(key).toString(2));
        //     // }
        //     // expect(await lock.owner()).to.equal(owner.address);
        // });


        //   it("Should receive and store the funds to lock", async function () {
        //     const { game } = await loadFixture(
        //       deployOneYearLockFixture
        //     );
        //
        //     expect(await hre.ethers.provider.getBalance(lock.target)).to.equal(
        //       lockedAmount
        //     );
        //   });
        //
        //   it("Should fail if the unlockTime is not in the future", async function () {
        //     // We don't use the fixture here because we want a different deployment
        //     const latestTime = await time.latest();
        //     const Lock = await hre.ethers.getContractFactory("Lock");
        //     await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
        //       "Unlock time should be in the future"
        //     );
        //   });
        // });
        //
        // describe("Withdrawals", function () {
        //   describe("Validations", function () {
        //     it("Should revert with the right error if called too soon", async function () {
        //       const { lock } = await loadFixture(deployOneYearLockFixture);
        //
        //       await expect(lock.withdraw()).to.be.revertedWith(
        //         "You can't withdraw yet"
        //       );
        //     });
        //
        //     it("Should revert with the right error if called from another account", async function () {
        //       const { lock, unlockTime, otherAccount } = await loadFixture(
        //         deployOneYearLockFixture
        //       );
        //
        //       // We can increase the time in Hardhat Network
        //       await time.increaseTo(unlockTime);
        //
        //       // We use lock.connect() to send a transaction from another account
        //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
        //         "You aren't the owner"
        //       );
        //     });
        //
        //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
        //       const { lock, unlockTime } = await loadFixture(
        //         deployOneYearLockFixture
        //       );
        //
        //       // Transactions are sent using the first signer by default
        //       await time.increaseTo(unlockTime);
        //
        //       await expect(lock.withdraw()).not.to.be.reverted;
        //     });
        //   });
        //
        //   describe("Events", function () {
        //     it("Should emit an event on withdrawals", async function () {
        //       const { lock, unlockTime, lockedAmount } = await loadFixture(
        //         deployOneYearLockFixture
        //       );
        //
        //       await time.increaseTo(unlockTime);
        //
        //       await expect(lock.withdraw())
        //         .to.emit(lock, "Withdrawal")
        //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
        //     });
        //   });
        //
        //   describe("Transfers", function () {
        //     it("Should transfer the funds to the owner", async function () {
        //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
        //         deployOneYearLockFixture
        //       );
        //
        //       await time.increaseTo(unlockTime);
        //
        //       await expect(lock.withdraw()).to.changeEtherBalances(
        //         [owner, lock],
        //         [lockedAmount, -lockedAmount]
        //       );
        //     });
        //   });
    });

    describe('join', function () {
        it("Should be able to join to the game", async function () {
            const {game, player1, player2} = await loadFixture(deployMainGameFixture);
            await game.connect(player2).join();
            expect(await game.playerAddresses(0)).to.equal(player1.address);
            expect(await game.playerAddresses(1)).to.equal(player2.address);
            expect(await game.status()).to.equal(1);
        });
    });
});
