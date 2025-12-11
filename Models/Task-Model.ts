import {z} from "zod";
import {DocumentModelSchema} from "./Document-Model.js";


export const TaskBaseSchema = z.object({
    title: z.string().nullable(),   // Заголовок задания
});

export const TaskRelationsSchema = z.object({
    customerId: z.string().nullable(),                   // Заказчик (внешний ключ)
    agreementId: z.string().nullable(),                  // Договор с заказчиком (внешний ключ)
    loanAgreementsIds: z.array(z.string()).nullable(),   // Список кредитных договоров (внешние ключи)
    pledgeAgreementsIds: z.array(z.string()).nullable(), // Список договоров залога (внешние ключи)
});

export const TaskModelSchema = TaskBaseSchema
    .extend(DocumentModelSchema.shape)
    .extend(TaskRelationsSchema.shape);


export type TaskBase = z.infer<typeof TaskBaseSchema>;
export type TaskRelations = z.infer<typeof TaskRelationsSchema>;
export type TaskModel = z.infer<typeof TaskModelSchema>;