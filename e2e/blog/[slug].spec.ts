import { expect, type Page, test } from "@playwright/test";

test.describe("Blog post detail page", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto("/android/plural-string-resource");
    });

    test("has the correct page title", async ({ page }: { page: Page }) => {
        // Arrange
        const expectedTitle = "Plural string resource in your Android app | Bart Kessels";

        // Act & Assert
        await expect(page).toHaveTitle(expectedTitle);
    });

    test("displays the post heading", async ({ page }: { page: Page }) => {
        // Arrange
        const heading = page.getByRole("heading", { level: 1 });

        // Act & Assert
        await expect(heading).toContainText("Plural string resource in your Android app");
    });

    test("displays the subject badge", async ({ page }: { page: Page }) => {
        // Arrange
        const badge = page.getByText("Android");

        // Act & Assert
        await expect(badge.first()).toBeVisible();
    });

    test("displays the author, date and reading time", async ({ page }: { page: Page }) => {
        // Arrange
        const header = page.locator("article header");

        // Act & Assert
        await expect(header.locator("time")).toBeVisible();
        await expect(header.getByText(/Bart Kessels/)).toBeVisible();
        await expect(header.getByText(/min read/)).toBeVisible();
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

    test("displays the post description", async ({ page }: { page: Page }) => {
        // Arrange
        const description = page.locator("article header p");

        // Act & Assert
        await expect(description).toBeVisible();
    });

    test("displays the prose content body", async ({ page }: { page: Page }) => {
        // Arrange
        const content = page.locator(".prose");

        // Act & Assert
        await expect(content).toBeVisible();
    });
});
