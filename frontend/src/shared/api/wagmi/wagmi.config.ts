import {http, createConfig} from 'wagmi';
import {sepolia, hardhat} from 'wagmi/chains';
import {getPublicClient} from "@wagmi/core";
import {mock} from "@wagmi/connectors";

export const connectors = [
    // mock({
    //     accounts: [
    //         '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
    //     ],
    //     features: {
    //         reconnect: true,
    //     },
    // })
];

export const config = createConfig({
    chains: [sepolia, hardhat],
    transports: {
        [sepolia.id]: http(),
        [hardhat.id]: http(),
    },
    connectors,
});

export const publicClient = getPublicClient(config);