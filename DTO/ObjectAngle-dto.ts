import {ObjectAngleBaseSchema, ObjectAngleIdSchema} from "../Models/ObjectAngle-Model";
import {DocumentModelSchema} from "../Models/Document-Model";
import {z} from "zod";


export const ObjectAngleCreateSchemaDTO = ObjectAngleBaseSchema
    .extend(ObjectAngleIdSchema.shape);

export const ObjectAngleUpdateSchemaDTO = ObjectAngleBaseSchema
    .extend(ObjectAngleIdSchema.shape).partial();

export const ObjectAngleResponseSchemaDTO = ObjectAngleBaseSchema
    .extend(ObjectAngleIdSchema.shape)
    .extend(DocumentModelSchema.shape);


export type ObjectAngleCreateDTO = z.infer<typeof ObjectAngleCreateSchemaDTO>;
export type ObjectAngleUpdateDTO = z.infer<typeof ObjectAngleUpdateSchemaDTO>;
export type ObjectAngleResponseDTO = z.infer<typeof ObjectAngleResponseSchemaDTO>;