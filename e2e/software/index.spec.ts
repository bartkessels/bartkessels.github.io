import { expect, type Page, test } from "@playwright/test";

test.describe("Software page", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto("/software");
    });

    test("has the correct page title", async ({ page }: { page: Page }) => {
        // Arrange
        const expectedTitle = "Software | Bart Kessels";

        // Act & Assert
        await expect(page).toHaveTitle(expectedTitle);
    });

    test("displays the page heading", async ({ page }: { page: Page }) => {
        // Arrange
        const heading = page.getByRole("heading", { level: 1 });

        // Act & Assert
        await expect(heading).toContainText("Software");
    });

    test.describe("when projects are published", () => {
        test("displays software cards", async ({ page }: { page: Page }) => {
            // Arrange
            const softwareCards = page.locator("article");

            // Act & Assert
            await expect(softwareCards.first()).toBeVisible();
        });

        test("each software card displays its logo, name, description, and repository link", async ({ page }: { page: Page }) => {
            // Arrange
            const softwareCards = page.locator("article");
            const count = await softwareCards.count();

            // Act & Assert
            for (let i = 0; i < count; i++) {
                const card = softwareCards.nth(i);

                await expect(card.locator("img")).toBeVisible();
                await expect(card.getByRole("heading")).toBeVisible();
                await expect(card.locator("p")).toBeVisible();
                await expect(card.getByRole("link", { name: /repository/i })).toBeVisible();
            }
        });

        test("software cards link to their detail page", async ({ page }: { page: Page }) => {
            // Arrange
            const firstCardLink = page.locator("article").first().getByRole("heading").getByRole("link");

            // Act & Assert
            await expect(firstCardLink).toHaveAttribute("href", /^\/software\/.+/);
        });

        test("repository links point to an external URL", async ({ page }: { page: Page }) => {
            // Arrange
            const repositoryLink = page.locator("article").first().getByRole("link", { name: /repository/i });

            // Act & Assert
            await expect(repositoryLink).toHaveAttribute("href", /^https?:\/\//);
        });
    });
});
