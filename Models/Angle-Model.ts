import {z} from "zod";
import {DocumentModelSchema} from "./Document-Model.js";


export const AngleBaseSchema = z.object({
    name: z.string().nullable()   // Наименование ракурса осматриваемого объекта
});

export const AngleIdSchema = z.object({
    objectTypeId: z.string().nullable()   // ID типа объекта, которому принадлежит ракурс
});

export const AngleModelSchema = AngleBaseSchema
    .extend(AngleIdSchema.shape)
    .extend(DocumentModelSchema.shape)


export type AngleBase = z.infer<typeof AngleBaseSchema>;
export type AngleModel = z.infer<typeof AngleModelSchema>;