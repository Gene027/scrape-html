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

    const productImgUrls: string[] = await page.$$eval(imagesSelector, (imgs: any[]) =>
      imgs.map((img: { src: any }) => img.src)
    );

    const productRatings: string[] = await page.$$eval(ratingSelector, (ratings: any[]) =>
      ratings.map((r: { getAttribute: (arg0: string) => any }) => r.getAttribute("data-value"))
    );

    const productPrices: string[] = await page.$$eval(pricesSelector, (prices: any[]) =>
      prices.map((p: { innerText: any }) => p.innerText)
    );

    const productDesc: string[] = await page.$$eval(descriptionSelector, (descs: any[]) =>
      descs.map((d: { innerText: any }) => d.innerText)
    );

    const productReviewCounts: string[] = await page.$$eval(reviewSelector, (reviews: any[]) =>
      reviews.map((r: { innerText: any }) => r.innerText)
    );

    const data = [productPrices, productDesc, productImgUrls];

    const arrayLengths = data.map((array) => array.length);
    const allArraysHaveSameLength = arrayLengths.every((length) => length === arrayLengths[0]);

    if (allArraysHaveSameLength) {
      console.log("Data is consistent and can map correctly");
    } else {
      console.log("Data is inconsistent and cannot map correctly");
      console.log(
        `productPrices: ${productPrices.length} productTitles: ${productDesc.length} productImgUrls: ${productImgUrls.length} productReviewCounts: ${productReviewCounts.length} productRatings: ${productRatings.length}`
      );
      console.log(data);
    }

    const products: Record<string, string>[] = [];
    for (let i = 0; i < productDesc.length; i++) {
      products.push({
        description: productDesc[i],
        price: productPrices[i],
        imageUrl: productImgUrls[i],
        reviews: productReviewCounts[i] || "N/A",
        rating: productRatings[i] || "N/A",
        resource,
      });
    }

    const result = await appendToExcel(products, true);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error scraping HTML");
  } finally {
    await browser.close();
    console.log("Browser closed");
  }
}
