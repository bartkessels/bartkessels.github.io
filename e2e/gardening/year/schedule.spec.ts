import { expect, type Page, test } from "@playwright/test";

test.describe("Gardening year schedule page", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto("/gardening/2025/schedule");
    });

    test("has the correct page title", async ({ page }: { page: Page }) => {
        // Arrange
        const expectedTitle = "2025 Planting Schedule | Bart Kessels";

        // Act & Assert
        await expect(page).toHaveTitle(expectedTitle);
    });

    test("displays the Schedule heading", async ({ page }: { page: Page }) => {
        // Arrange
        const heading = page.getByRole("heading", { level: 1 });

        // Act & Assert
        await expect(heading).toContainText("Schedule");
    });

    test("displays the year badge", async ({ page }: { page: Page }) => {
        // Arrange
        const badge = page.getByText("2025");

        // Act & Assert
        await expect(badge.first()).toBeVisible();
    });

    test.describe("when plants are published", () => {
        test("displays the plant schedule list", async ({ page }: { page: Page }) => {
            // Arrange
            const scheduleList = page.locator(".plant-schedule-list");

            // Act & Assert
            await expect(scheduleList).toBeVisible();
        });

        test("each plant row links to its detail page", async ({ page }: { page: Page }) => {
            // Arrange
            const plantLinks = page.locator(".plant-schedule-list-row a");
            const firstLink = plantLinks.first();

            // Act & Assert
            await expect(firstLink).toHaveAttribute("href", /^\/gardening\/plants\/.+/);
        });
    });
});
