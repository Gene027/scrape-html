import { appendToExcel } from "@/src/utils/excel";
import { NextResponse } from "next/server";
import {
  frozenFoodsQuery,
  walmartHtmlPages,
  walmartHtmlProductSelectors,
  walmartProductSelectors,
} from "../../../constants";
import * as path from "path";
const formidable = require("formidable");
const fs = require("fs/promises");
const puppeteer = require("puppeteer");

export const config = {
  api: {
    bodyParser: false,
  },
};

type ResponseData = {
  message: string;
};

export const POST = (req: Request, context: any) => {
  const uploadDir = "../../../../public";
  const form = new formidable.IncomingForm();
  form.uploadDir = uploadDir;
  form.keepExtensions = true;
  form.multiples = false;

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  form.parse(req, (err: any, fields: any, files: { file: any; }) => {
    if (err) {
      NextResponse.error();
      return;
    }

    const file = files.file;

    const oldPath = file.filepath;
    const newPath = path.join(uploadDir, file.originalFilename);

    fs.rename(oldPath, newPath, (err: any) => {
      if (err) {
        NextResponse.error();
        return;
      }
      console.log('File uploaded successfully:', newPath);
    });
  });

  return NextResponse.json<ResponseData>({ message: "Scraping complete!" });
};

async function scrapeHtml() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const { productUrl, resource, category, subCategory } = walmartHtmlPages[0];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1024 });

    const { descriptionSelector, imagesSelector, pricesSelector, ratingSelector, reviewSelector } =
      walmartHtmlProductSelectors;

    await page.goto(`file:${path.join(__dirname, "..", "..", productUrl)}`, {
      waitUntil: "networkidle0",
      timeout: 2 * 60 * 1000,
    });

    console.log(`Navigated to ${productUrl}`);

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
      return data;
    }

    const products: Record<string, string>[] = [];
    for (let i = 0; i < productDesc.length; i++) {
      products.push({
        description: productDesc[i],
        price: productPrices[i],
        imageUrl: productImgUrls[i],
        reviews: productReviewCounts[i] || "N/A",
        rating: productRatings[i] || "N/A",
        category,
        subCategory,
        resource,
      });
    }

    await appendToExcel(products);

    await browser.close();
    console.log("Browser closed");
  } catch (error) {
    console.log(error);
    throw new Error("Error scraping HTML");
  } finally {
    await browser.close();

    try {
      await fs.unlink(productUrl);
      console.log("File deleted successfully:", productUrl);
    } catch (error) {
      console.error("Error deleting the file:", productUrl, error);
    }
  }
}
