"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chat = action({
  args: {
    message: v.string(),
    documentContent: v.string(),
    knowledgeContext: v.array(v.object({
      title: v.string(),
      content: v.string(),
    })),
    chatHistory: v.array(v.object({
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
    })),
  },
  handler: async (_ctx, args) => {
    // Build knowledge context string
    let knowledgeStr = "";
    if (args.knowledgeContext.length > 0) {
      knowledgeStr = "\n\n## Reference Knowledge:\n" + 
        args.knowledgeContext.map((k) => `### ${k.title}\n${k.content}`).join("\n\n");
    }

    const systemPrompt = `You are an intelligent writing assistant helping users write documents, particularly research papers and academic content. You have access to the user's current document and any reference knowledge they've added.

Current Document Content:
---
${args.documentContent || "(Empty document)"}
---
${knowledgeStr}

Your role is to:
1. Help write, edit, and improve the document based on user requests
2. Use the reference knowledge to inform your suggestions and writing
3. Maintain the document's style and tone
4. Provide helpful suggestions for structure, citations, and content
5. When asked to write something, provide the text that can be directly inserted into the document

Always be helpful, precise, and maintain academic standards when appropriate. If the user asks you to write something, provide clear, well-structured content that matches the document's style.`;

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...args.chatHistory.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user", content: args.message },
    ];

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      });

      return {
        content: response.choices[0]?.message?.content || "I couldn't generate a response.",
        success: true,
      };
    } catch (error) {
      console.error("OpenAI API error:", error);
      return {
        content: "Sorry, I encountered an error. Please check your API key configuration.",
        success: false,
      };
    }
  },
});

export const generateText = action({
  args: {
    prompt: v.string(),
    documentContent: v.string(),
    knowledgeContext: v.array(v.object({
      title: v.string(),
      content: v.string(),
    })),
    insertionPoint: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    // Build knowledge context string
    let knowledgeStr = "";
    if (args.knowledgeContext.length > 0) {
      knowledgeStr = "\n\n## Reference Knowledge:\n" + 
        args.knowledgeContext.map((k) => `### ${k.title}\n${k.content}`).join("\n\n");
    }

    const systemPrompt = `You are a professional writing assistant. Generate text based on the user's request that fits seamlessly into their document.

Current Document Content:
---
${args.documentContent || "(Empty document)"}
---
${knowledgeStr}

${args.insertionPoint ? `The text will be inserted at: "${args.insertionPoint}"` : ""}

Generate ONLY the requested text, without any explanation or preamble. The text should be ready to insert directly into the document.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: args.prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      return {
        content: response.choices[0]?.message?.content || "",
        success: true,
      };
    } catch (error) {
      console.error("OpenAI API error:", error);
      return {
        content: "",
        success: false,
        error: "Failed to generate text. Please check your API key.",
      };
    }
  },
});
