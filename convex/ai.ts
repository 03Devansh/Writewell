"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import OpenAI from "openai";

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
    selectedContext: v.optional(v.array(v.string())), // Optional array of selected text context
    aiInstructions: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    try {
      // Validate API key
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.error("OPENAI_API_KEY is not set");
        return {
          content: "OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.",
          success: false,
        };
      }

      // Initialize OpenAI client
      const openai = new OpenAI({
        apiKey: apiKey,
      });

      // Validate inputs
      if (!args.message || args.message.trim().length === 0) {
        return {
          content: "Please provide a message.",
          success: false,
        };
      }

      // Build knowledge context string
      let knowledgeStr = "";
      if (args.knowledgeContext && args.knowledgeContext.length > 0) {
        knowledgeStr = "\n\n## Reference Knowledge:\n" + 
          args.knowledgeContext.map((k) => `### ${k.title}\n${k.content}`).join("\n\n");
      }

      // Build selected context string
      let selectedContextStr = "";
      if (args.selectedContext && args.selectedContext.length > 0) {
        selectedContextStr = "\n\n## Selected Text Context (user wants you to focus on these parts):\n" +
          args.selectedContext.map((text, index) => `${index + 1}. ${text}`).join("\n\n");
      }

      // Build AI instructions string
      const aiInstructionsStr = args.aiInstructions && args.aiInstructions.trim().length > 0
        ? `\n\n## Writing Instructions:\n${args.aiInstructions.trim()}`
        : "";

      // Truncate document content if too long (to avoid token limits)
      const maxDocumentLength = 50000; // characters
      const documentContent = args.documentContent || "(Empty document)";
      const truncatedDocument = documentContent.length > maxDocumentLength 
        ? documentContent.substring(0, maxDocumentLength) + "... [truncated]"
        : documentContent;

      const systemPrompt = `You are an intelligent writing assistant helping users write documents, particularly research papers and academic content. You have access to the user's current document and any reference knowledge they've added.

Current Document Content:
---
${truncatedDocument}
---
${knowledgeStr}${selectedContextStr}${aiInstructionsStr}

Your role is to:
1. Help write, edit, and improve the document based on user requests
2. Use the reference knowledge to inform your suggestions and writing
3. Pay special attention to any selected text context the user has highlighted
4. Maintain the document's style and tone
5. Provide helpful suggestions for structure, citations, and content
6. When asked to write something, provide the text that can be directly inserted into the document

Always be helpful, precise, and maintain academic standards when appropriate. If the user asks you to write something, provide clear, well-structured content that matches the document's style.`;

      // Build messages array with validation
      const messages: OpenAI.ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt },
      ];

      // Add chat history (filter out empty messages)
      if (args.chatHistory && args.chatHistory.length > 0) {
        for (const msg of args.chatHistory) {
          if (msg.content && msg.content.trim().length > 0) {
            messages.push({
              role: msg.role as "user" | "assistant",
              content: msg.content,
            });
          }
        }
      }

      // Add current message
      messages.push({ role: "user", content: args.message.trim() });

      // Make API call
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return {
          content: "I couldn't generate a response. Please try again.",
          success: false,
        };
      }

      return {
        content: content,
        success: true,
      };
    } catch (error) {
      console.error("AI chat error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error details:", errorMessage);
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      
      // Provide more specific error messages
      if (errorMessage.includes("API key") || errorMessage.includes("authentication") || errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
        return {
          content: "Sorry, I encountered an authentication error. Please check your OpenAI API key configuration.",
          success: false,
        };
      }
      
      if (errorMessage.includes("rate limit") || errorMessage.includes("429")) {
        return {
          content: "Rate limit exceeded. Please wait a moment and try again.",
          success: false,
        };
      }

      if (errorMessage.includes("token") || errorMessage.includes("length") || errorMessage.includes("too long")) {
        return {
          content: "The message or document is too long. Please try with a shorter message or document.",
          success: false,
        };
      }
      
      return {
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again or contact support if the issue persists.`,
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
    aiInstructions: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    try {
      // Validate API key
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.error("OPENAI_API_KEY is not set");
        return {
          content: "",
          success: false,
          error: "OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.",
        };
      }

      // Initialize OpenAI client
      const openai = new OpenAI({
        apiKey: apiKey,
      });

      // Validate inputs
      if (!args.prompt || args.prompt.trim().length === 0) {
        return {
          content: "",
          success: false,
          error: "Please provide a prompt.",
        };
      }

      // Build knowledge context string
      let knowledgeStr = "";
      if (args.knowledgeContext && args.knowledgeContext.length > 0) {
        knowledgeStr = "\n\n## Reference Knowledge:\n" + 
          args.knowledgeContext.map((k) => `### ${k.title}\n${k.content}`).join("\n\n");
      }

      // Build AI instructions string
      const aiInstructionsStr = args.aiInstructions && args.aiInstructions.trim().length > 0
        ? `\n\n## Writing Instructions:\n${args.aiInstructions.trim()}`
        : "";

      // Truncate document content if too long
      const maxDocumentLength = 50000;
      const documentContent = args.documentContent || "(Empty document)";
      const truncatedDocument = documentContent.length > maxDocumentLength 
        ? documentContent.substring(0, maxDocumentLength) + "... [truncated]"
        : documentContent;

      const systemPrompt = `You are a professional writing assistant. Generate text based on the user's request that fits seamlessly into their document.

Current Document Content:
---
${truncatedDocument}
---
${knowledgeStr}${aiInstructionsStr}

${args.insertionPoint ? `The text will be inserted at: "${args.insertionPoint}"` : ""}

Generate ONLY the requested text, without any explanation or preamble. The text should be ready to insert directly into the document.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: args.prompt.trim() },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      const content = response.choices[0]?.message?.content || "";
      return {
        content: content,
        success: true,
      };
    } catch (error) {
      console.error("OpenAI API error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes("API key") || errorMessage.includes("authentication") || errorMessage.includes("401")) {
        return {
          content: "",
          success: false,
          error: "Authentication error. Please check your OpenAI API key configuration.",
        };
      }
      
      return {
        content: "",
        success: false,
        error: `Failed to generate text: ${errorMessage}`,
      };
    }
  },
});
