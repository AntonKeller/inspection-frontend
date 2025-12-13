import {z} from "zod";
import {DocumentModelSchema} from "./Document-Model.js";

export const PhotoBaseSchema = z.object({
    description: z.string().nullable(),
    fieldName: z.string().nullable(),
    originalName: z.string().nullable(),
    encoding: z.string().nullable(),
    mimetype: z.string().nullable(),
    destination: z.string().nullable(),
    filename: z.string().nullable(),
    path: z.string().nullable(),
    size: z.number().nullable(),
});

export const PhotoIdSchema = z.object({
    objectAngleId: z.string().nullable(), // Принадлежность к ракурсу объекта
});

export const PhotoModelSchema = PhotoBaseSchema
    .extend(PhotoIdSchema.shape)
    .extend(DocumentModelSchema.shape);


export type PhotoBase = z.infer<typeof PhotoBaseSchema>;
export type PhotoModel = z.infer<typeof PhotoModelSchema>;
