// @ts-ignore
import { ethers } from "hardhat";

async function main() {
    const shouldWait = process.env.SHOULD_WAIT;
    // Deploy the RollDice contract
    const RollDice = await ethers.getContractFactory("RollDice");
    const rollDice = await RollDice.deploy();
    const rollDicAddress = await rollDice.getAddress();

    console.log("RollDice contract deployed at:", rollDicAddress);

    // Now, deploy the MainGame contract, passing the RollDice address to its constructor
    const MainGame = await ethers.getContractFactory("MainGame");
    const mainGame = await MainGame.deploy(rollDicAddress, 4);  // Passing RollDice address

    const mainGameAddress = await mainGame.getAddress();
    console.log("MainGame contract deployed at:", mainGameAddress);


    if(shouldWait){
        console.log("It will be 5 hour live, than please restart");
        await new Promise((res) => {setTimeout(()=>{res("It's 5 our live, please restart")}, 1000*60*60*5)});
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });