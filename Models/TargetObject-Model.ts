import {z} from "zod";
import {DocumentModelSchema} from "./Document-Model.js";


export const TargetObjectBaseSchema = z.object({
    name: z.string().nullable(),        // Наименование
    identifier: z.string().nullable(),  // Идентификатор
    address: z.string().nullable(),     // Адрес (место нахождение имущества)
    type: z.string().nullable(),        // Тип объекта (Из перечисления типов шаблонов)
})

export const TargetObjectIdSchema = z.object({
    targetAddressId: z.string().nullable(),
});

export const TargetObjectModelSchema = TargetObjectBaseSchema
    .extend(TargetObjectIdSchema.shape)
    .extend(DocumentModelSchema.shape);


export type TargetObjectBase = z.infer<typeof TargetObjectBaseSchema>;
export type TargetObjectModel = z.infer<typeof TargetObjectModelSchema>;