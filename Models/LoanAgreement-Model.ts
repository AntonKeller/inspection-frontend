import {z} from "zod";
import {DocumentModelSchema} from "./Document-Model.js";


export const LoanAgreementBaseSchema = z.object({
    number: z.string().nullable(),  // Номер кредитного договора
    date: z.number().nullable(),    // Дата регистрации
});

export const LoanAgreementModelSchema = LoanAgreementBaseSchema.extend(DocumentModelSchema.shape);


export type LoanAgreementBase = z.infer<typeof LoanAgreementBaseSchema>
export type LoanAgreementModel = z.infer<typeof LoanAgreementModelSchema>
