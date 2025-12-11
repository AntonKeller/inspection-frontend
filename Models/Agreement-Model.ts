import {z} from "zod";
import {DocumentModelSchema} from "./Document-Model.js";


export const AgreementBaseSchema = z.object({
    number: z.string().nullable(),      // Номер ТЗ к договору
    date: z.number().nullable(),        // Дата заключения
    isParent: z.boolean().nullable(),   // Флаг рамочного договора
    description: z.string().nullable()  // Описание договора
});

export const AgreementRelationsSchema = z.object({
    parentId: z.string().nullable(),  // Рамочный договор ID (Внешний ключ)
});

export const AgreementModelSchema = z.object({
    ...AgreementBaseSchema.shape,
    ...AgreementRelationsSchema.shape,
    ...DocumentModelSchema.shape
});


export type AgreementBase = z.infer<typeof AgreementBaseSchema>;
export type AgreementModel = z.infer<typeof AgreementModelSchema>;