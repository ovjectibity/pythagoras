import Anthropic from "@anthropic-ai/sdk";
import { ModelMessage, 
    UserModelMessage, 
    AssistantModelMessage, 
    FigmaDesignToolInput} from "./messages";
import { Command } from "./messages.js";
import { Tool as AnthTool } from "@anthropic-ai/sdk/resources";
import { BetaContentBlockParam, BetaMessageParam } from "@anthropic-ai/sdk/resources/beta.mjs";
import { FigmaDesignToolZ, FigmaDesignToolSchema } from "./figmatoolschema.js";
import { ModelMessageSchema, ModelMessageZ } from "./messagesschema.js";
import { prompts } from "./prompts.js";

interface CommandExecutor {
    executeCommands(cmds: Command[]): Promise<void>;
    executeCommand(cmd: Command): Promise<void>;
}

class FigmaAgentThread {
    maxTokens = 1024;
    model: string;
    modelClient: Anthropic;
    messages: Array<ModelMessage>;
    anthMessages: Array<BetaMessageParam>;
    executor: CommandExecutor;
    running: boolean = false;
    id: number;

    constructor(id: number, model: string, 
        apiKey: string, 
        executor: CommandExecutor) {
        this.id = id;
        this.model = model;
        this.modelClient = new Anthropic({
            apiKey: apiKey,
        });
        this.executor = executor;
        this.messages = new Array();
        this.anthMessages = new Array();
    }

    static getTools(): Array<AnthTool> {
        return [{
            type: "custom",
            description: FigmaDesignToolZ.description,
            input_schema: FigmaDesignToolSchema,
            name: "figma-design-tool"
        }];
    }

    static translateToAnthMessage(msg: ModelMessage): BetaMessageParam {
        let contentBlocks: Array<BetaContentBlockParam> = new Array();
        for(const content of msg.contents) {
            contentBlocks.push({
                type: "text",
                text: JSON.stringify(content)
            });
        }
        return {
            role: msg.role,
            content: contentBlocks
        }
    }

    async evokeModel(msg: UserModelMessage): Promise<void> {
        const modelOutput = await this.modelClient.beta.messages.create({
            model: this.model,
            max_tokens: this.maxTokens,
            betas: ["structured-outputs-2025-11-13"],
            messages: this.anthMessages,
            system: prompts.system_prompt,
            tools: FigmaAgentThread.getTools(),
            output_format: {
                type: "json_schema",
                schema: ModelMessageSchema
            }
        });
        if(modelOutput.stop_reason === "end_turn" || 
            modelOutput.stop_reason === "tool_use") {
            return this.processModelOutput(modelOutput.content);
        } else {
            return Promise.reject(new Error(`Recieved an unexpected stop ` + 
                `reason from the model ${modelOutput.stop_reason}`));
        }
    }

    async processModelOutput(modelOutput: Array<BetaContentBlockParam>): Promise<void> {
       for(let content of modelOutput) {
            if(content.type === "tool_use") {
                if(content.name === "figma-design-tool") {
                    let id = content.id;
                    let input = content.input as FigmaDesignToolInput;
                    let cmdsResult = await this.executor.executeCommands(input.commands);
                    this.evokeModel({
                        role: "user",
                        contents: []
                    });
                } else {
                    console.warn(`Unexpected tool invoked by the model ${content}`)
                }
            } else if(content.type === "text") {
                try {
                    let modifiedp: any = JSON.parse(content.text);
                    // Validate using Zod
                    const validationResult = ModelMessageZ.safeParse(modifiedp);
                    if(validationResult.success) {
                        // console.log("Model output conforms to the schema, got this messages array: ",
                        // modifiedp.messages);
                        let modifiedpv: AssistantModelMessage = modifiedp as AssistantModelMessage;
                        this.messages.push(modifiedpv);
                        this.anthMessages.push(FigmaAgentThread.translateToAnthMessage(modifiedpv));
                        //TODO: Handle text to be surfaced to the user & that to be consumed by the agent 
                    } else {
                        console.log("Model output message does not conform to the schema");
                        console.log("Validation errors:", validationResult.error);
                        console.log(`Received data: ${content.text}`);
                    }
                } catch(e) {
                    console.log(`Parsing model output as JSON probably failed. Got LLM output ${content.text}`);
                    console.log("Error when processing LLM response", e);
                }
            } else if(content.type === "thinking") {

            } else {

            }
        }
    }

    async ingestUserInput(message: string): Promise<void> {
        if(this.running) {
            console.warn(`User messages when the model is running currently not supported. ` + 
                `Ignoring this ${message}`);
        } else {
            const userMessage = {
                role: "user",
                contents: [{
                    type: "user_input",
                    content: ""
                }]
            } satisfies UserModelMessage;
            this.messages.push(userMessage);
            this.anthMessages.push(FigmaAgentThread.translateToAnthMessage(userMessage));
            const modelOutput = await this.modelClient.beta.messages.create({
                model: this.model,
                max_tokens: this.maxTokens,
                betas: ["structured-outputs-2025-11-13"],
                messages: this.anthMessages,
                system: prompts.system_prompt,
                tools: FigmaAgentThread.getTools(),
                output_format: {
                    type: "json_schema",
                    schema: ModelMessageSchema
                }
            });
            if(modelOutput.stop_reason === "end_turn" || 
                modelOutput.stop_reason === "tool_use") {
                return this.processModelOutput(modelOutput.content);
            } else {
                return Promise.reject(new Error(`Recieved an unexpected stop ` + 
                    `reason from the model ${modelOutput.stop_reason}`));
            }
        }
    }
}