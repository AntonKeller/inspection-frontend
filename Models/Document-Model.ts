import {z} from "zod";

export const DocumentModelSchema = z.object({
    _id: z.string(),        // Уникальный идентификатор документа
    createdAt: z.number(),  // Дата создания документа
    updatedAt: z.number(),  // Дата обновления документа
    active: z.boolean()     // Флаг активного документа
});


export type DocumentModel = z.infer<typeof DocumentModelSchema>;