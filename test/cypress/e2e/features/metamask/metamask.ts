import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
Given(/^player loaded the home page$/, function () {

    cy.visit('/'); // Load the game page

    cy.switchToMetamaskWindow();
    cy.acceptMetamaskAccess().should("be.true");
    cy.switchToCypressWindow();
    cy.confirmMetamaskSignatureRequest();
    //
    // cy.get('[data-cy="resource-loader-view"]').should('be.visible');
    // cy.log("Loading resources");
    // cy.get('[data-cy="resource-loader-view"]', {timeout:10000}).should('not.exist');
    // cy.log("Finished loading resources");
    // const canvas = cy.get('[data-cy="canvas-view"]').should('be.visible');
});
Given(/^player didnt connect to the wallet$/, function () {

});
Then(/^player should see connect button$/, function () {

});