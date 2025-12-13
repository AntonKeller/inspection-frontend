import {TemplateBaseSchema} from "../Models/Template-Model";
import {DocumentModelSchema} from "../Models/Document-Model";
import {z} from "zod";


export const TemplateCreateSchemaDTO = TemplateBaseSchema;
export const TemplateUpdateSchemaDTO = TemplateBaseSchema.partial();
export const TemplateResponseSchemaDTO = TemplateBaseSchema.extend(DocumentModelSchema.shape);


export type TemplateCreateDTO = z.infer<typeof TemplateCreateSchemaDTO>;
export type TemplateUpdateDTO = z.infer<typeof TemplateUpdateSchemaDTO>;
export type TemplateResponseDTO = z.infer<typeof TemplateResponseSchemaDTO>;
