import {z} from "zod";
import {DocumentModelSchema} from "./Document-Model.js";


export const EmployerBaseSchema = z.object({
    firstName: z.string().nullable(),        //  Имя
    surname: z.string().nullable(),          //  Фамилия
    lastName: z.string().nullable(),         //  Отчество
    phoneNumberWork: z.string().nullable(),  //  Рабочий номер телефона
    phoneNumber: z.string().nullable(),      //  Личный номер телефона
    email: z.string().nullable(),            //  Email
});

export const EmployerCredentialsSchema = z.object({
    login: z.string(),     //  Логин
    password: z.string(),  //  Пароль
});

export const EmployerRelationsSchema = z.object({
    roleId: z.string().nullable(),  // ID Роль, внешний ключ
});

export const EmployerModelSchema = z.object({
    ...EmployerBaseSchema.shape,
    ...EmployerRelationsSchema.shape,
    ...EmployerCredentialsSchema.shape,
    ...DocumentModelSchema.shape
});


export type EmployerBase = z.infer<typeof EmployerBaseSchema>;
export type EmployerCredentials = z.infer<typeof EmployerCredentialsSchema>;
export type EmployerRelations = z.infer<typeof EmployerRelationsSchema>;
export type EmployerModel = z.infer<typeof EmployerModelSchema>;