const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const BusinessEvolutionGameModule = buildModule("BusinessEvolutionGame", (m) => {
    const game = m.contract("MainGame",[4]);

    return { game };
});

module.exports = BusinessEvolutionGameModule;