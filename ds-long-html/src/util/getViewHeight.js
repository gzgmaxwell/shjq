// 获取当前视口高度
export function getViewHeight() {
    let winHeight = 0;
    if (window.innerHeight) {
      winHeight = window.innerHeight;
    } else if (document.body && document.body.clientHeight) {
      winHeight = document.body.clientHeight;
    }
    if (document.documentElement && document.documentElement.clientHeight) {
      winHeight = document.documentElement.clientHeight;
    }
    return winHeight;
  }