import { expect, type Page, test } from "@playwright/test";

test.describe("Stories page", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto("/stories");
    });

    test("has the correct page title", async ({ page }: { page: Page }) => {
        // Arrange
        const expectedTitle = "Stories | Bart Kessels";

        // Act & Assert
        await expect(page).toHaveTitle(expectedTitle);
    });

    test("displays the page heading", async ({ page }: { page: Page }) => {
        // Arrange
        const heading = page.getByRole("heading", { level: 1 });

        // Act & Assert
        await expect(heading).toContainText("Stories");
    });

    test.describe("when stories are published", () => {
        test("displays story cards", async ({ page }: { page: Page }) => {
            // Arrange
            const storyCards = page.locator("article");

            // Act & Assert
            await expect(storyCards.first()).toBeVisible();
        });

        test("each story card displays its title, description, date, post count and series badge", async ({ page }: { page: Page }) => {
            // Arrange
            const storyCards = page.locator("article");
            const count = await storyCards.count();

            // Act & Assert
            for (let i = 0; i < count; i++) {
                const card = storyCards.nth(i);

                await expect(card.getByText("Story Series")).toBeVisible();
                await expect(card.getByText(/\d+ posts?/)).toBeVisible();
                await expect(card.getByRole("heading")).toBeVisible();
                await expect(card.locator("p")).toBeVisible();
                await expect(card.locator("time")).toBeVisible();
            }
        });

        test("story cards link to their detail page", async ({ page }: { page: Page }) => {
            // Arrange
            const firstCardLink = page.locator("article").first().getByRole("link");

            // Act & Assert
            await expect(firstCardLink).toHaveAttribute("href", /^\/stories\/.+/);
        });
    });
});
