<template>
  <div class="tree-container">
    <el-tree
      class="_tree"
      :data="treeList"
      :props="defaultProps"
      @node-expand="handleNodeExpand"
      @node-click="handleNodeClick"
      @node-contextmenu="handleRightClick"
      :default-expanded-keys="expandedKeys"
      :node-key="nodeKey"
      :highlight-current="true"
      ref="comnTree"
      :style="
        `max-height:${treeHeight}px;max-width:${treeWidth}px;overflow-x:auto;}`
      "
    >
      <span slot-scope="{ node, data }">
        <i :class="data.icon ? data.icon : 'el-icon-folder-opened'"></i>
        <span class="tree_label">{{ node.label }}</span>
        <span class="tree_label" v-if="data.total || data.total === 0" title="数量">({{ data.total }})</span>
      </span>
    </el-tree>

    <el-popover
      placement="right"
      width="150"
      trigger="manual"
      v-model="Flag"
      class="popover-intree"
      id="contextMenu"
      :style="`left:${clientX}px;top:${clientY}PX`"
    >
      <ul>
        <li
          v-for="item in contextMenu"
          :key="item.id"
          class="context-menu"
          @click="handleClickMenu(item.name)"
        >{{ item.name }}</li>
      </ul>
    </el-popover>
  </div>
</template>
<script>
import { getViewHeight } from "@/util/getViewHeight.js";
export default {
  data() {
    return {
      clientX: "",//左style
      clientY: "" //高style
    };
  },
  props: {
    treeList: {
      type: Array
    },
    defaultProps: {
      type: Object,
      default() {
        return {
          children: "children",
          label: "name"
        };
      }
    },
    nodeKey: {
      type: String,
      default() {
        return "menuId";
      }
    },
    contextMenu: {
      type: Array,
      default() {
        let menu = [
          {
            name: "添加",
            value: "add"
          },
          {
            name: "修改",
            value: "edit"
          },
          {
            name: "删除",
            value: "del"
          }
        ]; //树的右键菜单
        return menu;
      }
    },
    // 显示
    rightFlag: {
      type: Boolean,
      default() {
        return false;
      }
    },
    treeHeight: {
      type: Number,
      default() {
        return getViewHeight() - 200;
      }
    },
    treeWidth: {
      type: Number,
      default() {
        return 237;
      }
    },
    expandedKeys: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    Flag: {
      get() {
        return this.rightFlag;
      },
      set(val) {
        this.$emit("updateTreeMenu", val);
      }
    }
  },
  mounted() {
    document.addEventListener("click", e => {
      const contextMenu = document.getElementById("contextMenu");
      if (contextMenu) {
        if (!contextMenu.contains(e.target)) {
          this.$emit("updateTreeMenu", false);
        }
      }
    });
  },
  methods: {
    handleNodeClick(data) {
      this.$emit("updateTreeMenu", false); // 点击树节点的时候，将右键菜单隐藏。
      this.$emit("handleNodeClick", data);
    },
    handleRightClick(event, obj, node, self) {
      this.clientX = event.offsetX+25;
      this.clientY = event.clientY-110; // 该高度需据自己的布局调整
      this.setCurrTreeNode(obj[this.nodeKey]);
      this.$emit("handleRightClick", obj);
    },
    handleClickMenu(name) {
      this.$emit("handleClickTreeMenu", name);
    },
    handleNodeExpand(data, node, self) {
      this.$emit("handleNodeExpand", data);
    },
    setCurrTreeNode(id) {
      this.$refs["comnTree"].setCurrentKey(id);
    }
  }
};
</script>
<style lang="scss" scope >
.tree-container {
  height:500px;
  position: relative;
  ._tree {
    color: #444;
    padding-left: 6px;
    overflow: auto;
    .tree_label {
      font-size: 14px;
      letter-spacing: 1px;
      margin-left: 5px;
    }
  }

  .popover-intree {
    position: absolute;
    ul {
      padding: 3px;
    }
    li {
      list-style: none;
    }
  }
  .context-menu {
    letter-spacing: 1px;
    color: #222;
    cursor: pointer;
    height: 30px;
    line-height: 30px;
    color: #000;
    text-align: center;
    &:hover {
      border-radius: 2px;
      background: #648fdb;
      color: #fff;
    }
  }
  .el-popover {
    padding: 2px;
    min-width: 20px;
    border: 1px solid #ebeef5;
    border-radius: 0;
    box-shadow: 4px 4px 4px -4px rgb(121, 118, 118);
  }
  //重写tree的 active样式
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    color: #fff;
  }
  .el-tree > .el-tree-node {
    min-width: 100%;
    display: inline-block;
  }
}
</style>
