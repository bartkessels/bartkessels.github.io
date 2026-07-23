import { type APIRequestContext, expect, test } from "@playwright/test";

test.describe("llms.txt", () => {
    let response: Awaited<ReturnType<APIRequestContext["get"]>>;
    let body: string;

    test.beforeEach(async ({ request }: { request: APIRequestContext }) => {
        response = await request.get("/llms.txt");
        body = await response.text();
    });

    test("returns a 200 status", async () => {
        // Act & Assert
        expect(response.status()).toBe(200);
    });

    test("has the correct content-type header", async () => {
        // Arrange
        const expectedContentType = "text/plain";

        // Act & Assert
        expect(response.headers()["content-type"]).toContain(expectedContentType);
    });

    test("contains the site title in the header", async () => {
        // Arrange
        const expectedHeader = "bartkessels.net";

        // Act & Assert
        expect(body).toContain(expectedHeader);
    });

    test("contains the site description in the header", async () => {
        // Arrange
        const expectedPrefix = "> ";

        // Act & Assert
        expect(body).toContain(expectedPrefix);
    });

    test("contains a Sections heading with an /about link", async () => {
        // Arrange
        const expectedHeading = "## Sections";
        const expectedAboutLink = "/about";

        // Act & Assert
        expect(body).toContain(expectedHeading);
        expect(body).toContain(expectedAboutLink);
    });

    test("contains the Author section with the GitHub URL", async () => {
        // Arrange
        const expectedHeading = "## Author";
        const expectedGitHubUrl = "https://github.com/bartkessels";

        // Act & Assert
        expect(body).toContain(expectedHeading);
        expect(body).toContain(expectedGitHubUrl);
    });
});
