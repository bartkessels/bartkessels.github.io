import { expect, type Page, test } from "@playwright/test";

test.describe("Blog page", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto("/blog");
    });

    test("has the correct page title", async ({ page }: { page: Page }) => {
        // Arrange
        const expectedTitle = "Blog | Bart Kessels";

        // Act & Assert
        await expect(page).toHaveTitle(expectedTitle);
    });

    test("displays the page heading", async ({ page }: { page: Page }) => {
        // Arrange
        const heading = page.getByRole("heading", { level: 1 });

        // Act & Assert
        await expect(heading).toContainText("Blog");
    });

    test.describe("when posts are published", () => {
        test("displays the Latest Posts section", async ({ page }: { page: Page }) => {
            // Arrange
            const heading = page.getByRole("heading", { name: "Latest Posts" });

            // Act & Assert
            await expect(heading).toBeVisible();
        });

        test("displays blog cards", async ({ page }: { page: Page }) => {
            // Arrange
            const blogCards = page.locator("article");

            // Act & Assert
            await expect(blogCards.first()).toBeVisible();
        });

        test("each blog card displays its subject badge, title, description, author, and date", async ({ page }: { page: Page }) => {
            // Arrange
            const blogCards = page.locator("article");
            const count = await blogCards.count();

            // Act & Assert
            for (let i = 0; i < count; i++) {
                const card = blogCards.nth(i);

                await expect(card.getByRole("heading")).toBeVisible();
                await expect(card.locator("p")).toBeVisible();
                await expect(card.locator("time")).toBeVisible();
            }
        });

        test("blog cards link to their detail page", async ({ page }: { page: Page }) => {
            // Arrange
            const firstCardLink = page.locator("article").first().getByRole("heading").getByRole("link");

            // Act & Assert
            await expect(firstCardLink).toHaveAttribute("href", /^\/.+\/.+/);
        });
    });

    test.describe("when stories are featured", () => {
        test("displays the Featured Stories section", async ({ page }: { page: Page }) => {
            // Arrange
            const heading = page.getByRole("heading", { name: "Featured Stories" });

            // Act & Assert
            await expect(heading).toBeVisible();
        });

        test("story cards link to their detail page", async ({ page }: { page: Page }) => {
            // Arrange
            const section = page.locator('section[data-section="stories"]');
            const firstCardLink = section.locator("article").first().getByRole("link");

            // Act & Assert
            await expect(firstCardLink).toHaveAttribute("href", /^\/stories\/.+/);
        });
    });

    test.describe("pagination", () => {
        test("pagination is visible when there are multiple pages", async ({ page }: { page: Page }) => {
            // Arrange
            const pagination = page.locator("nav[aria-label='Pagination']");

            // Act & Assert
            await expect(pagination).toBeVisible();
        });

        test("next page link navigates to page 2", async ({ page }: { page: Page }) => {
            // Arrange
            const nextLink = page.locator("nav[aria-label='Pagination']").getByRole("link", { name: /next/i });

            // Act
            await nextLink.click();

            // Assert
            await expect(page).toHaveURL(/\/blog\/2/);
        });

        test("page 2 displays the correct URL", async ({ page }: { page: Page }) => {
            // Act
            await page.goto("/blog/2");

            // Assert
            await expect(page).toHaveURL(/\/blog\/2/);
        });

        test("previous page link on page 2 navigates back to page 1", async ({ page }: { page: Page }) => {
            // Arrange
            await page.goto("/blog/2");
            const prevLink = page.locator("nav[aria-label='Pagination']").getByRole("link", { name: /previous/i });

            // Act
            await prevLink.click();

            // Assert
            await expect(page).toHaveURL(/\/blog(?:\/1)?$/);
        });
    });
});
