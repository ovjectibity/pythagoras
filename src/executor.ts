import { FigmaDesignToolEvokeStatus } from "./messages";
import { Command } from "./messages.js";

interface CommandExecutor {
    executeCommands(cmds: Command[]): Promise<FigmaDesignToolEvokeStatus>;
    executeCommand(cmd: Command): Promise<FigmaDesignToolEvokeStatus>;
}

class FigmaExecutor implements CommandExecutor {
    async executeCommands(cmds: Command[]): Promise<FigmaDesignToolEvokeStatus> {
        try {
            for (const cmd of cmds) {
                const result = await this.executeCommand(cmd);
                if (result.status === "failure") {
                    return result;
                }
            }
            return { status: "success" };
        } catch (error) {
            return {
                status: "failure",
                errorReason: error instanceof Error ? error.message : String(error)
            };
        }
    }

    async executeCommand(cmd: Command): Promise<FigmaDesignToolEvokeStatus> {
        try {
            switch (cmd.type) {
                case "create-rectangle": {
                    const rect = figma.createRectangle();
                    rect.x = cmd.x;
                    rect.y = cmd.y;
                    rect.resize(cmd.width, cmd.height);

                    if (cmd.fill) {
                        const rgb = this.hexToRgb(cmd.fill);
                        if (rgb) {
                            rect.fills = [{
                                type: 'SOLID',
                                color: { r: rgb.r / 255, g: rgb.g / 255, b: rgb.b / 255 }
                            }];
                        }
                    }

                    figma.currentPage.appendChild(rect);
                    return { status: "success" };
                }
                case "get-layer-visual": {
                    let node: SceneNode | null = null;
                    if (cmd.layerId) {
                        const foundNode = figma.currentPage.findOne(n => n.id === cmd.layerId);
                        if (foundNode) {
                            node = foundNode;
                        }
                    } else {
                        const selection = figma.currentPage.selection;
                        if (selection.length > 0) {
                            node = selection[0];
                        }
                    }
                    if (!node) {
                        return {
                            status: "failure",
                            errorReason: "No layer found to get visual"
                        };
                    }
                    let image = await node.exportAsync({ format: 'PNG' });
                    const base64Image = this.uint8ArrayToBase64(image);
                    return {
                        status: "success",
                        visual: base64Image
                    };
                }
                default:
                    return {
                        status: "failure",
                        errorReason: `Command type not implemented: ${(cmd as Command).type}`
                    };
            }
        } catch (error) {
            return {
                status: "failure",
                errorReason: error instanceof Error ? error.message : String(error)
            };
        }
    }

    private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    private uint8ArrayToBase64(bytes: Uint8Array): string {
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }
}

export type { CommandExecutor, FigmaExecutor };