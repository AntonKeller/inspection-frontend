import {PledgeAgreementBaseSchema} from "../Models/PledgeAgreement-Model";
import {DocumentModelSchema} from "../Models/Document-Model";
import {z} from "zod";


export const PledgeAgreementCreateSchemaDTO = PledgeAgreementBaseSchema;
export const PledgeAgreementUpdateSchemaDTO = PledgeAgreementBaseSchema.partial();
export const PledgeAgreementResponseSchemaDTO = PledgeAgreementBaseSchema.extend(DocumentModelSchema.shape);


export type PledgeAgreementCreateDTO = z.infer<typeof PledgeAgreementCreateSchemaDTO>;
export type PledgeAgreementUpdateDTO = z.infer<typeof PledgeAgreementUpdateSchemaDTO>;
export type PledgeAgreementResponseDTO = z.infer<typeof PledgeAgreementResponseSchemaDTO>;
