import moment from "moment/min/moment-with-locales";

// Короткая дата из Unix date
export function unixDateToShortDateString(unixDate) {
    return unixDate ? moment(parseInt(unixDate)).locale('ru').format('DD.MM.YYYY') : '-';
}

export function unixDateToMiddleDateString(unixDate) {
    return unixDate ? moment(parseInt(unixDate)).locale('ru').format('dd DD MMMM') : '[Не указано]';
}

// Широкая дата из Unix date
export function unixDateToLongDateString(unixDate) {
    return moment(parseInt(unixDate)).locale('ru').format('dd DD MMMM YYYY');
}

export function showAlert(text) {
    return {
        success: function () {
            return {
                type: 'teal-darken-1',
                msg: text,
                isShow: true,
            }
        },
        error: function () {
            return {
                type: 'red-darken-4',
                msg: text,
                isShow: true,
            }
        }
    }
}