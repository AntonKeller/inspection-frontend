import {
    TargetAddressBaseSchema,
    TargetAddressIdSchema,
    TargetAddressRelationsSchema
} from "../Models/TargetAddress-Model.js";
import {DocumentModelSchema} from "../Models/Document-Model.js";
import {PledgerResponseSchemaDTO} from "./Pledger-dto.js";
import {ContactResponseSchemaDTO} from "./Contact-dto.js";
import {z} from "zod";
import {EmployerResponseSchemaDTO} from "./Employer-dto.js";


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