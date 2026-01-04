import type {TaskResponseDTO} from "@/DTO/Task-dto";

export const taskTableHeaders = [
    {
        title: '',
        key: 'actions',
        align: 'end',
        minWidth: 140,
        width: 140,
        maxWidth: 140,
        fixed: true,
        sortable: false,
        _$visible: true,
    },
    {
        title: 'Заголовок',
        key: 'title',
        value: 'title',
        align: 'start',
        width: 200,
        maxWidth: 200,
        sortable: true,
        nowrap: false,
        _$visible: true,
    },
    {
        title: 'Заказчик',
        align: 'start',
        key: 'customer',
        value: (e: TaskResponseDTO) => e?.customer?.shortName,
        sortable: true,
        nowrap: false,
        _$visible: true,
    },
    {
        title: 'Договор с заказчиком',
        align: 'start',
        key: 'agreement',
        value: (e: TaskResponseDTO) => e?.agreement?.number,
        sortable: true,
        nowrap: false,
        _$visible: true,
    },
];