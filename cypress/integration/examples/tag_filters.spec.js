const selectors = {
    timeEntryInput: '[data-placeholder="What are you working on?"]',
    timeEntryTagButton: '.TimerFormTags__container',
    timeEntryTagDropDown: '.TagsPopdown__content',
    timeEntryTagFilter: '.TagsPopdown__filter',
    timeEntryTagDropDownItem: '.TagsPopdown__item',
    timerButton: '[data-dom-element-id="timer-button"]',
    pageContent: '.content-wrapper',
    closePopup: '.CloseIcon__close',
    filtersBar: '.ReportsFilter__root',
    tagFilterDropDown: '.ReactVirtualized__Grid__innerScrollContainer',
    getTagByTitle: tagTitle => `[title=${tagTitle}]`,
    noOfTimeEntries: '[title="Expand row"]',
    reportTableRows: '.DetailedReportContent__table > tbody > tr',
    tagSearchInput: '[placeholder="Find tag..."]'
};

function createTimeEventWithTags(title, tags, duration) {
    cy.get(selectors.timeEntryInput).type(title);

    cy.get(selectors.timeEntryTagButton).click();
    cy.get(selectors.timeEntryTagDropDown).within(function() {
        tags.forEach(tag => {
            cy.get(selectors.timeEntryTagFilter).type(`${tag} {ctrl}{enter}`);
            cy.get(selectors.timeEntryTagDropDownItem).contains(tag);
        });
    });

    cy.get(selectors.timerButton)
        .click({ force: true })
        .wait(duration)
        .click();
}

describe('Time Entry Tags', () => {
    before(function() {
        cy.clearLocalStorage();
        cy.clearCookies();

        cy.fixture('loginCredentials').then(
            ({ testUser1: { username, password } }) => {
                cy.login(username, password);
                cy.get(selectors.closePopup).click();
            }
        );
    });

    beforeEach(function() {
        cy.fixture('tags').as('tags');
    });

    it('Should log new activity with new custom tag', function() {
        createTimeEventWithTags('Home Assigment Task', [this.tags[0]], 2000);

        cy.get(selectors.pageContent).contains(this.tags[0]);
    });

    it('Should log new activity with two new custom tags', function() {
        createTimeEventWithTags(
            'Custom Assignment',
            [this.tags[2], this.tags[3]],
            5000
        );

        cy.get(selectors.pageContent).contains(
            `${this.tags[2]}, ${this.tags[3]}`
        );
    });

    it('Should log new activity with new and existing custom tag', function() {
        createTimeEventWithTags(
            'Home and Work Assigment Task',
            [this.tags[0], this.tags[1]],
            4000
        );

        cy.get(selectors.pageContent).contains(
            `${this.tags[0]}, ${this.tags[1]}`
        );
    });

    it('Should filter Time events report by selected tags', function() {
        cy.visit('/app/reports/summary/');
        cy.get(selectors.filtersBar)
            .contains('Tag')
            .click();

        cy.get(selectors.tagSearchInput).type(`${this.tags[0]} {ctrl}{enter}`);

        cy.get(selectors.getTagByTitle(this.tags[0]))
            .parent()
            .parent()
            .should('have.css', 'color', 'rgb(75, 200, 0)');

        cy.get(selectors.tagFilterDropDown).type(' {enter}');

        cy.get(selectors.noOfTimeEntries).should('have.text', '2');

        cy.get(selectors.pageContent)
            .contains('Without project')
            .click()
            .url()
            .should('contain', '/app/reports/detailed/');
        cy.get(selectors.reportTableRows)
            .should('have.length', 2)
            .and('contain', 'Home Assigment Task')
            .and('contain', 'Home and Work Assigment Task')
            .and('not.contain', 'Custom Assignment');

        cy.get(selectors.filtersBar)
            .contains('Tag')
            .click();

        cy.get(selectors.tagSearchInput).type(`${this.tags[2]} {ctrl}{enter}`);

        cy.get(selectors.tagFilterDropDown).type(' {enter}');

        cy.get(selectors.reportTableRows)
            .should('have.length', 3)
            .and('contain', 'Home Assigment Task')
            .and('contain', 'Home and Work Assigment Task')
            .and('contain', 'Custom Assignment');
    });

    it('Clean up newly created tags during session', function() {
        cy.cleanupTags(this.tags);
    });
});

//cy.get('.left-nav>.nav').children().should('have.length', 8)
//zydrune.test+0402@gmail.com
//Password1
