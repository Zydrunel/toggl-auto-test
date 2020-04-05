// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', function(username, password) {
    cy.visit('/login');
    cy.get('[name="email-address"]').type(username);
    cy.get('[name="password"]').type(password, { force: true });
    cy.get('#login-button').click({ force: true });
    cy.url().should('include', '/app/timer');
});

Cypress.Commands.add('cleanupTags', tags => {
    cy.visit('/app/tags');
    tags.forEach(tag => {
        cy.contains(tag).click({ force: true });
        cy.get('#tag-popdown')
            .contains('Delete')
            .click();
        cy.contains('button', 'Delete tag').click();
    });
});
