import { getBrowser } from "../services/puppeteer";
import OpenAI from "openai";
import ChatCompletionTool = OpenAI.ChatCompletionTool;

const schema: ChatCompletionTool = {
  type: "function",
  function: {
    name: "order_burgers",
    description: "Orders a burger to the restaurant 'Hundred'",
    parameters: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description:
            "Address of the user and the street number but without the door/puerta number",
        },
        doorNumber: {
          type: "number",
          description: "The door number of the user",
        },
        burgers: {
          type: "array",
          description: "List of burgers the user wants",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
                enum: [
                  "Paul Finch",
                  "Cheeseburger",
                  "Animal style",
                  "Leslie Chow",
                  "Loser",
                  "Satisfaction",
                  "Singular",
                  "Jonny Drama",
                  "La Madre de Stifler",
                  "Showdown",
                ],
                description: "Name of the burger without anymore information",
              },
              cookedLevel: {
                type: "string",
                enum: ["Poco hecha", "Al punto", "Muy hecha"],
                description:
                  "How cooked wants the user the burger. If not in the options choose the closest one",
              },
              amount: {
                type: "number",
                description: "Amount of specific burgers the user wants",
              },
            },
            required: ["amount", "cookedLevel", "name"],
          },
        },
      },
      required: ["name", "address", "amount", "doorNumber"],
    },
  },
};

interface ImplementationProps {
  address: string;
  doorNumber: string;
  burgers: {
    name: string;
    amount: number;
    cookedLevel: string;
  }[];
}

const implementation = async (order: ImplementationProps) => {
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.goto("https://hundredburgers.com/pide");
  await page.waitForNetworkIdle();

  const cookies = await page.waitForSelector(
    ".modal-body > .row > .col > button:nth-child(2)",
  );
  await cookies.click();

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const takeaway = await page.$('label[for="domicilio"]');
  await takeaway.click();

  await page.waitForSelector("input.addres_search");
  await page.type("input.addres_search", order.address);

  const search = await page.$("button.search-btn");
  await search.click();

  const option = await page.waitForSelector("div.dropp-body > label");
  await option.click();

  await page.waitForSelector("input.door-input");
  await page.type("input.door-input", String(order.doorNumber));

  await page.waitForSelector("button.submit");
  const startOrder = await page.$("button.submit");
  await startOrder.click();

  await page.waitForNetworkIdle();

  await page.waitForSelector(".card-title");

  const products = await page.$$("h5.card-title");
  const serializedProducts = await Promise.all(
    products.map((product) => product.evaluate((p) => p.textContent)),
  );

  for (const item of order.burgers) {
    const product = serializedProducts.findIndex(
      (p) => p.toLowerCase() === item.name.toLowerCase(),
    );

    if (product === -1) continue;

    await products[product].click();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const addButton = await page.$("button.edit-quantity:last-child");
    for (let i = 0; i < item.amount - 1; i++) {
      await addButton.click();
    }

    const options = {
      "poco hecha": 1,
      "al punto": 2,
      "muy hecha": 3,
    };

    const option = Object.entries(options).find(
      ([cooked]) => cooked === item.cookedLevel.toLowerCase(),
    );

    const cooked = await page.$(
      `.extra-info-block:nth-child(3) input[id="${option?.[1] ?? 2}"]`,
    );
    await cooked.click();

    const addToCart = await page.$("button.add-button");
    await addToCart.click();

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const closeCart = await page.$("button.close");
    await closeCart.click();
  }

  return (question: string) =>
    `Dile al usuario que ya se ha montado el pedido de la hamburguesería Hundred que ha hecho en esta petición y que solo falta que rellene los datos de pago en la web que se acaba de abrir, no le pidas más datos ${question}`;
};

export const getHundredTool = { schema, implementation };
