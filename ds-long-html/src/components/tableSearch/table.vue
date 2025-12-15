<template>
  <div>
    <slot></slot>
    <el-table
      @cell-mouse-enter.once="rowDrop"
      :row-class-name="rowClassName"
      :data="tableData"
      :row-key="rowKey"
      :tree-props="treeProps"
      style="width: 100%"
      v-loading="loading"
      :height="height"
      :header-cell-class-name="headerStyle"
      :default-expand-all="defaultExpandAll"
      :default-sort="defaultSort"
      ref="table"
      :lazy="lazy"
      :load="
        (tree, treeNode, resolve) => {
          tableEvents.load && tableEvents.load(tree, treeNode, resolve);
        }
      "
      @selection-change="
        (val) => {
          if (this.isSingleSelection && val.length > 1) {
            this.$refs.table.clearSelection();
            this.$refs.table.toggleRowSelection(val.pop());
            tableEvents.selectionChange && tableEvents.selectionChange(val);
            return;
          }
          tableEvents.selectionChange && tableEvents.selectionChange(val);
        }
      "
      @sort-change="
        (val) => tableEvents.sortChange && tableEvents.sortChange(val)
      "
      border
    >
      <el-table-column
        v-if="isSelection"
        type="selection"
        :fixed="true"
        :selectable="selectable"
        align="center"
      ></el-table-column>
      <el-table-column
        v-if="isIndex"
        :label="$t('serial_number')"
        type="index"
        :fixed="true"
        width="50"
        align="center"
      >
      </el-table-column>
      <template v-for="(item, index) in tableLabel">
        <el-table-column
          :prop="item.prop"
          :label="$t(item.label)"
          :key="index"
          :width="item.width"
          :show-overflow-tooltip="item.showOverflowTooltip"
          :align="item.align ? item.align : 'center'"
          :sortable="item.sortable"
          :sort-method="
            (a, b) =>
              item.sortMethod &&
              item.sortMethod({
                a,
                b,
                sortOrder: $refs.table.store.states.sortOrder,
              })
          "
          :header-align="item.headerAlign"
          :fixed="compuFixed(item)"
          v-if="compuShow(item)"
        >
          <template slot-scope="scope">
            <span
              v-if="item.type === 'filter'"
              @click="item.callback && item.callback(scope.row, scope.$index)"
              >{{ item.filter(scope.row, scope.$index) }}
            </span>

            <div v-else-if="item.type === 'dragMove'">
              <img
                src="@/assets/img/drag.png"
                class="handle"
                width="20"
                height="20"
              />
            </div>

            <div v-else-if="item.type === 'videoPlay'">
              <div class="videoItem">
                <img
                  v-if="scope.row.coverUrl || scope.row.verticalCoverUrl"
                  @click="
                    (e) => {
                      item.callback &&
                        item.callback(scope.row, scope.$index, e);
                    }
                  "
                  :src="scope.row.coverUrl || scope.row.verticalCoverUrl"
                  alt=""
                  width="78"
                  height="48"
                />
                <div
                  v-else
                  class="empty-box"
                  @click="
                    (e) => {
                      item.callback &&
                        item.callback(scope.row, scope.$index, e);
                    }
                  "
                ></div>
                <div class="overlay" v-if="scope.row.deleted">已删除</div>
              </div>
              <drag
                :index="scope.$index"
                :onClose="
                  () => {
                    item.closeCallback(scope.row, scope.$index);
                  }
                "
                v-if="scope.row.visible"
              >
                <div class="videoBox">
                  <videoPlayer
                    :visible="scope.row.visible"
                    title="视频预览"
                    :single="{
                      videoOriginalFileUrl: scope.row.videoOriginalUrl,
                      coverFileUrl: scope.row.coverUrl,
                    }"
                  />
                </div>
              </drag>
            </div>

            <div v-else-if="item.type === 'imgShow'">
              <div class="videoItem">
                <img
                  v-if="scope.row[item.imgUrlkey]"
                  @click="
                    (e) => {
                      item.callback &&
                        item.callback(scope.row, scope.$index, e);
                    }
                  "
                  :src="scope.row[item.imgUrlkey]"
                  alt=""
                  width="78"
                  height="48"
                />
              </div>
              <el-dialog
                title="图片预览"
                :visible.sync="scope.row.visible"
                width="40%"
                append-to-body
                center
                :close-on-click-modal="true"
              >
                <img
                  width="100%"
                  height="100%"
                  :src="scope.row[item.imgUrlkey]"
                  alt=""
                />
              </el-dialog>
            </div>

            <span
              v-else-if="item.type === 'html'"
              v-html="item.html(scope.row, scope.$index)"
              @click="
                (e) => {
                  item.callback && item.callback(scope.row, scope.$index, e);
                }
              "
            >
            </span>

            <span v-else-if="item.type === 'slot'">
              <slot
                :name="item.slotName"
                :row="scope.row"
                :index="scope.$index"
              ></slot>
            </span>
            <span v-else-if="item.type === 'option'">
              <el-select
                v-model="scope.row[item['prop']]"
                @change="
                  (val) => {
                    item.callback &&
                      item.callback({
                        row: scope.row,
                        index: scope.$index,
                        val: val,
                      });
                  }
                "
              >
                <el-option
                  v-for="m in item.option"
                  :disabled="m.disabled"
                  :key="m.id"
                  :label="m.name"
                  :value="m.id"
                ></el-option>
              </el-select>
            </span>
            <span v-else-if="item.type === 'optionEvery'">
              <el-select
                v-if="compuShowOpt(item, scope.row)"
                v-model="scope.row[item['prop']]"
                @change="
                  (val) => {
                    item.callback &&
                      item.callback({
                        row: scope.row,
                        index: scope.$index,
                        val: val,
                      });
                  }
                "
              >
                <el-option
                  v-for="m in scope.row[item['selectEveryPropName']]"
                  :key="m.id"
                  :label="compuGetName(item, m, 'label')"
                  :value="compuGetName(item, m, 'value') || ''"
                ></el-option>
              </el-select>
            </span>

            <span
              v-else
              @click="item.callback && item.callback(scope.row, scope.$index)"
              >{{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
      </template>

      <el-table-column
        v-if="operation.label"
        :label="$t(operation.label)"
        :width="operation.width"
        :align="operation.align ? operation.align : 'center'"
        :fixed="compuFixed(operation)"
      >
        <template slot-scope="scope">
          <el-button
            v-for="(btnItem, btnIndex) in operation.btnList"
            :type="btnItem.type"
            :key="btnIndex"
            @click="btnItem.callback(scope.row, scope.$index, that)"
            >{{ $t(btnItem.label) }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <slot name="footer"></slot>
    <pagination
      v-if="tablePage.total"
      :total="tablePage.total"
      :page="tablePage.current"
      :limit="tablePage.size"
      :pageSizes="pageSizes"
      @pagination="tablePage.pagination"
    />
  </div>
</template>
<script>
import pagination from "@/components/bas-pagination/index.vue";
import videoPlayer from "@/components/video-player";
import easyPlayer from "@/components/easyPlayer";
import drag from "@/components/drag/index.vue";
import Sortable from "sortablejs";

export default {
  components: {
    pagination,
    drag,
    videoPlayer,
    easyPlayer,
  },
  props: {
    that: { type: Object, default: this },
    tableData: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },
    treeProps: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
    rowKey: {
      type: String,
      required: false,
    },
    headerStyle: {
      type: Function,
      required: false,
    },
    tableLabel: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
    operation: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
    isIndex: {
      type: Boolean,
      required: false,
      default: () => {
        return false;
      },
    },
    isSelection: {
      type: Boolean,
      required: false,
      default: () => {
        return false;
      },
    },
    isSingleSelection: {
      type: Boolean,
      required: false,
      default: () => {
        return false;
      },
    },
    tablePage: {
      type: Object,
      required: false,
      default: () => ({ total: 0, current: 1, size: 10 }),
    },
    loading: {
      type: Boolean,
      required: false,
      default: () => {
        return false;
      },
    },
    tableEvents: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    selecKey: {
      type: String,
      required: false,
      default: "",
    },
    selecCondition: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },
    rowClassName: {
      type: Function,
      required: false,
      default: () => {},
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 40, 50];
      },
    },
    height: {
      type: Number,
      required: false,
      default: undefined,
    },
    lazy: {
      type: Boolean,
      required: false,
      default: false,
    },
    defaultExpandAll: {
      type: Boolean,
      required: false,
      default: () => {
        return false;
      },
    },
    defaultSort: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    sortHandleType: {
      type: Boolean,
      required: false,
      default: () => false, // handle   .el-table__row
    },
  },
  computed: {
    compuShow() {
      return (item) => {
        if (typeof item.show === "function") {
          return item.show();
        }
        return true;
      };
    },
    compuFixed() {
      return (item) => {
        if (item.fixed) {
          return item.fixed;
        }
        return false;
      };
    },
    compuShowOpt() {
      return (item, row) => {
        if (typeof item.showOpt === "function") {
          return item.showOpt(row);
        }
        return true;
      };
    },
    compuGetName() {
      return (item, optionsItem, type) => {
        const label = item.labelValue?.label ? item.labelValue.label : "name";
        const value = item.labelValue?.value ? item.labelValue?.value : "id";
        if (type == "label") {
          return optionsItem[label];
        }
        if (type == "value") {
          return optionsItem[value];
        }
      };
    },
  },
  methods: {
    rowDrop() {
      // 行拖拽
      const _this = this;
      const tbody2 = this.$refs.table.$el.querySelector(
        ".el-table__body-wrapper tbody"
      );
      Sortable.create(tbody2, {
        handle: this.sortHandleType ? ".el-table__row" : ".handle",
        animation: 150,
        onEnd({ newIndex, oldIndex }) {
          // 拖拽完成
          if (_this.tableEvents && _this.tableEvents.dragRowCallBack) {
            const rowOldIndex = _this.tableData[oldIndex];
            _this.tableData.splice(oldIndex, 1);
            _this.tableData.splice(newIndex, 0, rowOldIndex);
            _this.tableEvents.dragRowCallBack({ tableData: _this.tableData });
          }
        },
      });
    },
    selectable(row) {
      // return false 禁止
      if (!this.selecKey) {
        return true;
      }
      if (this.selecCondition.includes(row[this.selecKey])) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
<style>
.status-cell {
  color: red;
  /* 设置颜色为红色 */
  font-weight: bold;
  /* 设置字体加粗 */
}
</style>
<style lang="scss" scoped>
.tooltipBox {
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
}

.videoBox {
  position: relative;
  width: 700px;
  height: 400px;
}

.videoItem {
  position: relative;

  .overlay {
    position: absolute;
    top: -3px;
    left: 0;
    width: 37px;
    height: 18px;
    color: #fff;
    align-items: center;
    font-size: 10px;
    pointer-events: none;
    z-index: 998;
    background: red;
    border-radius: 3px;
    padding-left: 2px;
  }
}

.empty-box {
  width: 78px;
  height: 48px;
  border: 1px solid #ccc;
}
::v-deep .el-checkbox:last-of-type {
  margin-right: 0 !important;
}

.handle {
  cursor: grab;
}
</style>
