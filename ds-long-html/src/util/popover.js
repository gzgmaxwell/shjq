// 封装的公共方法
export function popoverHandle(popoverClass) {
  let popover = document.getElementsByClassName(popoverClass)[0];
  let popover1 = popover.children[0];
  popover1.style.cursor = "move";
  // 拖拽
  popover1.onmousedown = function (e) {
    var disx = e.clientX - popover.offsetLeft;
    var disy = e.clientY - popover.offsetTop;
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      // 解决快速频繁拖动滞后问题
      e.returnValue = false;
    }
    document.onmousemove = function (e) {
      // 移动时禁用默认事件
      e.preventDefault();
      e.stopPropagation();
      // 鼠标位置-鼠标相对元素位置=元素位置
      let left = e.clientX - disx;
      let top = e.clientY - disy;
      // 限制拖拽范围不超出可视区
      if (left <= 0) {
        // 设置成5,离边缘不要太近
        left = 5;
      } else if (
        left >
        document.documentElement.clientWidth - popover.clientWidth
      ) {
        left = document.documentElement.clientWidth - popover.clientWidth - 15;
      }
      if (top <= 0) {
        top = 5;
      } else if (
        top >
        document.documentElement.clientHeight - popover.clientHeight
      ) {
        top = document.documentElement.clientHeight - popover.clientHeight - 15;
      }
      popover.style.left = left + "px";
      popover.style.top = top + "px";
    };
    document.onmouseup = function () {
      document.onmousemove = document.onmouseup = null;
    };
  };
  // 放大缩小
  popover.onmousemove = function (e) {
    // 获取鼠标所在div的位置
    function getDirection(ev) {
      let xP, yP, offset, dir;
      dir = "";
      xP = ev.offsetX;
      yP = ev.offsetY;
      offset = 10;
      if (yP < offset) dir += "n";
      else if (yP > popover.offsetHeight - offset) dir += "s";
      if (xP < offset) dir += "w";
      else if (xP > popover.offsetWidth - offset) dir += "e";
      return dir;
    }
    popover.onmousedown = (e) => {
      e.stopPropagation();
      let elW = popover.clientWidth;
      let EloffsetLeft = popover.offsetLeft;
      let EloffsetTop = popover.offsetTop;
      // 鼠标按下时的坐标，并在修改尺寸时保存上一个鼠标的位置
      let clientX;
      let clientY;
      // 是否开启尺寸修改
      let resizeable = false;
      // 鼠标按下时的位置，使用n、s、w、e表示
      let direc = "";
      let minW = 430,
        minH = "100%";
      popover.style.userSelect = "none";
      let d = getDirection(e);
      // 当位置为四个边和四个角时才开启尺寸修改
      if (d !== "") {
        resizeable = true;
        direc = d;
        clientX = e.clientX;
        clientY = e.clientY;
      }
      //判断点击的位置是不是为头部
      if (
        clientX > EloffsetLeft &&
        clientX < EloffsetLeft + elW &&
        clientY > EloffsetTop &&
        clientY < EloffsetTop + 100
      ) {
        //如果是头部在此就不做任何动作，以上有绑定dialogHeaderEl.onmousedown = moveDown;
      } else {
        document.onmousemove = function (e) {
          e.preventDefault();
          e.stopPropagation();
          let d = getDirection(e);
          let cursor;
          if (d === "") cursor = "default";
          else cursor = d + "-resize";
          // 修改鼠标显示效果
          popover.style.cursor = cursor;
          // 当开启尺寸修改时，鼠标移动会修改div尺寸
          if (resizeable) {
            // 鼠标按下的位置在右边，修改宽度
            if (direc.indexOf("e") !== -1) {
              popover.style.width =
                Math.max(minW, popover.offsetWidth + (e.clientX - clientX)) +
                "px";
              clientX = e.clientX;
            }
            // 鼠标按下的位置在上部，修改高度
            if (direc.indexOf("n") !== -1) {
              popover.style.height =
                Math.max(minH, popover.offsetHeight + (clientY - e.clientY)) +
                "px";
              clientY = e.clientY;
            }
            // 鼠标按下的位置在底部，修改高度
            if (direc.indexOf("s") !== -1) {
              popover.style.height =
                Math.max(minH, popover.offsetHeight + (e.clientY - clientY)) +
                "px";
              clientY = e.clientY;
            }
            // 鼠标按下的位置在左边，修改宽度
            if (direc.indexOf("w") !== -1) {
              popover.style.width =
                Math.max(minW, popover.offsetWidth + (clientX - e.clientX)) +
                "px";
              clientX = e.clientX;
            }
          }
        };
        //拉伸结束
        document.onmouseup = function (e) {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    };
  };
}
