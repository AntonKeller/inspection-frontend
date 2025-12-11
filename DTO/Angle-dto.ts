import {AngleBaseSchema, AngleIdSchema} from "../Models/Angle-Model.js";
import {DocumentModelSchema} from "../Models/Document-Model.js";
import {z} from "zod";


export const AngleCreateSchemaDTO = AngleBaseSchema
    .extend(AngleIdSchema.shape);

export const AngleUpdateSchemaDTO = AngleBaseSchema
    .extend(AngleIdSchema.shape).partial();

export const AngleResponseSchemaDTO = AngleBaseSchema
    .extend(AngleIdSchema.shape)
    .extend(DocumentModelSchema.shape);


export type AngleCreateDTO = z.infer<typeof AngleCreateSchemaDTO>;
export type AngleUpdateDTO = z.infer<typeof AngleUpdateSchemaDTO>;
export type AngleResponseDTO = z.infer<typeof AngleResponseSchemaDTO>;
