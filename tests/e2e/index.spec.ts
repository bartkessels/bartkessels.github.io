import { expect, type Page, test } from "@playwright/test";

test.describe("Home page", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto("/");
    });

    test("has the correct page title", async ({ page }: { page: Page }) => {
        // Arrange
        const expectedTitle = "Bart Kessels — Software Developer & Outdoor Enthusiast | Bart Kessels";

        // Act & Assert
        await expect(page).toHaveTitle(expectedTitle);
    });

    test("displays the hero heading", async ({ page }: { page: Page }) => {
        // Arrange
        const heading = page.getByRole("heading", { level: 1 });
        const expectedHeading = "Hi, I'm Bart Kessels";
        
        // Act & Assert
        await expect(heading).toContainText(expectedHeading);
    });

    test("displays the bio text", async ({ page }: { page: Page }) => {
        // Arrange
        const bioText = page.getByText("Software developer from the Netherlands");

        // Act & Assert
        await expect(bioText).toBeVisible();
    });

    test('has a "Read the blog" CTA linking to /blog', async ({ page }: { page: Page; }) => {
        // Arrange
        const link = page.getByRole("link", { name: "Read the blog" });
        const expectedHref = "/blog";

        // Act & Assert
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", expectedHref);
    });

    test('has an "About me" CTA linking to /about', async ({ page }: { page: Page; }) => {
        // Arrange
        const link = page.getByRole("link", { name: "About me" });
        const expectedHref = "/about";

        // Act & Assert
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", expectedHref);
    });

    test("has a GitHub link", async ({ page }: { page: Page }) => {
        // Arrange
        const link = page.locator("section").first().getByRole("link", { name: /github/i });
        const expectedHref = "https://github.com/bartkessels";

        // Act & Assert
        await expect(link).toHaveAttribute("href", expectedHref);
    });

    test("has a LinkedIn link", async ({ page }: { page: Page }) => {
        // Arrange
        const link = page.locator("section").first().getByRole("link", { name: /linkedin/i });
        const expectedHref = "https://linkedin.com/in/bartkessels";
        
        // Act & Assert
        await expect(link).toHaveAttribute("href", expectedHref);
    });

    test("blog section shows latest posts and links to /blog", async ({ page }: { page: Page; }) => {
        // Arrange
        const section = page.locator('section[data-section="blog"]');
        const latestPostsSection = section.getByRole("heading", { name: "Latest posts" });
        const allPostsLink = section.getByRole("link", { name: "All posts" });
        const expectedAllPostsHref = "/blog";
        
        // Act & Assert
        await expect(section).toBeVisible();
        await expect(latestPostsSection).toBeVisible();
        await expect(allPostsLink).toHaveAttribute("href", expectedAllPostsHref);
    });

    test("stories section shows featured stories and links to /stories", async ({ page }: { page: Page; }) => {
        // Arrange
        const section = page.locator('section[data-section="stories"]');
        const featuredStoriesSection = section.getByRole("heading", { name: "Featured Stories" });
        const allStoriesLink = section.getByRole("link", { name: "All stories" });
        const expectedAllStoriesHref = "/stories";
        
        // Act & Assert
        await expect(section).toBeVisible();
        await expect(featuredStoriesSection).toBeVisible();
        await expect(allStoriesLink).toHaveAttribute("href", expectedAllStoriesHref);
    });

    test("software section shows projects and links to /software", async ({ page }: { page: Page; }) => {
        // Arrange
        const section = page.locator('section[data-section="software"]');
        const softwareProjectsSection = section.getByRole("heading", { name: "Software Projects" });
        const allSoftwareProjectsLink = section.getByRole("link", { name: "All projects" });
        const expectedAllSoftwareProjectsHref = "/software";
        
        // Act & Assert
        await expect(section).toBeVisible();
        await expect(softwareProjectsSection).toBeVisible();
        await expect(allSoftwareProjectsLink).toHaveAttribute("href", expectedAllSoftwareProjectsHref);
    });

    test("backpacking section shows latest trails and links to /backpacking", async ({ page }: { page: Page; }) => {
        // Arrange
        const section = page.locator('section[data-section="backpacking"]');
        const latestTrailsSection = section.getByRole("heading", { name: "Latest trails" });
        const allTrailsLink = section.getByRole("link", { name: "All trails" });
        const expectedAllTrailsHref = "/backpacking";

        // Act & Assert
        await expect(section).toBeVisible();
        await expect(latestTrailsSection).toBeVisible();
        await expect(allTrailsLink).toHaveAttribute("href", expectedAllTrailsHref);
    });
});
