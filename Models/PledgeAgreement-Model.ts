import {z} from "zod";
import {DocumentModelSchema} from "./Document-Model.js";


export const PledgeAgreementBaseSchema = z.object({
    number: z.string().nullable(),  // Номер договора залога
    date: z.number().nullable(),    // Дата регистрации
});

export const PledgeAgreementModelSchema = PledgeAgreementBaseSchema.extend(DocumentModelSchema.shape);


export type PledgeAgreementBase = z.infer<typeof PledgeAgreementBaseSchema>
export type PledgeAgreementModel = z.infer<typeof PledgeAgreementModelSchema>
