import {PledgerBaseSchema} from "../Models/Pledger-Model.js";
import {DocumentModelSchema} from "../Models/Document-Model.js";
import {z} from "zod";


export const PledgerCreateSchemaDTO = PledgerBaseSchema;
export const PledgerUpdateSchemaDTO = PledgerBaseSchema.partial();
export const PledgerResponseSchemaDTO = PledgerBaseSchema.extend(DocumentModelSchema.shape);


export type PledgerCreateDTO = z.infer<typeof PledgerCreateSchemaDTO>;
export type PledgerUpdateDTO = z.infer<typeof PledgerUpdateSchemaDTO>;
export type PledgerResponseDTO = z.infer<typeof PledgerResponseSchemaDTO>;
