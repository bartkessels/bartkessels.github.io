import { expect, type Page, test } from "@playwright/test";

test.describe("404 page", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto("/non-existent-page");
    });

    test("has the correct page title", async ({ page }: { page: Page }) => {
        // Arrange
        const expectedTitle = "Page Not Found | Bart Kessels";

        // Act & Assert
        await expect(page).toHaveTitle(expectedTitle);
    });

    test("displays the 404 heading", async ({ page }: { page: Page }) => {
        // Arrange
        const heading = page.getByRole("heading", { level: 1 });
        const expectedHeading = "Page not found";

        // Act & Assert
        await expect(heading).toContainText(expectedHeading);
    });

    test("displays the description text", async ({ page }: { page: Page }) => {
        // Arrange
        const description = page.getByText("The page you are looking for doesn't exist or has been moved");

        // Act & Assert
        await expect(description).toBeVisible();
    });

    test('has a "Back to homepage" link pointing to /', async ({ page }: { page: Page }) => {
        // Arrange
        const link = page.getByRole("link", { name: "← Back to homepage" });
        const expectedHref = "/";

        // Act & Assert
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", expectedHref);
    });

    test("has navigation links to all main sections", async ({ page }: { page: Page }) => {
        // Arrange
        const expectedLinks: { name: string; href: string }[] = [
            { name: "Blog", href: "/blog" },
            { name: "Stories", href: "/stories" },
            { name: "Software", href: "/software" },
            { name: "Backpacking", href: "/backpacking" },
            { name: "Gardening", href: "/gardening" },
            { name: "About", href: "/about" },
        ];

        // Act & Assert
        for (const { name, href } of expectedLinks) {
            const link = page.getByRole("link", { name, exact: true });
            await expect(link).toBeVisible();
            await expect(link).toHaveAttribute("href", href);
        }
    });
});
