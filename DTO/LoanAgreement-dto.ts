import {LoanAgreementBaseSchema} from "../Models/LoanAgreement-Model.js";
import {DocumentModelSchema} from "../Models/Document-Model.js";
import {z} from "zod";


export const LoanAgreementCreateSchemaDTO = LoanAgreementBaseSchema;
export const LoanAgreementUpdateSchemaDTO = LoanAgreementBaseSchema.partial();
export const LoanAgreementResponseSchemaDTO = LoanAgreementBaseSchema.extend(DocumentModelSchema.shape);


export type LoanAgreementCreateDTO = z.infer<typeof LoanAgreementCreateSchemaDTO>;
export type LoanAgreementUpdateDTO = z.infer<typeof LoanAgreementUpdateSchemaDTO>;
export type LoanAgreementResponseDTO = z.infer<typeof LoanAgreementResponseSchemaDTO>;
