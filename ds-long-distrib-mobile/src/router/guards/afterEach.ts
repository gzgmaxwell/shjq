import type { Router } from 'vue-router'

/**
 * 后置路由守卫
 */
export default class AfterEachGuard {
  /**
   * 加载后置路由守卫
   * @param router 路由实例
   */
  public static load(router: Router) {
    router.afterEach(() => {})
  }
}
