import type TNavItem from '../utils/types/TNavItem';

export const navItems: Array<TNavItem> = [
    {
        _id: 1,
        title: 'Задания',
        route: '/manager/tasks',
        prependIcon: 'mdi-calendar-check-outline',
        value: 'assignments',
        active: false,
        badge: {
            show: false,
            color: "info",
            content: "12"
        },
    },
    {
        _id: 2,
        title: 'Инспекторы',
        route: '/manager/employees',
        prependIcon: 'mdi-account-group-outline',
        value: 'inspectors',
        active: false,
        badge: {
            show: false,
            color: "info",
            content: "12"
        },
    },
    {
        _id: 3,
        title: 'Заказчики',
        route: '/manager/customers',
        prependIcon: 'mdi-card-account-details-outline',
        value: 'customers',
        active: false,
        badge: {
            show: false,
            color: "info",
            content: "12"
        },
    },
    {
        _id: 4,
        title: 'Шаблоны',
        route: '/manager/templates',
        prependIcon: 'mdi-folder-table-outline',
        value: 'templates',
        active: false,
        badge: {
            show: false,
            color: "info",
            content: "12"
        },
    },

];