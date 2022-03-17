/// <reference types="cypress" />

import { triggerAsyncId } from "async_hooks";

describe("Queue", () => {
  it("Visits the page", () => {
    cy.visit("http://localhost:3000");
    cy.contains("STEMIFY");
    cy.contains("QUEUE");
  });

  it("Clicks queue then navigates back", () => {
    cy.visit("http://localhost:3000");
    cy.contains("QUEUE");
    cy.get('[href="/queue"]').click();
    cy.contains("QUEUE");
    cy.get("path").click();
    cy.contains("QUEUE");
  });
});

describe("Library", () => {
  it("Navigates to library", () => {
    cy.visit("http://localhost:3000");
    cy.get('[href="/library"]').click();
    cy.contains("UPLOAD QUEUE");
    // Add first song to queue
  });

  it("Adds a song to the upload queue", () => {
    cy.get(":nth-child(1) > .rounded").click();
    cy.get(
      ".flex-col > .justify-between > .flex > .text-black > .font-semibold"
    ).should("exist");
  });

  it("Removes a song from the queue", () => {
    cy.get(".svg-inline--fa > path").click();
    cy.get(
      ".flex-col > .justify-between > .flex > .text-black > .font-semibold"
    ).should("not.exist");
  });

  it("Has multiple songs", () => {
    cy.get(".grid").children().should("have.length.above", 2);
  });

  it("Clicks the first song", () => {
    let title: string;
    cy.get(":nth-child(1) > .flex > .text-black > .font-semibold").then(
      ($el) => {
        cy.log($el.text());
      }
    );
    cy.get(":nth-child(1) > .flex > .text-black > .font-semibold").click();

    cy.get("path").should("exist");
  });
});

describe("Album", () => {
  it("Goes to album", () => {
    cy.visit("http://localhost:3000/library");
    cy.get(":nth-child(1) > .flex > .relative > span > img").should("exist");
  });
});

export {};
