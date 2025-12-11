import {z} from "zod";
import {DocumentModelSchema} from "./Document-Model.js";


export const TargetObjectAngleBaseSchema = z.object({
    name: z.string().nullable()   // Наименование ракурса осматриваемого объекта
});

export const TargetObjectAngleIdSchema = z.object({
    targetObjectId: z.string().nullable(),  // Принадлежность к объекту
    angleId: z.string().nullable(),         // Принадлежность к ракурсу шаблона
});

export const TargetObjectAngleModelSchema = TargetObjectAngleBaseSchema
    .extend(TargetObjectAngleIdSchema.shape)
    .extend(DocumentModelSchema.shape);


export type TargetObjectAngleBase = z.infer<typeof TargetObjectAngleBaseSchema>;
export type TargetObjectAngleId = z.infer<typeof TargetObjectAngleIdSchema>;
export type TargetObjectAngleModel = z.infer<typeof TargetObjectAngleModelSchema>;
