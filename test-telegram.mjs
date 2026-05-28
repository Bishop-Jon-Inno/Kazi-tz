import * as dotenv from "dotenv"
dotenv.config()

const token = process.env.TELEGRAM_BOT_TOKEN
const chatId = process.env.TELEGRAM_CHAT_ID

console.log("Token found:", !!token)
console.log("Chat ID found:", !!chatId)

const response = await fetch(
  `https://api.telegram.org/bot${token}/sendMessage`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: "KaziTZ notification system is working!",
      parse_mode: "HTML"
    })
  }
)

const data = await response.json()
console.log("Result:", data.ok ? "Message sent successfully!" : data.description)