import type { AIMessage } from "../types"
import { addMessages, getMessages, saveToolResponse } from "./memory"
import { runLLM } from "./llm"
import { logMessage, showLoader } from "./ui"
import { runTool } from "./toolRunner"

export const runAgent = async ({userMessage, tools}:{userMessage: string, tools: any[]}) => {
    await addMessages([
        {
            "role": "user",
            "content": userMessage
        }
    ])

    const loader =  showLoader("Thining...")
    const history = await getMessages()

    const response = await runLLM({
        messages: history,
        tools
    });
    await addMessages([response])


    if (response.tool_calls){
        const toolCall = response.tool_calls[0] // why [0]? because we are only using one tool, if we are using multiple tools, we will have to loop through the tool_calls array
        loader.update(`executing: ${toolCall.function.name}`)

        const toolResponse = await runTool(toolCall, userMessage)
        
        await saveToolResponse(toolCall.id, toolResponse)
        loader.update(`executed: ${toolCall.function.name}`)
    }


    

    loader.stop()
    return getMessages()
}