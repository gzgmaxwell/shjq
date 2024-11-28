import { createApp } from 'vue'
import App from './App.vue'

import VuePlugin from '@/plugins/vue'
import I18NPlugin from '@/plugins/i18n'
import '@/plugins/vant'
import DirectivePlugin from '@/plugins/directive'
// import AutoLandscape from '@/plugins/autoLandscape'
import AutoRem from '@/plugins/autoRem'
import PreventTouchZoom from '@/plugins/preventTouchZoom'

import './styles/index.less'

const app = createApp(App)
const vuePlugin = new VuePlugin(app)
const i18NPlugin = new I18NPlugin(app)
const directivePlugin = new DirectivePlugin(app)

vuePlugin.load()
i18NPlugin.load()
directivePlugin.load()
// AutoLandscape.load()
AutoRem.load()
PreventTouchZoom.load()

vuePlugin.mount()
