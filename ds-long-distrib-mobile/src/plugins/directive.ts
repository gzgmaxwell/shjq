import type { App } from 'vue'
import { directives } from '../directive'

export default class VuePlugin {
  private app!: App<Element>

  constructor(app: App<Element>) {
    this.app = app
  }

  public load() {
    Object.keys(directives).forEach(key => {
      this.app.directive(key, directives[key])
    })
  }
}
