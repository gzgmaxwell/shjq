<template>
  <basic-container>
    <div>
      <search
        :that="that"
        :searchData="searchData"
        :searchForm="searchForm"
        :searchHandle="searchHandle"
      >
      </search>
      <tableSearch
        :loading="loading"
        :that="that"
        :tableData="tableData"
        :searchData="searchData"
        :tableLabel="tableLabel"
        :tablePage="tablePage"
        :tree-props="treeProps"
        row-key="id"
      >
      </tableSearch>
      <el-dialog
        :visible.sync="visible"
        width="30%"
        :title="compuTitle(row)"
        :close-on-click-modal="false"
      >
        <alter v-if="visible" :switchs="switchs" :row="row"></alter>
      </el-dialog>
      <el-dialog
        :visible.sync="in8nVisible"
        width="30%"
        title="国际化"
        :close-on-click-modal="false"
      >
        <createIn18n v-if="in8nVisible" :row="row" />
      </el-dialog>
    </div>
  </basic-container>
</template>

<script>
import alter from "./component/alter.vue";
import createIn18n from "@/views/content/navigation/component/createIn18n";
import {
  optionsNavigationType,
  optionComStatus,
  EnumComStatus,
  optionsNavigationLevel,
  EnumNavigationLevel,
} from "@/util/util";
import { guided, deletetablist } from "@/api/content/navigation";
import addClassify from "@/views/content/classify/component/addClassify.vue";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { pageHandle } from "@/util/pageHandle";

export default {
  components: {
    tableSearch,
    search,
    addClassify,
    alter,
    createIn18n,
  },
  data() {
    return {
      switchs: true,
      loading: false,
      that: this,
      title: "",
      visible: false,
      in8nVisible: false,
      row: {},
      treeProps: {
        children: "children",
      },
      searchForm: [
        {
          labelWidth: "75",
          label: "导航名称",
          type: "input",
          prop: "navigationName",
          placeholder: "导航名称",
          clearable: true,
        },
      ],
      searchData: {
        navigationName: "",
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
        {
          label: "新增",
          type: "primary",
          callback: () => {
            this.visible = true;
            this.row = {
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.visible = false;
              },
            };
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          label: "导航名称",
          align: "left",
          type: "html",
          html: (row) => {
            const className = row.level == 1 ? "fontBold" : "";
            return `<span class=${className}>${row.navigationName}</span>`;
          },
        },
        {
          prop: "navigationType",
          label: "导航类型",
          type: "filter",
          filter: (row) => {
            const item = optionsNavigationType.find((item) => {
              return item.id == row.navigationType;
            });
            return item?.name;
          },
        },
        {
          prop: "languageKey",
          label: "国际化语言Key",
        },

        {
          prop: "status",
          label: "状态",
          type: "html",
          html: (row) => {
            const item = optionComStatus.find((item) => {
              return item.id === row.status;
            });
            const className =
              EnumComStatus.ON === row.status ? "start" : "must";
            return `<span class=${className}>${item?.name}</span>`;
          },
        },
        {
          prop: "level",
          label: "排序等级",
          type: "html",
          html: (row) => {
            const item = optionsNavigationLevel.find((item) => {
              return item.id === row.level;
            });
            const className =
              EnumNavigationLevel.firstLevel === row.level
                ? "status"
                : "arrange";
            return `<span class=${className}>${item.name}</span>`;
          },
        },
        {
          prop: "sort",
          label: "排序位置",
        },
        {
          prop: "labelName",
          label: "推荐标签",
        },
        {
          label: "操作",
          type: "html",
          width: "200",
          html: (row) => {
            let btn = `
              <span class='comBtn link' data-tagName="edit">编辑</span>
              <span class='comBtn danger' data-tagName="del">删除</span>`;
            let in18 = `<span class='comBtn link' data-tagName="in18">国际化</span>`;
            let add = `<span class='comBtn link' data-tagName="add">添加</span>`;
            if (row.level == EnumNavigationLevel.firstLevel) {
              return `${btn}${add}${in18}`;
            }
            return `${btn}${in18}`;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "add") {
              this.visible = true;
              this.row = {
                level: row.level,
                navigationType: row.navigationType,
                id: row.id,
                isAddTwoLevel: true,
                callback: (data) => {
                  if (data) {
                    this.getList();
                  }
                  this.visible = false;
                },
              };
            } else if (tagname === "edit") {
              this.visible = true;
              this.row = {
                ...row,
                callback: (data) => {
                  if (data) {
                    this.getList();
                  }
                  this.visible = false;
                },
              };
            } else if (tagname === "del") {
              this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  deletetablist({ id: Number(row.id) }).then((res) => {
                    const { data } = res;
                    if (data.code == 200) {
                      const newCurrent = pageHandle(
                        this.tablePage.current,
                        this.tablePage.size,
                        this.tablePage.total
                      );
                      this.tablePage.current = newCurrent;
                      this.$message.success("删除成功!");
                      this.getList();
                    }
                  });
                })
                .catch(() => {});
            } else if (tagname === "in18") {
              this.in8nVisible = true;
              this.row = {
                ...row,
                callback: (data) => {
                  if (data) {
                    this.getList();
                  }
                  this.in8nVisible = false;
                },
              };
            }
          },
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
  computed: {
    compuTitle() {
      return (row) => {
        if (!row.id) {
          return "新增";
        }
        if (row.isAddTwoLevel) {
          return "新增二级";
        }
        return "编辑";
      };
    },
  },

  methods: {
    getList() {
      const params = {
        ...this.searchData,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      guided(params)
        .then((res) => {
          const { data } = res;
          if (data.code == 200) {
            this.loading = false;
            this.tableData = data.data.records;
            this.tablePage.total = data.data.total;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },

    search() {
      this.tablePage.current = 1;
      this.getList();
    },
    reset() {
      this.searchData = {};
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .accessory {
  display: inline-block;
  width: 78px;
  height: 50px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
