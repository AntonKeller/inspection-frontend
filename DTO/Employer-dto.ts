import {z} from "zod";
import {EmployerBaseSchema, EmployerCredentialsSchema, EmployerRelationsSchema} from "../Models/Employer-Model.js";
import {DocumentModelSchema} from "../Models/Document-Model.js";
import {RoleResponseSchemaDTO} from "./Role-dto.js";


export const EmployerCreateSchemaDTO = z.object({
    ...EmployerBaseSchema.shape,
    ...EmployerRelationsSchema.shape,
    ...EmployerCredentialsSchema.shape
});

export const EmployerUpdateSchemaDTO = z.object({
    ...EmployerBaseSchema.shape,
    ...EmployerRelationsSchema.shape
}).partial();

export const EmployerResponseSchemaDTO = z.object({
    ...EmployerBaseSchema.shape,
    ...DocumentModelSchema.shape,
    role: RoleResponseSchemaDTO.nullable()
});


export type EmployerCreateDTO = z.infer<typeof EmployerCreateSchemaDTO>;
export type EmployerUpdateDTO = z.infer<typeof EmployerUpdateSchemaDTO>;
export type EmployerResponseDTO = z.infer<typeof EmployerResponseSchemaDTO>;
