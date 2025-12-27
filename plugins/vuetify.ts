// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { ru } from 'vuetify/locale'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        locale: {
            locale: 'ru',
            messages: { ru },
        },
    })
    app.vueApp.use(vuetify)
})