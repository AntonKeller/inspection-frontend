import {z} from "zod";
import {RoleBaseSchema} from "../Models/Role-Model.js";
import {DocumentModelSchema} from "../Models/Document-Model.js";


export const RoleCreateSchemaDTO = z.object({
   ...RoleBaseSchema.shape,
});

export const RoleUpdateSchemaDTO= z.object({
    ...RoleBaseSchema.shape,
}).partial();

export const RoleResponseSchemaDTO = z.object({
    ...RoleBaseSchema.shape,
    ...DocumentModelSchema.shape,
});


export type RoleCreateDTO = z.infer<typeof RoleCreateSchemaDTO>;
export type RoleUpdateDTO = z.infer<typeof RoleUpdateSchemaDTO>;
export type RoleResponseDTO = z.infer<typeof RoleResponseSchemaDTO>;

