import { expect, type Page, test } from "@playwright/test";

test.describe("Gardening plant detail page", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto("/gardening/plants/broccoli");
    });

    test("has the correct page title", async ({ page }: { page: Page }) => {
        // Arrange
        const expectedTitle = "Growing Broccoli | Bart Kessels";

        // Act & Assert
        await expect(page).toHaveTitle(expectedTitle);
    });

    test("displays the plant name as the heading", async ({ page }: { page: Page }) => {
        // Arrange
        const heading = page.getByRole("heading", { level: 1 });

        // Act & Assert
        await expect(heading).toContainText("Broccoli");
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

    test('displays the "Plant Profile" badge', async ({ page }: { page: Page }) => {
        // Arrange
        const badge = page.getByText("Plant Profile");

        // Act & Assert
        await expect(badge).toBeVisible();
    });

    test("displays year tag links to the year overview page", async ({ page }: { page: Page }) => {
        // Arrange
        const yearLink = page.locator("article header").getByRole("link", { name: /^\d{4}$/ }).first();

        // Act & Assert
        await expect(yearLink).toHaveAttribute("href", /^\/gardening\/\d{4}$/);
    });

    test("displays the prose content body", async ({ page }: { page: Page }) => {
        // Arrange
        const content = page.locator(".prose");

        // Act & Assert
        await expect(content).toBeVisible();
    });
});
