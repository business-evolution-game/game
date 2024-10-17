import { defineConfig } from 'cypress';
import synpressPlugins from '@synthetixio/synpress/plugins';

export default defineConfig({
    taskTimeout: 120000,
    defaultCommandTimeout: 120000,
    env: {
        metamask: {
            seed: 'your_metamask_seed_phrase',
            password: 'your_metamask_password',
            networkName: 'hardhat',
            rpcUrl: 'http://127.0.0.1:8545',
            chainId: 31337,
        },
    },
    e2e: {
        videoUploadOnPasses:false,
        videoCompression:false,
        testIsolation:true,
        specPattern: 'cypress/e2e/**/*.spec.ts',
        supportFile: 'cypress/support/index.ts',
        setupNodeEvents(on, config) {
            synpressPlugins(on, config)
            return config;
        },
        baseUrl: 'http://localhost:4563', // Adjust based on your DApp's port
        retries: {
            runMode: 2,
            openMode: 2,
        },
    },
});