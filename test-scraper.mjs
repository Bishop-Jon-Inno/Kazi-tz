import * as dotenv from "dotenv"
dotenv.config()

// Register ts-node to handle TypeScript files
import { createRequire } from "module"
const require = createRequire(import.meta.url)

require("ts-node").register({
  project: "./tsconfig.seed.json",
  transpileOnly: true
})

const { scrapeTanzajob } = require("./lib/scrapers/tanzajob.ts")

console.log("Starting Tanzajob scraper...")
const result = await scrapeTanzajob()
console.log("Result:", JSON.stringify(result))