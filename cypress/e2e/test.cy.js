import '@4tw/cypress-drag-drop'
const BASE_URL = "http://localhost:3000/"

describe("Cypress tests", () => {
    // lets login before each test
    beforeEach(() => {
        cy.viewport(1224, 1500);
        cy.visit(`${BASE_URL}`);
        cy.get("header > div:nth-of-type(3) a").click();
        cy.get("form > div:nth-of-type(1) input").click();
        cy.get("form > div:nth-of-type(1) input").type("HeNZPQZyofer8K63YovU1BsKl8fGqCkd@test.com");
        cy.get("div:nth-of-type(2) > div > div").click();
        cy.get("div:nth-of-type(2) input").type("HeNZPQZyofer8K63YovU1BsKl8fGqCkd");
        cy.get("button").click();
    })
    it("overlay open-close", () => {
        cy.get('#Биокотлета_из_марсианской_Магнолии').click();
        cy.get('#ingredient_details_container').should('be.visible')
        cy.get("#overlay").click({force: true});
        cy.get('#ingredient_details_container').should('not.exist')
    });
    it('dnd', () => {
        cy.get('#Биокотлета_из_марсианской_Магнолии')
            .trigger("dragstart");
        cy.get("#drop_area").trigger("drop");
    })
    it('confirm an order', () => {
        const elements = [
            '#Биокотлета_из_марсианской_Магнолии',
            '#Филе_Люминесцентного_тетраодонтимформа',
            '#Кристаллы_марсианских_альфа-сахаридов',
            '#Соус_Spicy-X'
        ]
        for (const element of elements) {
            cy.get(element).trigger("dragstart");
            cy.get("#drop_area").trigger("drop");
        }
        cy.get('#submit_an_order_button').click()
        cy.wait(20000)
        cy.contains('Ваш заказ начали готовить').should('be.visible')
    })

})
