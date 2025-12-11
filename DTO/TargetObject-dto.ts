import {TargetObjectBaseSchema, TargetObjectIdSchema} from "../Models/TargetObject-Model.js";
import {DocumentModelSchema} from "../Models/Document-Model.js";
import {z} from "zod";


export const TargetObjectCreateSchemaDTO = TargetObjectBaseSchema
    .extend(TargetObjectIdSchema.shape);

export const TargetObjectUpdateSchemaDTO = TargetObjectBaseSchema
    .extend(TargetObjectIdSchema.shape).partial();

export const TargetObjectResponseSchemaDTO = TargetObjectBaseSchema
    .extend(TargetObjectIdSchema.shape)
    .extend(DocumentModelSchema.shape);


export type TargetObjectCreateDTO = z.infer<typeof TargetObjectCreateSchemaDTO>;
export type TargetObjectUpdateDTO = z.infer<typeof TargetObjectUpdateSchemaDTO>;
export type TargetObjectResponseDTO = z.infer<typeof TargetObjectResponseSchemaDTO>;

