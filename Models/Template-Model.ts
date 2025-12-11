import {z} from "zod";
import {DocumentModelSchema} from "./Document-Model.js";


export const TemplateBaseSchema = z.object({
    name: z.string().nullable(),      // Наименование шаблона
    isBase: z.boolean().nullable(),   // Является базовым (да/нет)
});

export const TemplateModelSchema = TemplateBaseSchema.extend(DocumentModelSchema.shape);


export type TemplateBase = z.infer<typeof TemplateModelSchema>;
export type TemplateModel = z.infer<typeof TemplateModelSchema>;