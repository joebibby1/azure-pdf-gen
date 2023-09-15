import { handleError } from '../lib/helpers.js';
import puppeteer from 'puppeteer';

// eslint-disable-next-line no-unused-vars
export default async (context, req) => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();

    await page.setContent(req.body, { waitUntil: 'networkidle2' });

    const pdf = await page.pdf({ format: 'A4' });

    await browser.close();

    const base64 = pdf.toString('base64');

    context.res = {
      status: 200,
      body: base64,
    };
  } catch (error) {
    handleError(error, context);
    context.res = {
      status: 500,
      body: JSON.stringify({
        status: 500,
        error,
      }),
    };
  }
};
