import { expect, type Page, test } from "@playwright/test";

test.describe("Backpacking trail detail page", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto("/backpacking/pieterpad");
    });

    test("has the correct page title", async ({ page }: { page: Page }) => {
        // Arrange
        const expectedTitle = "Pieterpad | Bart Kessels";

        // Act & Assert
        await expect(page).toHaveTitle(expectedTitle);
    });

    test("displays the trail heading", async ({ page }: { page: Page }) => {
        // Arrange
        const heading = page.getByRole("heading", { level: 1 });

        // Act & Assert
        await expect(heading).toContainText("Pieterpad");
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

    test("displays the trail description", async ({ page }: { page: Page }) => {
        // Arrange
        const description = page.locator("article header p");

        // Act & Assert
        await expect(description).toBeVisible();
    });

    test("displays the distance stat", async ({ page }: { page: Page }) => {
        // Arrange
        const distanceStat = page.getByText("km");

        // Act & Assert
        await expect(distanceStat.first()).toBeVisible();
    });

    test.describe("when sections are published", () => {
        test("displays section links to their detail pages", async ({ page }: { page: Page }) => {
            // Arrange
            const sectionsSection = page.locator("section").filter({ has: page.getByRole("heading", { name: "Sections" }) });
            const firstSectionLink = sectionsSection.getByRole("link").first();

            // Act & Assert
            await expect(firstSectionLink).toHaveAttribute("href", /^\/backpacking\/pieterpad\/.+/);
        });
    });
});
