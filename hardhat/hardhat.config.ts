import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition";
import 'solidity-coverage';

const config: HardhatUserConfig = {
    solidity: "0.8.24",

    paths: {
        sources: 'src',
        tests:'test'
    },
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337,
            loggingEnabled: true,
        },
    },
    mocha: {
        require: ['ts-node/register', 'tsconfig-paths/register'],
    },
};

export default config;

