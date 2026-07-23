import { expect, type Page, test } from "@playwright/test";

const MOBILE_VIEWPORT = { width: 375, height: 812 };
const DESKTOP_VIEWPORT = { width: 1280, height: 800 };

// Page that uses ImageFloat with the title prop
const TEST_PAGE = "/backpacking/andalusia-spain";

test.describe("ImageFloat component", () => {
    test.describe("on mobile viewport", () => {
        test.beforeEach(async ({ page }: { page: Page }) => {
            await page.setViewportSize(MOBILE_VIEWPORT);
            await page.goto(TEST_PAGE);
        });

        test("renders the title above the image", async ({ page }: { page: Page }) => {
            // Scope to the ImageFloat wrapper that contains "Plaza de Toros"
            const imageFloat = page.locator(".prose > div").filter({
                has: page.locator("h3.sm\\:hidden", { hasText: "Plaza de Toros" }),
            });
            const mobileTitle = imageFloat.locator("h3.sm\\:hidden");
            const figure = imageFloat.locator("figure");

            const titleBox = await mobileTitle.boundingBox();
            const figureBox = await figure.boundingBox();

            expect(titleBox).not.toBeNull();
            expect(figureBox).not.toBeNull();
            expect(titleBox!.y).toBeLessThan(figureBox!.y);
        });

        test("shows the mobile title", async ({ page }: { page: Page }) => {
            const mobileTitle = page.locator("h3.sm\\:hidden", { hasText: "Plaza de Toros" });

            await expect(mobileTitle).toBeVisible();
        });

        test("hides the desktop title", async ({ page }: { page: Page }) => {
            const desktopTitle = page.locator("h3.hidden.sm\\:block", { hasText: "Plaza de Toros" });

            await expect(desktopTitle).toBeHidden();
        });
    });

    test.describe("on desktop viewport", () => {
        test.beforeEach(async ({ page }: { page: Page }) => {
            await page.setViewportSize(DESKTOP_VIEWPORT);
            await page.goto(TEST_PAGE);
        });

        test("hides the mobile title", async ({ page }: { page: Page }) => {
            const mobileTitle = page.locator("h3.sm\\:hidden", { hasText: "Plaza de Toros" });

            await expect(mobileTitle).toBeHidden();
        });

        test("shows the desktop title", async ({ page }: { page: Page }) => {
            const desktopTitle = page.locator("h3.hidden.sm\\:block", { hasText: "Plaza de Toros" });

            await expect(desktopTitle).toBeVisible();
        });
    });

    test.describe("without a title prop", () => {
        test.beforeEach(async ({ page }: { page: Page }) => {
            await page.goto(TEST_PAGE);
        });

        test("renders no heading elements inside the component", async ({ page }: { page: Page }) => {
            // The first ImageFloat on the page (Caminito del Rey) has no title prop
            const firstImageFloat = page.locator(".prose > div").first();

            await expect(firstImageFloat.locator("h3")).toHaveCount(0);
        });
    });
});
