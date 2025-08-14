import puppeteer from 'puppeteer'

// Generate a PDF Buffer from provided HTML content using Puppeteer
export async function generateOrderReceiptPdf(htmlContent) {
  let browser
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })
    await page.emulateMediaType('screen')
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
    })
    return pdfBuffer
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

