describe('DApp Testing with Synpress', () => {
    it('should load the DApp and connect MetaMask', () => {
        // Visit your DApp
        cy.visit('/');
        cy.get('[data-cy="connect-btn"]').click()

        // Accept MetaMask access with increased timeout
        cy.acceptMetamaskAccess({ timeout: 20000 }).then(() => {
            cy.log('Accepted MetaMask access');
        });

    });
});