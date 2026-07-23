import { expect, type Page, test } from "@playwright/test";

test.describe("Backpacking post detail page", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto("/backpacking/posts/introduction-to-backpacking");
    });

    test("has the correct page title", async ({ page }: { page: Page }) => {
        // Arrange
        const expectedTitle = "Backpacking introduction | Bart Kessels";

        // Act & Assert
        await expect(page).toHaveTitle(expectedTitle);
    });

    test("displays the post heading", async ({ page }: { page: Page }) => {
        // Arrange
        const heading = page.getByRole("heading", { level: 1 });

        // Act & Assert
        await expect(heading).toContainText("Backpacking introduction");
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

    test("displays the post description", async ({ page }: { page: Page }) => {
        // Arrange
        const description = page.locator("article header p");

        // Act & Assert
        await expect(description).toBeVisible();
    });

    test("displays the author and date", async ({ page }: { page: Page }) => {
        // Arrange
        const header = page.locator("article header");

        // Act & Assert
        await expect(header.getByText(/Bart Kessels/)).toBeVisible();
        await expect(header.getByText(/2023/)).toBeVisible();
    });

    test("displays the prose content body", async ({ page }: { page: Page }) => {
        // Arrange
        const content = page.locator(".prose");

        // Act & Assert
        await expect(content).toBeVisible();
    });
});
