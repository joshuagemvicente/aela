describe("Authentication", () => {
    it("should allow the user to visit the register page", () => {
        cy.visit("/register")
        cy.url().should("include", "/register")
        
        // Fill out the registration form with proper field selectors
        cy.get("input[id='name']").type("John Doe")
        cy.get("input[id='email']").type("john.doe@example.com")
        cy.get("input[id='password']").type("password123")
        cy.get("input[id='confirmPassword']").type("password123")
        
        // Click the submit button
        cy.get("button[type='submit']").click()
        
        // Wait for redirect to login page after successful registration
        cy.url().should("include", "/login")
    })

    it("should show validation errors for invalid input", () => {
        cy.visit("/register")
        
        // Try to submit empty 
        cy.get("button[type='submit']").click()
        
        // Check for validation error messages
        cy.get("p.text-destructive").should("be.visible")
    })

    it("should toggle password visibility", () => {
        cy.visit("/register")
        
        // Test password visibility toggle
        cy.get("input[id='password']").type("testpassword")
        cy.get("input[id='password']").should("have.attr", "type", "password")
        
        // Click the eye icon to show password
        cy.get("button[type='button']").contains("password").parent().find("button").click()
        cy.get("input[id='password']").should("have.attr", "type", "text")
    })

    it("should navigate to login page from register", () => {
        cy.visit("/register")
        
        // Click the "Sign in" link
        cy.get("button").contains("Sign in").click()
        cy.url().should("include", "/login")
    })
})