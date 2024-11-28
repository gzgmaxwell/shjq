import type { Router } from 'vue-router'
import AfterEachGuards from './afterEach'
import BeforeEachGuards from './beforeEach'

/**
 * 路由守卫
 */
export default class RouterGuards {
  /**
   * 加载路由守卫
   */
  public static load(router: Router) {
    AfterEachGuards.load(router)
    BeforeEachGuards.load(router)
  }
}
