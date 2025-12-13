import {z} from "zod";
import {DocumentModelSchema} from "./Document-Model.js";


export const ObjectAngleBaseSchema = z.object({
    name: z.string().nullable()   // Наименование ракурса осматриваемого объекта
});

export const ObjectAngleIdSchema = z.object({
    targetObjectId: z.string().nullable(),  // Принадлежность к объекту
    angleId: z.string().nullable(),         // Принадлежность к ракурсу шаблона
});

export const ObjectAngleModelSchema = ObjectAngleBaseSchema
    .extend(ObjectAngleIdSchema.shape)
    .extend(DocumentModelSchema.shape);


export type ObjectAngleBase = z.infer<typeof ObjectAngleBaseSchema>;
export type ObjectAngleId = z.infer<typeof ObjectAngleIdSchema>;
export type ObjectAngleModel = z.infer<typeof ObjectAngleModelSchema>;
