import { expect, type Page, test } from "@playwright/test";

test.describe("Gardening page", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto("/gardening");
    });

    test("has the correct page title", async ({ page }: { page: Page }) => {
        // Arrange
        const expectedTitle = "Gardening | Bart Kessels";

        // Act & Assert
        await expect(page).toHaveTitle(expectedTitle);
    });

    test("displays the page heading", async ({ page }: { page: Page }) => {
        // Arrange
        const heading = page.getByRole("heading", { level: 1 });

        // Act & Assert
        await expect(heading).toContainText("Gardening");
    });

    test.describe("when entries are published", () => {
        test("displays at least one year section", async ({ page }: { page: Page }) => {
            // Arrange
            const yearLink = page.getByRole("link", { name: /^\d{4}$/ }).first();

            // Act & Assert
            await expect(yearLink).toBeVisible();
        });

        test("year headings link to their year overview page", async ({ page }: { page: Page }) => {
            // Arrange
            const firstYearLink = page.getByRole("link", { name: /^\d{4}$/ }).first();

            // Act & Assert
            await expect(firstYearLink).toHaveAttribute("href", /^\/gardening\/\d{4}$/);
        });

        test("each year section shows a Journal heading", async ({ page }: { page: Page }) => {
            // Arrange
            const journalHeading = page.getByRole("heading", { name: "Journal" }).first();

            // Act & Assert
            await expect(journalHeading).toBeVisible();
        });

        test("each year section shows a Plants heading", async ({ page }: { page: Page }) => {
            // Arrange
            const plantsHeading = page.getByRole("heading", { name: "Plants" }).first();

            // Act & Assert
            await expect(plantsHeading).toBeVisible();
        });

        test("year section has a View schedule link", async ({ page }: { page: Page }) => {
            // Arrange
            const scheduleLink = page.getByRole("link", { name: /view schedule/i }).first();

            // Act & Assert
            await expect(scheduleLink).toHaveAttribute("href", /^\/gardening\/\d{4}\/schedule$/);
        });
    });
});
