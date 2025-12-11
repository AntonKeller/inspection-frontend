// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import vuetify, {transformAssetUrls} from 'vite-plugin-vuetify';

export default defineNuxtConfig({

    runtimeConfig: {
        public: {
            API_EXPRESS_URL: 'http://192.168.1.77:7000'
        }
    },

    devtools: {
        enabled: true
    },

    ssr: false,

    app: {

        pageTransition: {
            name: 'page',
            mode: 'out-in'
        },
        head: {
            title: '',
            htmlAttrs: {
                lang: 'ru'
            },
            meta: [
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1'
                },
                {
                    charset: 'utf-8'
                },
                {
                    name: 'format-detection',
                    content: 'telephone=+99999999999999'
                },
                {
                    name: 'author',
                    content: 'ООО "Рога и копыта"'
                }
            ],
            link: [
                {
                    rel: "preconnect",
                    href: "https://fonts.googleapis.com",
                },
                {
                    rel: "preconnect",
                    href: "https://fonts.gstatic.com",
                },
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Wix+Madefor+Text:ital,wght@0,400..800;1,400..800&display=swap",
                },
                {
                    rel: 'icon',
                    type: 'image/x-icon',
                    // href: '/favicon_16x16.ico'
                },
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
                }
            ]
        }
    },

    typescript: {
        typeCheck: true
    },

    build: {
        transpile: ['vuetify']
    },

    css: [
        '/assets/css/main.scss'
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    vite: {
        vue: {
            template: {
                transformAssetUrls
            }
        }
    },

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        '@nuxtjs/i18n',
        'nuxt-zod-i18n',
        'nuxt-easy-lightbox',
        (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
                // @ts-expect-error
                config.plugins.push(vuetify({autoImport: true}))
            })
        }
    ],

    compatibilityDate: '2025-01-03'
})