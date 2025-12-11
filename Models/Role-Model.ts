import {z} from "zod";
import {DocumentModelSchema} from "./Document-Model.js";


export const RoleBaseSchema = z.object({
    name: z.string().nullable(),
});

export const RoleModelSchema = z.object({
    ...RoleBaseSchema.shape,
    ...DocumentModelSchema.shape,
});


export type RoleBase = z.infer<typeof RoleBaseSchema>;
export type RoleModel = z.infer<typeof RoleModelSchema>;