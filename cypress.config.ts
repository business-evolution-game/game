import {defineConfig} from 'cypress';
import {devServer} from "@cypress/vite-dev-server";
import react from "@vitejs/plugin-react";
import {viteCommonjs} from "@originjs/vite-plugin-commonjs";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import {addCucumberPreprocessorPlugin} from "@badeball/cypress-cucumber-preprocessor";
import {createEsbuildPlugin} from "@badeball/cypress-cucumber-preprocessor/esbuild";
import {createRollupPlugin} from "@badeball/cypress-cucumber-preprocessor/rollup";
// @ts-expect-error
import synpressPlugins from '@synthetixio/synpress/plugins';

async function setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions,): Promise<Cypress.PluginConfigOptions> {
    // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
    await addCucumberPreprocessorPlugin(on, config);

    on("file:preprocessor", createBundler({
        plugins: [createEsbuildPlugin(config)],
    }),);
    synpressPlugins(on, config);

    // Make sure to return the config object as it might have been modified by the plugin.
    return config;
}

export default defineConfig({
    projectId: '57vedr', e2e: {
        video: true, // Enable video recording
        videoCompression: false,
        setupNodeEvents,
        specPattern: 'test/cypress/e2e/**/*.feature',
        supportFile: 'test/cypress/support/e2e.ts',
        baseUrl: 'http://localhost:4563'
    }, component: {
        specPattern: "test/cypress/module/**/*.test.tsx", devServer(devServerConfig) {
            return devServer({
                ...devServerConfig, framework: "react", viteConfig: {
                    plugins: [react(), createRollupPlugin(devServerConfig.cypressConfig), viteCommonjs(),],
                },
            });
        },
    },
});