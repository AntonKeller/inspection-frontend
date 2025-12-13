import {PhotoBaseSchema, PhotoIdSchema} from "../Models/Photo-Model";
import {z} from "zod";
import {DocumentModelSchema} from "../Models/Document-Model";


export const PhotoCreateSchemaDTO = PhotoBaseSchema
    .extend(PhotoIdSchema.shape);

export const PhotoUpdateSchemaDTO = PhotoBaseSchema
    .extend(PhotoIdSchema.shape).partial();

export const PhotoResponseSchemaDTO = PhotoBaseSchema
    .extend(PhotoIdSchema.shape)
    .extend(DocumentModelSchema.shape);


export type PhotoCreateDTO = z.infer<typeof PhotoCreateSchemaDTO>;
export type PhotoUpdateDTO = z.infer<typeof PhotoUpdateSchemaDTO>;
export type PhotoResponseDTO = z.infer<typeof PhotoResponseSchemaDTO>;