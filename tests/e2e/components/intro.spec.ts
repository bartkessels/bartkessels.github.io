import { expect, type Page, test } from "@playwright/test";

// Kotlin empty-char-literal post has an Intro with two paragraphs
const TEST_PAGE = "/kotlin/empty-char-literal";

test.describe("Intro component", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto(TEST_PAGE);
    });

    test("stacks multiple paragraphs vertically instead of placing them side by side", async ({ page }: { page: Page }) => {
        const paragraphs = page.locator("[data-intro-text] p");

        await expect(paragraphs).toHaveCount(2);

        const firstBox = await paragraphs.nth(0).boundingBox();
        const secondBox = await paragraphs.nth(1).boundingBox();

        expect(firstBox).not.toBeNull();
        expect(secondBox).not.toBeNull();

        // Stacked: same left edge, second paragraph starts below the first
        expect(secondBox!.x).toBeCloseTo(firstBox!.x, 0);
        expect(secondBox!.y).toBeGreaterThanOrEqual(firstBox!.y + firstBox!.height);
    });

    test("renders both paragraphs at full width, not shrunk side by side", async ({ page }: { page: Page }) => {
        const container = page.locator("[data-intro-text]");
        const paragraphs = page.locator("[data-intro-text] p");

        const containerBox = await container.boundingBox();
        const firstBox = await paragraphs.nth(0).boundingBox();

        expect(containerBox).not.toBeNull();
        expect(firstBox).not.toBeNull();

        expect(firstBox!.width).toBeCloseTo(containerBox!.width, 0);
    });
});
