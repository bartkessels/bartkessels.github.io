import { expect, type Page, test } from "@playwright/test";

test.describe("Software detail page", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto("/software/getit");
    });

    test("has the correct page title", async ({ page }: { page: Page }) => {
        // Arrange
        const expectedTitle = "GetIt | Bart Kessels";

        // Act & Assert
        await expect(page).toHaveTitle(expectedTitle);
    });

    test("displays the project heading", async ({ page }: { page: Page }) => {
        // Arrange
        const heading = page.getByRole("heading", { level: 1 });

        // Act & Assert
        await expect(heading).toContainText("GetIt");
    });

    test("displays the project logo", async ({ page }: { page: Page }) => {
        // Arrange
        const logo = page.locator("article header img");

        // Act & Assert
        await expect(logo).toBeVisible();
    });

    test("displays the project description", async ({ page }: { page: Page }) => {
        // Arrange
        const description = page.locator("article header p");

        // Act & Assert
        await expect(description).toBeVisible();
    });

    test('has a "View on GitHub" link pointing to an external URL', async ({ page }: { page: Page }) => {
        // Arrange
        const link = page.getByRole("link", { name: /view on github/i });

        // Act & Assert
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", /^https?:\/\//);
    });

    test('has a "Visit website" link pointing to an external URL', async ({ page }: { page: Page }) => {
        // Arrange
        const link = page.getByRole("link", { name: /visit website/i });

        // Act & Assert
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", /^https?:\/\//);
    });

    test("displays the prose content body", async ({ page }: { page: Page }) => {
        // Arrange
        const content = page.locator("article .prose");

        // Act & Assert
        await expect(content).toBeVisible();
    });
});
