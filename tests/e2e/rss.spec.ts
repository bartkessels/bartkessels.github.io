import { type APIRequestContext, expect, test } from "@playwright/test";

test.describe("rss.xml", () => {
    let response: Awaited<ReturnType<APIRequestContext["get"]>>;
    let body: string;

    test.beforeEach(async ({ request }: { request: APIRequestContext }) => {
        response = await request.get("/rss.xml");
        body = await response.text();
    });

    test("returns a 200 status", async () => {
        // Act & Assert
        expect(response.status()).toBe(200);
    });

    test("has the correct content-type header", async () => {
        // Arrange
        const expectedContentType = "application/rss+xml";

        // Act & Assert
        expect(response.headers()["content-type"]).toContain(expectedContentType);
    });

    test("contains the RSS 2.0 root element", async () => {
        // Arrange
        const expectedRssElement = '<rss version="2.0">';

        // Act & Assert
        expect(body).toContain(expectedRssElement);
    });

    test("contains the channel title", async () => {
        // Arrange
        const expectedTitle = "<title>Bart Kessels</title>";

        // Act & Assert
        expect(body).toContain(expectedTitle);
    });

    test("contains the channel link to the site", async () => {
        // Arrange
        const expectedLink = "<link>https://bartkessels.net</link>";

        // Act & Assert
        expect(body).toContain(expectedLink);
    });

    test("contains the channel description", async () => {
        // Arrange
        const expectedDescription = "Software Developer";

        // Act & Assert
        expect(body).toContain(expectedDescription);
    });

    test("contains at least one item with a title, link, and pubDate", async () => {
        // Act & Assert
        expect(body).toContain("<item>");
        expect(body).toContain("<title>");
        expect(body).toContain("<link>");
        expect(body).toContain("<pubDate>");
    });
});
