import {http, createConfig} from 'wagmi';
import {sepolia} from 'wagmi/chains';
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
    chains: [sepolia],
    transports: {
        [sepolia.id]: http(),
    },
    connectors,
});