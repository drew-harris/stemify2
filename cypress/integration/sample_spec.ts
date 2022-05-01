/// <reference types="cypress" />

import { triggerAsyncId } from "async_hooks";

describe("Queue", () => {
  it("Visits the page", () => {
    cy.visit("http://localhost:3000");
    cy.contains("STEMIFY");
    cy.contains("QUEUE");
  });
  it("Visits queue", () => {
    cy.visit("http://localhost:3000/queue");
    cy.contains("QUEUE");
  });
});

describe("Not signed in on submit", () => {
  it("Sees log in button on submit page", () => {
    cy.visit("http://localhost:3000/submit");
    cy.contains("SIGN IN WITH DISCORD");
  });
});

export {};
