import puppeteer from "puppeteer";

export function getBrowser() {
    return puppeteer.launch({
        headless: false,
    })
}