import { defineConfig } from 'cypress';
import { devServer } from "@cypress/vite-dev-server";
import react from "@vitejs/plugin-react";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import { createRollupPlugin } from "@badeball/cypress-cucumber-preprocessor/rollup";


async function setupNodeEvents(
    on: Cypress.PluginEvents,
    config: Cypress.PluginConfigOptions,
): Promise<Cypress.PluginConfigOptions> {
    // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
    await addCucumberPreprocessorPlugin(on, config);

    on(
        "file:preprocessor",
        createBundler({
            plugins: [createEsbuildPlugin(config)],
        }),
    );

    // Make sure to return the config object as it might have been modified by the plugin.
    return config;
}

export default defineConfig({
    e2e: {
        // video: true, // Enable video recording
        // videoCompression: 32,
        setupNodeEvents,
        specPattern: 'test/cypress/e2e/**/*.feature',
        supportFile: 'test/cypress/support/e2e.ts',
        baseUrl: 'http://localhost:4563'
    },
    component: {
        specPattern: "**/*.feature",
        devServer(devServerConfig) {
            return devServer({
                ...devServerConfig,
                framework: "react",
                viteConfig: {
                    plugins: [
                        react(),
                        createRollupPlugin(devServerConfig.cypressConfig),
                        viteCommonjs(),
                    ],
                },
            });
        },
        async setupNodeEvents(on, config) {
            // This is required for the preprocessor to be able to generate JSON reports after each run, and more.
            await addCucumberPreprocessorPlugin(on, config);

            // Make sure to return the config object as it might have been modified by the plugin.
            return config;
        },
    },
});