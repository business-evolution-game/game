import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
    solidity: "0.8.24",

    paths: {
        sources: 'src/contracts', tests: 'test/contracts',
    }, networks: {
        localhost: {
            url: "http://127.0.0.1:8545",
        },
    },

};

export default config;

