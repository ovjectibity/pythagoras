import { z } from 'zod';
import type { FigmaDesignToolInput } from './messages';

const CreateRectangleZ = z.object({
  type: z.literal("create-rectangle")
});

const GetLayerVisualZ = z.object({
  type: z.literal("get-layer-visual")
});

const MoveLayerZ = z.object({
  type: z.literal("move-layer"),
  x: z.number(),
  y: z.number()
});

const ClosePluginZ = z.object({
  type: z.literal("close_plugin")
});

const CommandZ = z.discriminatedUnion("type", [
  GetLayerVisualZ,
  CreateRectangleZ,
  ClosePluginZ,
  MoveLayerZ
]);

export const FigmaDesignToolZ = z.object({
  commands: z.array(CommandZ),
  objective: z.string()
}).describe("View and modify a user-owned Figma Design files using this tool") satisfies z.ZodType<FigmaDesignToolInput>;

export const FigmaDesignToolSchema = z.toJSONSchema(FigmaDesignToolZ) as any;
