import {TargetObjectAngleBaseSchema, TargetObjectAngleIdSchema} from "../Models/TargetObjectAngle-Model.js";
import {DocumentModelSchema} from "../Models/Document-Model.js";
import {z} from "zod";


export const TargetObjectAngleCreateSchemaDTO = TargetObjectAngleBaseSchema
    .extend(TargetObjectAngleIdSchema.shape);

export const TargetObjectAngleUpdateSchemaDTO = TargetObjectAngleBaseSchema
    .extend(TargetObjectAngleIdSchema.shape).partial();

export const TargetObjectAngleResponseSchemaDTO = TargetObjectAngleBaseSchema
    .extend(TargetObjectAngleIdSchema.shape)
    .extend(DocumentModelSchema.shape);


export type TargetObjectAngleCreateDTO = z.infer<typeof TargetObjectAngleCreateSchemaDTO>;
export type TargetObjectAngleUpdateDTO = z.infer<typeof TargetObjectAngleUpdateSchemaDTO>;
export type TargetObjectAngleResponseDTO = z.infer<typeof TargetObjectAngleResponseSchemaDTO>;