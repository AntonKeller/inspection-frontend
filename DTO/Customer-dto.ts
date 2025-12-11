import {CustomerBaseSchema} from "../Models/Customer-Model.js";
import {DocumentModelSchema} from "../Models/Document-Model.js";
import {z} from "zod";


export const CustomerCreateSchemaDTO = CustomerBaseSchema;
export const CustomerUpdateSchemaDTO = CustomerBaseSchema.partial();
export const CustomerResponseSchemaDTO = CustomerBaseSchema.extend(DocumentModelSchema.shape);


export type CustomerCreateDTO = z.infer<typeof CustomerCreateSchemaDTO>;
export type CustomerUpdateDTO = z.infer<typeof CustomerUpdateSchemaDTO>;
export type CustomerResponseDTO = z.infer<typeof CustomerResponseSchemaDTO>;
