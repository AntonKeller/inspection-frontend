import {z} from "zod";
import {DocumentModelSchema} from "./Document-Model.js";


export const PledgerBaseSchema = z.object({
    firstName: z.string().nullable(),   //  Имя
    surname: z.string().nullable(),     //  Фамилия
    lastName: z.string().nullable(),    //  Отчество
    inn: z.string().nullable(),         //  ИНН
    position: z.string().nullable(),    //  Должность
});

export const PledgerModelSchema = PledgerBaseSchema.extend(DocumentModelSchema.shape);


export type PledgerBase = z.infer<typeof PledgerBaseSchema>;
export type PledgerModel = z.infer<typeof PledgerModelSchema>;


