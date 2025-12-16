export interface CreateRectangle {
  type: "create-rectangle"
}

export interface GetLayerVisual {
  type: "get-layer-visual"
}

export interface MoveLayer {
    type: "move-layer",
    x: number,
    y: number,
}

export interface ClosePlugin {
    type: "close_plugin"
}

export type Commands = GetLayerVisual | CreateRectangle | ClosePlugin;

export interface IssueCommandResult {
    type: "issue_command_result",
    content: string
}

export interface UserInput {
    type: "user_input",
    content: string
}

export interface WorkflowInstruction {
    type: "workflow_instruction",
    content: string
}

export interface IssueCommand {
    type: "issue_command",
    content: Commands
}

export interface UserOutput {
    type: "user_output",
    content: string
}

export interface UserModelMessage {
    role: "user",
    contents: Array<IssueCommandResult | UserInput | WorkflowInstruction>
}

export interface AssistantModelMessage {
    role: "assistant",
    contents: Array<UserOutput | IssueCommand | WorkflowInstruction>
}

export type ModelMessage = UserModelMessage | AssistantModelMessage;