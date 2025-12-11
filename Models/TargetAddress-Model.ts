import {z} from "zod";
import {DocumentModelSchema} from "./Document-Model.js";


export const TargetAddressBaseSchema = z.object({
    title: z.string().nullable(),      // Заголовок адреса
    startDate: z.number().nullable(),  // Дата начала
    address: z.string().nullable()     // Адрес осмотра
});

export const TargetAddressRelationsSchema = z.object({
    pledgerId: z.string().nullable(),   // Залогодатель (внешний ключ)
    contactId: z.string().nullable(),   // Контактное лицо (внешний ключ)
    employerId: z.string().nullable(), // Инспектор (внешний ключ)
});

export const TargetAddressIdSchema = z.object({
    taskId: z.string().nullable(),      // ID задания (внешний ключ не мапится)
});

export const TargetAddressModelSchema = TargetAddressBaseSchema
    .extend(TargetAddressIdSchema.shape)
    .extend(TargetAddressRelationsSchema.shape)
    .extend(DocumentModelSchema.shape);


export type TargetAddressBase = z.infer<typeof TargetAddressBaseSchema>;
export type TargetAddressRelations = z.infer<typeof TargetAddressRelationsSchema>;
export type TargetAddressModel = z.infer<typeof TargetAddressModelSchema>;
