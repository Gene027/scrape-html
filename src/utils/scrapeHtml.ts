import { appendToExcel } from "@/src/utils/excel";
import {
  frozenFoodsQuery,
  walmartHtmlPages,
  walmartHtmlProductSelectors,
  walmartProductSelectors,
} from "../constants";
const puppeteer = require("puppeteer");

export async function scrapeHtml(html: string) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const { resource, category, subCategory } = walmartHtmlPages[0];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1024 });

    const { descriptionSelector, imagesSelector, pricesSelector, ratingSelector, reviewSelector } =
      walmartHtmlProductSelectors;

    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 2 * 60 * 1000,
    });

    // await page.screenshot({
    //   type: "jpeg",
    //   path: "screenshot.jpeg",
    //   fullPage: true,
    // });

    // return;

    const rawProducts = await page.evaluate(() => {
      const items: any[] = [];
      document.querySelectorAll('[data-testid="list-view"]').forEach((element) => {
        const titleElement: any = element.querySelector('[data-automation-id="product-title"]');
        const priceElement: any = element.querySelector(
          '[data-automation-id="product-price"] span.f2'
        );

        const imageElement: any = element.querySelector('[data-testid="productTileImage"]');

        const ratingElement: any = element.querySelector('[data-testid="product-ratings"]');
        const reviewElement: any = element.querySelector('[data-testid="product-reviews"]');
        if (titleElement && priceElement) {
          const title = titleElement.innerText;
          const price = priceElement.innerText;
          const image = imageElement.getAttribute("src");
          const rating = ratingElement.getAttribute("data-value");
          const review = reviewElement.innerText;

          if (title && price) {
            items.push({
              title,
              price,
              image,
              rating,
              review,
            });
          }
        }
      });

      return items;
    });

    if (rawProducts.length === 0) {
      throw new Error("No products found");
    }

    const result = await appendToExcel(rawProducts, true);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await browser.close();
    console.log("Browser closed");
  }
}
