import { expect, type Page, test } from "@playwright/test";

test.describe("Backpacking page", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto("/backpacking");
    });

    test("has the correct page title", async ({ page }: { page: Page }) => {
        // Arrange
        const expectedTitle = "Backpacking | Bart Kessels";

        // Act & Assert
        await expect(page).toHaveTitle(expectedTitle);
    });

    test("displays the page heading", async ({ page }: { page: Page }) => {
        // Arrange
        const heading = page.getByRole("heading", { level: 1 });

        // Act & Assert
        await expect(heading).toContainText("Backpacking");
    });

    test.describe("when trails are published", () => {
        test("displays trail cards", async ({ page }: { page: Page }) => {
            // Arrange
            const trailCards = page.locator("article");

            // Act & Assert
            await expect(trailCards.first()).toBeVisible();
        });

        test("trail cards link to their detail page", async ({ page }: { page: Page }) => {
            // Arrange
            const firstCardLink = page.locator("article").first().getByRole("link");

            // Act & Assert
            await expect(firstCardLink).toHaveAttribute("href", /^\/backpacking\/.+/);
        });
    });

    test.describe("when posts are published", () => {
        test("displays the Posts section", async ({ page }: { page: Page }) => {
            // Arrange
            const heading = page.getByRole("heading", { name: "Posts" });

            // Act & Assert
            await expect(heading).toBeVisible();
        });

        test("post links point to their detail page", async ({ page }: { page: Page }) => {
            // Arrange
            const firstPostLink = page.locator('a[href^="/backpacking/posts/"]').first();

            // Act & Assert
            await expect(firstPostLink).toHaveAttribute("href", /^\/backpacking\/posts\/.+/);
        });
    });
});
