import { expect, type Page, test } from "@playwright/test";

test.describe("Backpacking trail section page", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto("/backpacking/pieterpad/sittard-to-roermond");
    });

    test("has the correct page title", async ({ page }: { page: Page }) => {
        // Arrange
        const expectedTitle = "Pieterpad - Sittard to Roermond | Bart Kessels";

        // Act & Assert
        await expect(page).toHaveTitle(expectedTitle);
    });

    test("displays the section heading", async ({ page }: { page: Page }) => {
        // Arrange
        const heading = page.getByRole("heading", { level: 1 });

        // Act & Assert
        await expect(heading).toContainText("Sittard to Roermond");
    });

    test("displays the hero image with a caption", async ({ page }: { page: Page }) => {
        // Arrange
        const figure = page.locator("figure");
        const heroImage = figure.locator("img");
        const caption = figure.locator("figcaption");

        // Act & Assert
        await expect(heroImage).toBeVisible();
        await expect(caption).toBeVisible();
    });

    test("displays a link back to the parent trail", async ({ page }: { page: Page }) => {
        // Arrange
        const trailLink = page.getByRole("link", { name: "Pieterpad" });

        // Act & Assert
        await expect(trailLink).toHaveAttribute("href", "/backpacking/pieterpad");
    });

    test("displays the section order label", async ({ page }: { page: Page }) => {
        // Arrange
        const orderLabel = page.getByText(/section \d+/i);

        // Act & Assert
        await expect(orderLabel.first()).toBeVisible();
    });

    test("displays the prose content body", async ({ page }: { page: Page }) => {
        // Arrange
        const content = page.locator(".prose");

        // Act & Assert
        await expect(content).toBeVisible();
    });
});
