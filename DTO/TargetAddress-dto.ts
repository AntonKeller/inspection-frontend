import {
    TargetAddressBaseSchema,
    TargetAddressIdSchema,
    TargetAddressRelationsSchema
} from "../Models/TargetAddress-Model";
import {DocumentModelSchema} from "../Models/Document-Model";
import {PledgerResponseSchemaDTO} from "./Pledger-dto";
import {ContactResponseSchemaDTO} from "./Contact-dto";
import {z} from "zod";
import {EmployerResponseSchemaDTO} from "./Employer-dto";


export const TargetAddressCreateSchemaDTO = TargetAddressBaseSchema
    .extend(TargetAddressIdSchema.shape)
    .extend(TargetAddressRelationsSchema.shape);

export const TargetAddressUpdateSchemaDTO = TargetAddressBaseSchema
    .extend(TargetAddressIdSchema.shape)
    .extend(TargetAddressRelationsSchema.shape);

export const TargetAddressResponseSchemaDTO = TargetAddressBaseSchema
    .extend({
        pledger: PledgerResponseSchemaDTO.nullable(),
        contact: ContactResponseSchemaDTO.nullable(),
        employer: EmployerResponseSchemaDTO.nullable()
    })
    .extend(TargetAddressIdSchema.shape)
    .extend(DocumentModelSchema.shape);


export type TargetAddressCreateDTO = z.infer<typeof TargetAddressCreateSchemaDTO>;
export type TargetAddressUpdateDTO = z.infer<typeof TargetAddressUpdateSchemaDTO>;
export type TargetAddressResponseDTO = z.infer<typeof TargetAddressResponseSchemaDTO>;