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

test.describe("Blog subject overview page — pagination", () => {
    // advent-of-code has 18 posts which fills 2 pages at 9 posts/page
    const subject = "advent-of-code";

    test("pagination is visible when the subject has multiple pages", async ({ page }: { page: Page }) => {
        // Arrange
        await page.goto(`/${subject}`);
        const pagination = page.locator("nav[aria-label='Pagination']");

        // Act & Assert
        await expect(pagination).toBeVisible();
    });

    test("next page link navigates to page 2 of the subject", async ({ page }: { page: Page }) => {
        // Arrange
        await page.goto(`/${subject}`);
        const nextLink = page.locator("nav[aria-label='Pagination']").getByRole("link", { name: /next/i });

        // Act
        await nextLink.click();

        // Assert
        await expect(page).toHaveURL(new RegExp(`\\/${subject}\\/2`));
    });

    test("page 2 displays the correct URL", async ({ page }: { page: Page }) => {
        // Act
        await page.goto(`/${subject}/2`);

        // Assert
        await expect(page).toHaveURL(new RegExp(`\\/${subject}\\/2`));
    });

    test("previous page link on page 2 navigates back to page 1", async ({ page }: { page: Page }) => {
        // Arrange
        await page.goto(`/${subject}/2`);
        const prevLink = page.locator("nav[aria-label='Pagination']").getByRole("link", { name: /previous/i });

        // Act
        await prevLink.click();

        // Assert
        await expect(page).toHaveURL(new RegExp(`\\/${subject}(?:\\/1)?$`));
    });
});
