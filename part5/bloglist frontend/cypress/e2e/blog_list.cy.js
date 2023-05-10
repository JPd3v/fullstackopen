/// <reference types="Cypress" />

describe("blog list app", () => {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}testing/reset`);

    cy.visit("");
    cy.request("POST", `${Cypress.env("BACKEND")}users/`, {
      username: "test user",
      name: "test name",
      password: "test password",
    });
  });

  it("opens the front page", function () {
    cy.visit("");
    cy.contains("log in");
  });

  describe("Log in", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("test user");
      cy.get("#password").type("test password");
      cy.get("button").click();

      cy.contains("test name");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("test user");
      cy.get("#password").type("wrong password");
      cy.get("button").click();

      cy.contains("invalid username or password");
    });
  });

  describe("when logged in", function () {
    beforeEach(function () {
      cy.login({ username: "test user", password: "test password" });
    });

    it("can create a new blog", function () {
      cy.contains("new blog").click();
      cy.get("#title").type("a new blog test");
      cy.get("#author").type("test user");
      cy.get("#url").type("www.example.com");

      cy.contains("button", "create").click();
      cy.get(".blog").contains("a new blog test");
      cy.get(".blog").contains("test user");
    });

    it("can give like to a blog", function () {
      const newBlog = {
        title: "testing like",
        author: "test user",
        url: "www.example.com",
      };

      cy.createBlog(newBlog);

      cy.get("button").contains("view").click();
      cy.get("button").contains("like").click();
      cy.contains("likes:1");
    });

    it("can delete blog created by itself", function () {
      const newBlog = {
        title: "testing deletion",
        author: "test user",
        url: "www.example.com",
      };
      cy.createBlog(newBlog);

      cy.get("button").contains("view").click();
      cy.get("button").contains("delete").click();

      cy.contains(newBlog.title).should("not.exist");
    });

    it("cant delete blog of others users", function () {
      cy.request("POST", `${Cypress.env("BACKEND")}testing/blogs`);
      cy.visit("");
      cy.get("button").contains("view").click();
      cy.get("button").contains("delete").should("not.exist");
    });

    it("blogs are ordered by likes", function () {
      cy.request("POST", `${Cypress.env("BACKEND")}testing/blogs`);
      const newBlog = {
        title: "testing sorting",
        author: "test user",
        url: "www.example.com",
      };
      cy.createBlog(newBlog);
      cy.visit("");

      cy.get(".blog").eq(0).should("contain", "dummy blog");
      cy.get(".blog").eq(1).should("contain", "testing sorting");

      cy.get(".blog").contains("testing sorting").parent().as("userBlog");

      cy.get("@userBlog").contains("button", "view").click();
      cy.get("@userBlog").contains("button", "like").click();
      cy.get("@userBlog").contains("likes:1");
      cy.get("@userBlog").contains("button", "like").click();
      cy.get("@userBlog").contains("likes:2");

      cy.get(".blog").eq(0).should("contain", "testing sorting");
      cy.get(".blog").eq(1).should("contain", "dummy blog");
    });
  });
});
