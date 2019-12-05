/* eslint-disable no-undef */
describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");

    cy.visit("/");

    cy.contains("Monday");
  });

  it("should book an interview", () => {
    cy.get("[alt=Add]")
      .first()
      .click();

    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");
    cy.get('[alt="Sylvia Palmer"]').click();

    cy.contains("Save").click();

    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });
  it("Should edit an interview", () => {
    //Clicks the edit button for the existing appointment
    cy.get("[alt=Edit]")
      .first()
      .click({ force: true });
    //Changes the name and interviewer
    cy.get('[data-testid=student-name-input]')
      .clear()
      .type("Bahareh")
      .get('[alt="Tori Malcolm"]')
      .click();
    //Clicks the save button
    cy.contains("Save").click();
    //Sees the edit to the appointment
    cy.contains(".appointment__card--show", "Bahareh");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  })
  it('Should cancel an interview', () => {
    //Clicks the delete button for the existing appointment
    cy.get("[alt=Delete]")
      .first()
      .click({ force: true });
    //Clicks the confirm button
    cy.contains('Confirm')
      .click();
    //Sees that the appointment slot is empty
    cy.contains("Deleting").should("exist");
    cy.contains("Deleting").should("not.exist");

    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist");
  })
});