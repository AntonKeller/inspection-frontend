import {z} from "zod";
import {DocumentModelSchema} from "./Document-Model.js";


export const ContactBaseSchema = z.object({
    firstName: z.string().nullable(),    //  Имя
    surname: z.string().nullable(),      //  Фамилия
    lastName: z.string().nullable(),     //  Отчество
    phoneNumber: z.string().nullable(),  //  Контактный номер телефона
    email: z.string().nullable(),        //  Email
});

export const ContactModelSchema = ContactBaseSchema.extend(DocumentModelSchema.shape);


export type ContactBase = z.infer<typeof ContactBaseSchema>;
export type ContactModel = z.infer<typeof ContactModelSchema>;
