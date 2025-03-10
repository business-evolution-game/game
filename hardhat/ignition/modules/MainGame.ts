import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export const MainGameModule = buildModule("BusinessEvolutionGame", (m) => {
    const game = m.contract("MainGame", [4]);
    return { game };
});