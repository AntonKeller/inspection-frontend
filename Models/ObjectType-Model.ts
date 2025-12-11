import {z} from "zod";
import {DocumentModelSchema} from "./Document-Model.js";


export const ObjectTypeBaseSchema = z.object({
    name: z.string().nullable()   // Наименование типа объекта
});

export const ObjectTypeIdSchema = z.object({
    templateId: z.string().nullable()   // Шаблон, которому принадлежит этот тип
});

export const ObjectTypeModelSchema = ObjectTypeBaseSchema
    .extend(ObjectTypeIdSchema.shape)
    .extend(DocumentModelSchema.shape);


export type ObjectTypeBase = z.infer<typeof ObjectTypeBaseSchema>;
export type ObjectTypeModel = z.infer<typeof ObjectTypeModelSchema>;
