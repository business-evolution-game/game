import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export const BusinessEvolutionGameModule = buildModule("BusinessEvolutionGame", (m) => {
    const game = m.contract("MainGame",[4]);

    return { game };
});
