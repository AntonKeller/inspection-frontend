import {ContactBaseSchema} from "../Models/Contact-Model";
import {DocumentModelSchema} from "../Models/Document-Model";
import {z} from "zod";


export const ContactCreateSchemaDTO = ContactBaseSchema;
export const ContactUpdateSchemaDTO = ContactBaseSchema.partial();
export const ContactResponseSchemaDTO = ContactBaseSchema.extend(DocumentModelSchema.shape);


export type ContactCreateDTO = z.infer<typeof ContactCreateSchemaDTO>;
export type ContactUpdateDTO = z.infer<typeof ContactUpdateSchemaDTO>;
export type ContactResponseDTO = z.infer<typeof ContactResponseSchemaDTO>;
