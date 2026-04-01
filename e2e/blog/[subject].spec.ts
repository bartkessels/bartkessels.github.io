import { expect, type Page, test } from "@playwright/test";

test.describe("Blog subject overview page", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto("/android");
    });

    test("has the correct page title", async ({ page }: { page: Page }) => {
        // Arrange
        const expectedTitle = "Android Posts | Bart Kessels";

        // Act & Assert
        await expect(page).toHaveTitle(expectedTitle);
    });

    test("displays the subject name as the page heading", async ({ page }: { page: Page }) => {
        // Arrange
        const heading = page.getByRole("heading", { level: 1 });

        // Act & Assert
        await expect(heading).toContainText("Android");
    });

    test.describe("when posts are published", () => {
        test("displays blog cards", async ({ page }: { page: Page }) => {
            // Arrange
            const blogCards = page.locator("article");

            // Act & Assert
            await expect(blogCards.first()).toBeVisible();
        });

        test("blog cards link to their detail page", async ({ page }: { page: Page }) => {
            // Arrange
            const firstCardLink = page.locator("article").first().getByRole("heading").getByRole("link");

            // Act & Assert
            await expect(firstCardLink).toHaveAttribute("href", /^\/android\/.+/);
        });
    });
});
