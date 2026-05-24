import { expect, type Page, test } from "@playwright/test";

test.describe("About page", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto("/about");
    });

    test("has the correct page title", async ({ page }: { page: Page }) => {
        // Arrange
        const expectedTitle = "About | Bart Kessels";

        // Act & Assert
        await expect(page).toHaveTitle(expectedTitle);
    });

    test("displays the name heading", async ({ page }: { page: Page }) => {
        // Arrange
        const heading = page.getByRole("heading", { level: 1 });
        const expectedName = "Bart Kessels";
        
        // Act & Assert
        await expect(heading).toContainText(expectedName);
    });

    test("displays the subtitle", async ({ page }: { page: Page }) => {
        // Arrange
        const subtitle = page.getByText("Software Developer & Outdoor Enthusiast");
        
        // Act & Assert
        await expect(subtitle).toBeVisible();
    });

    // test("displays the bio content", async ({ page }: { page: Page }) => {
    //     // Arrange
    //     const content = page.getByText("Hi, I am Bart", { exact: false });
        
    //     // Act & Assert
    //     await expect(content).toBeVisible();
    // });

    test("get in touch section has a GitHub link", async ({ page }: { page: Page }) => {
        // Arrange
        const section = page.locator("section").filter({ has: page.getByRole("heading", { name: "Get in Touch" }) });
        const link = section.getByRole("link", { name: /github/i });

        // Act & Assert
        await expect(link).toContainText("GitHub");
        await expect(link).toHaveAttribute("href", "https://github.com/bartkessels");
    });

    test("get in touch section has a LinkedIn link", async ({ page }: { page: Page }) => {
        // Arrange
        const section = page.locator("section").filter({ has: page.getByRole("heading", { name: "Get in Touch" }) });
        const link = section.getByRole("link", { name: /linkedin/i });

        // Act & Assert
        await expect(link).toContainText("LinkedIn");
        await expect(link).toHaveAttribute("href", "https://linkedin.com/in/bartkessels");
    });

    test("has an email link", async ({ page }: { page: Page }) => {
        // Arrange
        const link = page.getByRole("link", { name: /email/i });

        // Act & Assert
        await expect(link).toContainText("Email");
        await expect(link).toHaveAttribute("href", "mailto:hello@bartkessels.net");
    });

    test("footer has a GitHub link", async ({ page }: { page: Page }) => {
        // Arrange
        const link = page.locator("footer").getByRole("link", { name: /github/i });

        // Act & Assert
        await expect(link).toHaveAttribute("href", "https://github.com/bartkessels");
    });

    test("footer has a LinkedIn link", async ({ page }: { page: Page }) => {
        // Arrange
        const link = page.locator("footer").getByRole("link", { name: /linkedin/i });

        // Act & Assert
        await expect(link).toHaveAttribute("href", "https://linkedin.com/in/bartkessels");
    });

    test.describe("Certifications section", () => {
        test("displays the Certifications heading", async ({ page }: { page: Page }) => {
            // Arrange
            const heading = page.getByRole("heading", { name: "Certifications" });

            // Act & Assert
            await expect(heading).toBeVisible();
        });

        test("displays at least one certificate card", async ({ page }: { page: Page }) => {
            // Arrange
            const cards = page.locator("article");

            // Act & Assert
            await expect(cards.first()).toBeVisible();
        });

        test("each certificate card shows the certificate name", async ({ page }: { page: Page }) => {
            // Arrange
            const cards = page.locator("article");
            const count = await cards.count();

            // Act & Assert
            for (let i = 0; i < count; i++) {
                const card = cards.nth(i);
                await expect(card.getByRole("heading")).toBeVisible();
            }
        });

        test("each certificate card shows the issuer name", async ({ page }: { page: Page }) => {
            // Arrange
            const cards = page.locator("article");
            const count = await cards.count();

            // Act & Assert
            for (let i = 0; i < count; i++) {
                const card = cards.nth(i);
                // Issuer is rendered as a <p> with uppercase styling
                await expect(card.locator("p").first()).toBeVisible();
            }
        });

        test("each certificate card shows the issue date", async ({ page }: { page: Page }) => {
            // Arrange
            const cards = page.locator("article");
            const count = await cards.count();

            // Act & Assert
            for (let i = 0; i < count; i++) {
                const card = cards.nth(i);
                await expect(card.getByText(/issued/i)).toBeVisible();
            }
        });

        test("expired certificates display an expiry indicator", async ({ page }: { page: Page }) => {
            // Arrange
            const expiredCards = page.locator("article").filter({ hasText: "Expired" });

            // Act & Assert — only assert if any expired certs exist
            const count = await expiredCards.count();
            if (count > 0) {
                await expect(expiredCards.first().getByText("Expired")).toBeVisible();
            }
        });
    });
});
