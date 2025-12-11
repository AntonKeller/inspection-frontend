import {AgreementBaseSchema, AgreementModelSchema, AgreementRelationsSchema} from "../Models/Agreement-Model";
import {DocumentModelSchema} from "../Models/Document-Model";
import {z} from "zod";


export const AgreementCreateSchemaDTO = z.object({
    ...AgreementBaseSchema.shape,
    ...AgreementRelationsSchema.shape
});

export const AgreementUpdateSchemaDTO = z.object({
    ...AgreementBaseSchema.shape,
    ...AgreementRelationsSchema.shape
}).partial();

export const AgreementResponseSchemaDTO = z.object({
    ...AgreementBaseSchema.shape,
    ...DocumentModelSchema.shape,
    parent: AgreementModelSchema.nullable()
});


export type AgreementCreateDTO = z.infer<typeof AgreementCreateSchemaDTO>;
export type AgreementUpdateDTO = z.infer<typeof AgreementUpdateSchemaDTO>;
export type AgreementResponseDTO = z.infer<typeof AgreementResponseSchemaDTO>;
