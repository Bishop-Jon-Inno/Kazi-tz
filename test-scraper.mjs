import * as dotenv from "dotenv"
dotenv.config()

import { createRequire } from "module"
const require = createRequire(import.meta.url)

require("ts-node").register({
  project: "./tsconfig.seed.json"
})

const { scrapeTanzajob } = require("./lib/scrapers/tanzajob.ts")

console.log("Starting Tanzajob scraper test...")
const result = await scrapeTanzajob()
console.log("Result:", result)