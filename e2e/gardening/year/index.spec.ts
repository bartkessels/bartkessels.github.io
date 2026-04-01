import { expect, type Page, test } from "@playwright/test";

test.describe("Gardening year overview page", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto("/gardening/2025");
    });

    test("has the correct page title", async ({ page }: { page: Page }) => {
        // Arrange
        const expectedTitle = "2025 — Gardening | Bart Kessels";

        // Act & Assert
        await expect(page).toHaveTitle(expectedTitle);
    });

    test("displays the year as the page heading", async ({ page }: { page: Page }) => {
        // Arrange
        const heading = page.getByRole("heading", { level: 1 });

        // Act & Assert
        await expect(heading).toContainText("2025");
    });

    test("displays the Journal section heading", async ({ page }: { page: Page }) => {
        // Arrange
        const heading = page.getByRole("heading", { name: "Journal" });

        // Act & Assert
        await expect(heading).toBeVisible();
    });

    test("displays the Plants section heading", async ({ page }: { page: Page }) => {
        // Arrange
        const heading = page.getByRole("heading", { name: "Plants" });

        // Act & Assert
        await expect(heading).toBeVisible();
    });

    test.describe("when journal entries are published", () => {
        test("journal entries link to their detail pages", async ({ page }: { page: Page }) => {
            // Arrange
            const journalSection = page.locator("section").filter({ has: page.getByRole("heading", { name: "Journal" }) });
            const entryLinks = journalSection.getByRole("link").filter({ hasText: /.+/ }).first();

            // Act & Assert
            await expect(entryLinks).toHaveAttribute("href", /^\/gardening\/journal\/.+/);
        });
    });
});
