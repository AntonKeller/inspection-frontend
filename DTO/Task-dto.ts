import {TaskBaseSchema, TaskRelationsSchema} from "../Models/Task-Model.js";
import {DocumentModelSchema} from "../Models/Document-Model.js";
import {CustomerResponseSchemaDTO} from "./Customer-dto.js";
import {LoanAgreementResponseSchemaDTO} from "./LoanAgreement-dto.js";
import {PledgeAgreementResponseSchemaDTO} from "./PledgeAgreement-dto.js";
import {AgreementResponseSchemaDTO} from "./Agreement-dto.js";
import {z} from "zod";


export const TaskCreateSchemaDTO = TaskBaseSchema.extend(TaskRelationsSchema.shape);
export const TaskUpdateSchemaDTO = TaskBaseSchema.extend(TaskRelationsSchema.shape).partial();
export const TaskResponseSchemaDTO = TaskBaseSchema
    .extend(DocumentModelSchema.shape)
    .extend({
        customer: CustomerResponseSchemaDTO.nullable(),
        agreement: AgreementResponseSchemaDTO.nullable(),
        loanAgreements: z.array(LoanAgreementResponseSchemaDTO) .nullable(),
        pledgeAgreements: z.array(PledgeAgreementResponseSchemaDTO).nullable(),
    });


export type TaskCreateDTO = z.infer<typeof TaskCreateSchemaDTO>;
export type TaskUpdateDTO = z.infer<typeof TaskUpdateSchemaDTO>;
export type TaskResponseDTO = z.infer<typeof TaskResponseSchemaDTO>;

