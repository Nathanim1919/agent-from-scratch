import { zodFunction } from 'openai/helpers/zod.mjs'
import type { AIMessage } from '../types'
import { openai } from './ai'
import { ZodFunction } from 'zod'

export const runLLM = async ({
  messages,
  tools,
}: {
  messages: AIMessage[]
  tools: any[]
}) => {
 // zodFunction is a helper function that converts a tool object to a zod object, what this does is that it tells the model what tool to use for the job

  const formattedTools = tools.map(zodFunction) // we are converting the tools to zod objects, zo objects are used to provide additional context to the model
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.1,
    messages,
    tools: formattedTools,
    // tools are used to provide additional context to the model, so when we are saying that we are using the 'auto' tool_choice, we are telling the model to choose the best tool for the job
    // e.g. if we are asking the model to write a poem, the model will choose the best tool for writing poems
    // if we are asking the model to write a code, the model will choose the best tool for writing code
    tool_choice: 'auto',
    // we are telling the model to not use parallel tool calls, this is because we are using the 'auto' tool_choice
    // if we are using the 'manual' tool_choice, we can use parallel tool calls to provide additional context to the model
    // what does parallel tool calls do? it allows the model to use multiple tools at the same time
    parallel_tool_calls: false, // i dont want this to call multiple tools at the same time
  })
 // 
  return response.choices[0].message
}
