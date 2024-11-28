<template>
  <div class="mt10">
    <search
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search>
    <div style="overflow: hidden">
      <tableSearch
        style="margin-top: -40px"
        :loading="loading"
        :tableData="tableData"
        :searchData="searchData"
        :tableLabel="tableLabel"
        :tablePage="tablePage"
        :tableEvents="tableEvents"
        :height="height"
      >
        <template #class="{ row }">
          <div>
            <span v-if="!row.isShowClass" @click="clickClass(row)">
              {{ row.iconClassifyName }}</span
            >
            <el-input
              v-else
              style="margin-top: 5px; width: 160px"
              @blur="(e) => classBlur(row)"
              autofocus
              maxLength="20"
              type="text"
              size="mini"
              v-model="row.iconClassifyName"
            />
            <span
              class="el-icon-error"
              @click="delClass(row)"
              v-if="isDel"
              style="margin-left: 5px"
            ></span>
          </div>
        </template>
        <template #content="{ row }">
          <div class="container">
            <div
              class="wrap"
              v-for="(v, i) in row.iconDetailList"
              :key="i"
              @click="choice(v)"
            >
              <img
                :class="{ active: v.isActive }"
                :src="v.iconUrl"
                width="58"
                height="60"
              />
              <el-tooltip
                :disabled="v.isHidetip"
                v-if="!v.isShowInput"
                :content="v.iconName"
                placement="bottom"
                effect="light"
              >
                <div
                  @mouseenter="(e) => handleMouseEnter(e, v)"
                  class="iconNameBox clamp"
                  @click="clickIconName(v)"
                >
                  {{ v.iconName }}
                </div>
              </el-tooltip>

              <el-input
                v-else
                style="margin-top: 5px"
                @blur="(e) => iconNameblur(v)"
                autofocus
                maxLength="10"
                type="text"
                size="mini"
                v-model="v.iconName"
              />
              <span
                class="el-icon-close close"
                v-if="isDel"
                @click="delIcon(v)"
              ></span>
            </div>
            <div class="wrap" v-if="isPageFrom === menuEnum.timelineIcon">
              <span
                slot="reference"
                class="el-icon-plus add"
                @click="addIcon(row)"
              ></span>
            </div>
          </div>
        </template>
      </tableSearch>
    </div>
    <el-dialog
      :title="row.id ? '编辑ICON' : '上传ICON'"
      :visible.sync="addVisible"
      width="30%"
      v-if="addVisible"
      :close-on-click-modal="false"
    >
      <uploadIcon v-if="addVisible" :row="row"></uploadIcon>
    </el-dialog>
    <el-dialog
      title="新增分类"
      :visible.sync="addClassVisible"
      width="30%"
      height="500px"
      :close-on-click-modal="false"
    >
      <createClass v-if="addClassVisible" :row="row" />
    </el-dialog>
  </div>
</template>

<script>
import {
  iconClassifyPageList,
  deleteIconClassify,
  iconClassifyUpdateIconClassify,
  iconClassifySaveIconClassify,
  iconDetailUpdateIconDetail,
} from "@/api/admin/index";
import uploadIcon from "./component/uploadIcon.vue";
import createClass from "./component/createClass.vue";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { filterNullSearchData, resetSearchData, menuEnum } from "@/util/util";
export default {
  components: {
    tableSearch,
    search,
    uploadIcon,
    createClass,
  },
  props: {
    paramsRow: {
      type: Object,
      default: () => {},
    },
    isPageFrom: {
      type: String,
      required: false,
      default: menuEnum.timelineIcon,
    },
    height: {
      type: Number,
      required: false,
      default: undefined,
    },
  },
  data() {
    return {
      menuEnum: menuEnum,
      selectionData: [],
      loading: false,
      selectItem: {},
      row: {},
      addVisible: false,
      addClassVisible: false,
      isDel: false,
      tableEvents: {
        selectionChange: (val) => {
          this.selectionData = val;
        },
      },
      searchForm: [
        {
          type: "input",
          prop: "iconName",
          placeholder: "请输入ICON名称",
        },
      ],
      searchData: {
        iconName: "",
      },
      searchHandle: [
        {
          label: "查询",
          type: "primary",
          callback: () => {
            this.tablePage.current = 1;
            this.getList();
          },
        },
        {
          label: "重置",
          callback: () => {
            resetSearchData(this.searchData);
            this.tablePage.size = 10;
            this.tablePage.current = 1;
            this.getList();
          },
        },
        {
          label: "上传",
          type: "primary",
          callback: () => {
            this.addVisible = true;
            this.row = {
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.addVisible = false;
              },
            };
          },
          auth: () => this.isPageFrom === menuEnum.timelineIcon,
        },
        {
          label: "删除/批量删除",
          type: "danger",
          callback: () => {
            this.isDel = !this.isDel;
          },
          auth: () => !this.isDel && this.isPageFrom === menuEnum.timelineIcon,
        },
        {
          label: "取消",
          type: "primary",
          callback: () => {
            this.isDel = !this.isDel;
          },
          auth: () => this.isDel,
        },
        {
          label: "新增分类",
          type: "primary",
          callback: () => {
            this.addClassVisible = true;
            this.row = {
              callback: (data) => {
                if (data?.name) {
                  iconClassifySaveIconClassify({
                    iconClassifyName: data?.name,
                  }).then(() => {
                    this.$message.success("新增分类成功");
                    this.addClassVisible = false;
                    this.getList();
                  });
                } else {
                  this.addClassVisible = false;
                }
              },
            };
          },
          auth: () => this.isPageFrom === menuEnum.timelineIcon,
        },
        {
          label: "确认",
          type: "primary",
          callback: () => {
            this.paramsRow.callback(this.selectItem);
          },
          auth: () => !this.isPageFrom,
          disabled: () => !this.selectItem.id,
        },
      ],
      tableData: [],
      tableLabel: [
        {
          label: "分类",
          type: "slot",
          slotName: "class",
          width: "200",
          align: "left",
        },
        {
          label: "内容",
          type: "slot",
          slotName: "content",
          align: "left",
        },
      ],

      tablePage: {
        total: 0,
        current: 1,
        size: 10,
        pagination: (val) => {
          this.tablePage.current = val.page;
          this.tablePage.size = val.limit;
          this.getList();
        },
      },
    };
  },
  mounted() {
    this.getList();
  },

  methods: {
    handleMouseEnter(target, item) {
      if (target.target.scrollWidth > target.target.offsetWidth) {
        item.isHidetip = false;
      } else {
        item.isHidetip = true;
      }
    },
    addIcon(row) {
      this.addVisible = true;
      this.row = {
        ...row,
        callback: (data) => {
          this.addVisible = false;
          if (data) {
            this.getList();
          }
        },
      };
    },
    choice(item) {
      this.tableData.forEach((v) => {
        if (v.iconDetailList && v.iconDetailList.length) {
          v.iconDetailList.forEach((m) => {
            if (m === item) {
              m.isActive = true;
            } else {
              m.isActive = false;
            }
          });
        }
      });
      this.selectItem = item;
    },
    clickClass(item) {
      // if (!this.isDel) return;
      this.tableData.forEach((m) => {
        if (m.id === item.id) {
          m.isShowClass = true;
        } else {
          m.isShowClass = false;
        }
      });
    },
    clickIconName(item) {
      // if (!this.isDel) return;
      this.tableData.forEach((v) => {
        if (v.iconDetailList && v.iconDetailList.length) {
          v.iconDetailList.forEach((m) => {
            if (m === item) {
              m.isShowInput = true;
            } else {
              m.isShowInput = false;
            }
          });
        }
      });
    },
    delIcon(item) {
      deleteIconClassify({ iconId: item.id }).then(() => {
        this.$message.success("删除成功");
        this.getList();
      });
    },
    delClass(row) {
      this.$confirm("确认删除该分类及分类下所有的图标吗?", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteIconClassify({ id: row.id }).then(() => {
          this.$message.success("删除成功");
          this.getList();
        });
      });
    },
    classBlur(item) {
      iconClassifyUpdateIconClassify({
        iconClassifyName: item.iconClassifyName,
        id: item.id,
      }).then(() => {
        this.$message.success("修改成功");
        item.isShowClass = false;
        this.getList();
      });
    },
    iconNameblur(item) {
      iconDetailUpdateIconDetail({ id: item.id, iconName: item.iconName }).then(
        () => {
          this.$message.success("修改成功");
          item.isShowInput = false;
          this.getList();
        }
      );
    },
    getList() {
      const params = {
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      iconClassifyPageList(params)
        .then((res) => {
          this.loading = false;
          res.data.data.records.forEach((v) => {
            v.isShowClass = false;
            if (v.iconDetailList && v.iconDetailList.length) {
              v.iconDetailList.forEach((m) => {
                m.isShowInput = false;
                m.isActive = false;
                m.isHidetip = true;
              });
            }
          });
          this.tableData = res.data.data.records;
          this.tablePage.total = res.data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
  .wrap {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    margin-right: 10px;
    width: 60px;
    height: 90px;
    margin-top: 10px;
    cursor: pointer;
    .iconNameBox {
      padding: 3px;
      font-size: 11px;
      width: 60px;
      text-align: center;
    }
    .close {
      position: absolute;
      right: -6px;
      top: -6px;
      z-index: 2;
      cursor: pointer;
      background: #999;
      border-radius: 6px;
      color: #fff;
      display: none;
    }
    &:hover {
      .close {
        display: block;
      }
    }

    .add {
      width: 60px;
      height: 60px;
      background: #d4d3d3;
      text-align: center;
      line-height: 60px;
      cursor: pointer;
    }
  }
  ::v-deep .el-input__inner {
    padding: 0 3px;
  }
}
</style>
