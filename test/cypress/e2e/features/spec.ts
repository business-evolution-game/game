import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

let gameScene: any;  // Assuming your game scene logic is accessible globally

Given('the player is in the game scene', () => {
    // Ensure the game scene is loaded
    cy.visit('/'); // Load the game page


    cy.get('[data-cy="resource-loader-view"]').should('be.visible');
    cy.log("Loading resources");
    cy.get('[data-cy="resource-loader-view"]', {timeout:10000}).should('not.exist');
    cy.log("Finished loading resources");
    const canvas = cy.get('[data-cy="canvas-view"]').should('be.visible');

    for(let i=0; i<5; i++) {
        for (let j = 0; j < i+1; j++) {
            canvas.click("center");
        }
        cy.wait(5000);
    }

    // cy.window().then((win) => {
    //     gameScene = win.gameScene; // Access the gameScene object from the window
    // });
});

When('the player moves forward', () => {
    // Simulate moving the player forward
    // gameScene.movePlayerForward();l
});

Then('the move animation should start', () => {
    // Verify that the animation has started
    // cy.window().its('gameScene.player.isAnimating').should('be.true');
});

Then('the player position should update', () => {
    // Verify the player's position has changed
    // cy.window().its('gameScene.player.position').should('not.equal', { x: 0, y: 0 });
});