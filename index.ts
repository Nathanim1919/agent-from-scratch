import 'dotenv/config'
import { runLM } from './src/llm'
import dotenv from 'dotenv'
import { addMessages, getMessages } from './src/memory'

dotenv.config()

const userMessage = process.argv[2]

if (!userMessage) {
  console.error('Please provide a message')
  process.exit(1)
}

await addMessages([{ content: userMessage, role: 'user' }])
const messages = await getMessages()

const response = await runLM({
  messages,
})

await addMessages([{ role: 'assistant', content: response }])

console.log(response)
