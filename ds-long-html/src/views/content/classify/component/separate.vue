<template>
  <div>
    <search
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :tableEvents="tableEvents"
      :isSelection="true"
    >
      <template #slotBtn="{ row, index }">
        <span
          @click="item.callback({ row, index })"
          v-for="item in row.btnList"
          :class="item.class"
          :key="item.name"
          >{{ item.name }}</span
        >
      </template>
    </tableSearch>
    <el-dialog
      :visible.sync="visible"
      width="30%"
      center
      v-if="visible"
      :title="row.id ? '编辑' : '新建'"
      :close-on-click-modal="false"
    >
      <addClassify :row="row"></addClassify>
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
</template>

<script>
import {
  optionStatus,
  optionsShowStyle,
  debounceCallBack,
  resetSearchData,
} from "@/util/util";
import createIn18n from "@/views/content/navigation/component/createIn18n.vue";
import addClassify from "@/views/content/classify/component/addClassify.vue";
import {
  curriculum,
  removeby,
  update,
  getVideoCount,
} from "@/api/content/classify";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { pageHandle } from "@/util/pageHandle";
import { mapGetters } from "vuex";

export default {
  components: {
    tableSearch,
    search,
    addClassify,
    createIn18n,
  },
  data() {
    return {
      loading: false,
      visible: false,
      in8nVisible: false,
      row: {},
      selectionData: [],
      tableEvents: {
        selectionChange: (val) => {
          this.selectionData = val;
        },
      },
      searchForm: [
        {
          type: "input",
          prop: "classifyName",
          placeholder: "请输入标签名称",
          clearable: true,
        },
        {
          type: "select",
          prop: "classifyStatus",
          placeholder: "请选择状态",
          clearable: true,
          options: optionStatus,
          labelValue: {
            label: "label",
            value: "id",
          },
        },
      ],
      searchData: {
        classifyName: "",
        classifyStatus: "",
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
            this.tablePage.total = 0;
            this.tablePage.current = 1;
            this.tablePage.size = 10;
            this.getList();
          },
        },
        {
          label: "新建",
          type: "primary",
          callback: () => {
            this.visible = true;
            this.row = {
              callback: (data) => {
                if (data) {
                  this.getList();
                  this.$store.dispatch("actionClassify");
                }
                this.visible = false;
              },
            };
          },
          auth: () => this.permissions.classify_add,
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "sortValue",
          label: "排序",
        },
        {
          label: "标签名称",
          type: "html",
          html: (row) => {
            if (row.defaultFlag === 1) {
              return `<span>${row.classifyName} </span>  <span class='tags'>默认标签</span>`;
            } else {
              return `<span>${row.classifyName}</span>`;
            }
          },
        },
        {
          prop: "type",
          label: "展示样式",
          type: "filter",
          filter: (row) => {
            const item = optionsShowStyle.find((v) => v.id == row.type);
            return item ? item.name : "";
          },
        },
        {
          prop: "createUserName",
          label: "创建人",
        },
        {
          prop: "createTime",
          label: "创建时间",
        },
        {
          label: "状态",
          type: "filter",
          filter: (row) => {
            const item = optionStatus.find((v) => v.id == row.classifyStatus);
            return item?.label;
          },
        },
        {
          label: "操作",
          type: "slot",
          slotName: "slotBtn",
          width: "220",
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

  computed: {
    ...mapGetters({
      permissions: "permissions",
    }),
    selectedTimeLength() {
      return videoLength(this.searchData.tiemData, optionsTimeType);
    },
  },
  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      const params = {
        ...this.searchData,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      curriculum(params)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data?.data?.records.map((v) => {
            v.btnList = this.getBtnList(v);
            return v;
          });
          this.tablePage.total = res.data?.data?.total - 0;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getBtnList(row) {
      const btnList = [];
      if (this.permissions?.classify_edit) {
        btnList.push({
          name: "编辑",
          class: "comBtn link",
          callback: () => {
            this.visible = true;
            this.row = {
              ...row,
              callback: (data) => {
                if (data) {
                  this.getList();
                  this.$store.dispatch("actionClassify");
                }
                this.visible = false;
              },
            };
          },
        });
      }

      if (this.permissions?.classify_del) {
        btnList.push({
          name: "删除",
          class: "comBtn danger",
          callback: () => {
            debounceCallBack(this.getTagCount)(row);
          },
        });
      }

      if (this.permissions?.classify_app_in18n) {
        btnList.push({
          name: "国际化",
          class: "comBtn link",
          callback: () => {
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
          },
        });
      }

      if (row.defaultFlag == 1) {
        btnList.push({
          name: "取消默认",
          class: `comBtn link`,
          callback: () => {
            const params = {
              id: row.id,
              defaultFlag: 0,
              classifyName: row.classifyName,
              classifyStatus: row.classifyStatus - 0,
              sortValue: row.sortValue,
            };
            update(params).then((res) => {
              const { data } = res;
              if (data.code == 200) {
                this.$message.success("取消默认成功");
                this.getList();
              }
            });
          },
        });
      }

      if (row.defaultFlag != 1) {
        btnList.push({
          name: "设为默认",
          class: `comBtn link`,
          callback: () => {
            const params = {
              id: row.id,
              defaultFlag: 1,
              classifyName: row.classifyName,
              classifyStatus: row.classifyStatus - 0,
              sortValue: row.sortValue,
            };
            update(params).then((res) => {
              const { data } = res;
              if (data.code == 200) {
                this.$message.success("设为默认成功");
                this.getList();
              }
            });
          },
        });
      }

      return btnList;
    },
    getTagCount(row) {
      this.loading = true;
      return getVideoCount({ id: row.id })
        .then((res) => {
          let count;
          if (res.data.code == 200) {
            this.loading = false;
            count = res.data.data;
          }
          this.$confirm(
            `此标签下关联${count}视频,对应的视频将会无法通过此标签检索到,APP端也将不会显示此标签, 是否继续?`,
            "请注意!",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(() => {
              this.$confirm("此操作将永久删除该标签, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  return removeby({ id: row.id }).then((res) => {
                    const newCurrent = pageHandle(
                      this.tablePage.current,
                      this.tablePage.size,
                      this.tablePage.total
                    );
                    this.tablePage.current = newCurrent;
                    this.$message.success("删除成功!");
                    this.getList();
                    this.$store.dispatch("actionClassify");
                    return Promise.resolve(res);
                  });
                })
                .catch(() => {});
            })
            .catch(() => {});
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
