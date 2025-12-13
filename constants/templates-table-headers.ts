import type {TemplateResponseDTO} from "@/DTO/Template-dto";

const templatesTableHeaders = [
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
        title: 'Наименование шаблона',
        key: 'name',
        value: 'name',
        align: 'start',
        sortable: true,
        nowrap: false,
        _$visible: true,
    },
    {
        title: 'Шаблон по умолчанию',
        key: 'isBase',
        value: (e: TemplateResponseDTO) => e.isBase ? 'Да' : 'Нет',
        align: 'start',
        sortable: true,
        nowrap: false,
        _$visible: true,
    },
]

export default templatesTableHeaders;