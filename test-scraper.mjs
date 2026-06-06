import * as dotenv from "dotenv"
dotenv.config()

import { createRequire } from "module"
const require = createRequire(import.meta.url)

require("ts-node").register({
  project: "./tsconfig.seed.json",
  transpileOnly: true
})

const { scrapeMabumbe } = require("./lib/scrapers/mabumbe.ts")

console.log("Starting Mabumbe scraper test...")
const result = await scrapeMabumbe()
console.log("Result:", JSON.stringify(result))