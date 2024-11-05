import type { AIMessage } from "../types";
import { openai } from "./ai";

export const runLM = async ({messages}: {messages: AIMessage[]}) => {
    const response = await openai.chat.completions.create({
        model:"gpt-4o-mini",
        temperature: 0.1,
        messages
    })

    return response.choices[0].message.content
}
