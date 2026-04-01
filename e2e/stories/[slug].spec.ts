import { expect, type Page, test } from "@playwright/test";

test.describe("Story detail page", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto("/stories/create-an-android-app");
    });

    test("has the correct page title", async ({ page }: { page: Page }) => {
        // Arrange
        const expectedTitle = "Create an Android app | Bart Kessels";

        // Act & Assert
        await expect(page).toHaveTitle(expectedTitle);
    });

    test("displays the story heading", async ({ page }: { page: Page }) => {
        // Arrange
        const heading = page.getByRole("heading", { level: 1 });

        // Act & Assert
        await expect(heading).toContainText("Create an Android app");
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

    test('displays the "Story Series" badge and post count', async ({ page }: { page: Page }) => {
        // Arrange
        const badge = page.getByText("Story Series");
        const postCount = page.getByText(/\d+ posts?/);

        // Act & Assert
        await expect(badge).toBeVisible();
        await expect(postCount).toBeVisible();
    });

    test("displays the story description", async ({ page }: { page: Page }) => {
        // Arrange
        const description = page.locator("article header p");

        // Act & Assert
        await expect(description).toBeVisible();
    });

    test("displays the started date", async ({ page }: { page: Page }) => {
        // Arrange
        const date = page.getByText(/Started /i);

        // Act & Assert
        await expect(date).toBeVisible();
    });

    test.describe("when the story has posts", () => {
        test('displays the "Posts in this series" section', async ({ page }: { page: Page }) => {
            // Arrange
            const heading = page.getByRole("heading", { name: "Posts in this series" });

            // Act & Assert
            await expect(heading).toBeVisible();
        });

        test("each post in the series links to its detail page", async ({ page }: { page: Page }) => {
            // Arrange
            const postLinks = page.locator("article section a");
            const count = await postLinks.count();

            // Act & Assert
            for (let i = 0; i < count; i++) {
                await expect(postLinks.nth(i)).toHaveAttribute("href", /^\/.+\/.+/);
            }
        });
    });
});
