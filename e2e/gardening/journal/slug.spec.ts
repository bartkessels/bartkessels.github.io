import { expect, type Page, test } from "@playwright/test";

test.describe("Gardening journal entry page", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto("/gardening/journal/2025/planting-indoors");
    });

    test("has the correct page title", async ({ page }: { page: Page }) => {
        // Arrange
        const expectedTitle = "Starting the planting season | Bart Kessels";

        // Act & Assert
        await expect(page).toHaveTitle(expectedTitle);
    });

    test("displays the entry heading", async ({ page }: { page: Page }) => {
        // Arrange
        const heading = page.getByRole("heading", { level: 1 });

        // Act & Assert
        await expect(heading).toContainText("Starting the planting season");
    });

    test('displays the "Journal Entry" badge', async ({ page }: { page: Page }) => {
        // Arrange
        const badge = page.getByText("Journal Entry");

        // Act & Assert
        await expect(badge).toBeVisible();
    });

    test("displays the author, date and reading time", async ({ page }: { page: Page }) => {
        // Arrange
        const header = page.locator("article header");

        // Act & Assert
        await expect(header.locator("time")).toBeVisible();
        await expect(header.getByText(/Bart Kessels/)).toBeVisible();
        await expect(header.getByText(/min read/)).toBeVisible();
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

    test("displays the prose content body", async ({ page }: { page: Page }) => {
        // Arrange
        const content = page.locator(".prose");

        // Act & Assert
        await expect(content).toBeVisible();
    });
});
