import hre from "hardhat";
import {MainGame, RollDiceMock} from "../typechain-types";
import {HardhatEthersSigner} from "@nomicfoundation/hardhat-ethers/signers";

export async function deployCellManagementFixture() {
    const [player1, player2, player3, player4, player5]:HardhatEthersSigner[] = await hre.ethers.getSigners();
    const RollDice = await hre.ethers.getContractFactory("RollDiceMock");
    const rollDice = (await RollDice.deploy(2)) as RollDiceMock;

    const MainGame = await hre.ethers.getContractFactory("MainGame");
    const game = await MainGame.deploy(rollDice, 2);
    return {game, player1, player2, player3, player4, player5}
}

export async function deployGameMechanicsWithRollDiceMockFixture() {
    const [player1, player2, player3, player4, player5] = await hre.ethers.getSigners();
    const RollDice = await hre.ethers.getContractFactory("RollDiceMock");
    const rollDice = (await RollDice.deploy(2)) as RollDiceMock;

    const MainGame = await hre.ethers.getContractFactory("MainGame");
    const game:MainGame = (await MainGame.deploy(rollDice, 2)) as MainGame;

    return {game, rollDice, player1, player2, player3, player4, player5}
}

export function createPosition(step:number, branch:number=1):number{
    return (branch<<6) | step;
}