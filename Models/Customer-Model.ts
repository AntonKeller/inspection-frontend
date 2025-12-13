import {z} from "zod";
import {DocumentModelSchema} from "./Document-Model.js";


export const CustomerBaseSchema = z.object({
    shortName: z.string().nullable(),         // - Краткое наименование - строка
    fullName: z.string().nullable(),          // - Полное наименование - строка
    inn: z.string().nullable(),               // - ИНН организации - строка
    ogrn: z.string().nullable(),              // - ОГРН организации - строка
    legalAddress: z.string().nullable(),      // - Юридический адрес - строка
    physicalAddress: z.string().nullable(),   // - Фактический адрес - строка
    email: z.string().nullable(),             // - Email
    phoneNumber: z.string().nullable(),       // - Номер телефона заказчика
    memberFullName: z.string().nullable(),    // - ФИО представителя
    memberPosition: z.string().nullable(),    // - Должность представителя
});

export const CustomerModelSchema = CustomerBaseSchema.extend(DocumentModelSchema.shape);


export type CustomerBase = z.infer<typeof CustomerBaseSchema>;
export type CustomerModel = z.infer<typeof CustomerModelSchema>;