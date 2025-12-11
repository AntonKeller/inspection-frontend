import {ObjectTypeBaseSchema, ObjectTypeIdSchema} from "../Models/ObjectType-Model.js";
import {DocumentModelSchema} from "../Models/Document-Model.js";
import {z} from "zod";


export const ObjectTypeCreateSchemaDTO = ObjectTypeBaseSchema
    .extend(ObjectTypeIdSchema.shape);

export const ObjectTypeUpdateSchemaDTO = ObjectTypeBaseSchema
    .extend(ObjectTypeIdSchema.shape).partial();

export const ObjectTypeResponseSchemaDTO = ObjectTypeBaseSchema
    .extend(ObjectTypeIdSchema.shape)
    .extend(DocumentModelSchema.shape);


export type ObjectTypeCreateDTO = z.infer<typeof ObjectTypeCreateSchemaDTO>;
export type ObjectTypeUpdateDTO = z.infer<typeof ObjectTypeUpdateSchemaDTO>;
export type ObjectTypeResponseDTO = z.infer<typeof ObjectTypeResponseSchemaDTO>;
