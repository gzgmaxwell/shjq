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
      :operation="{}"
      :isSelection="false"
      :isIndex="true"
    >
    </tableSearch>
    <el-dialog
      :title="row.id ? '编辑' : '新建'"
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
    >
      <createAdPos :row="row" v-if="visible" />
    </el-dialog>
  </div>
</template>

<script>
import { pageHandle } from "@/util/pageHandle";
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import createAdPos from "./createAdPos.vue";
import { advertisingspace, deletespace } from "@/api/content/advertising";
import { optionAdType, optionComStatus, optionLocationType } from "@/util/util";
export default {
  components: {
    tableSearch,
    search,
    createAdPos,
  },
  data() {
    return {
      visible: false,
      row: {},
      loading: false,
      searchForm: [
        {
          type: "input",
          prop: "advertLocationName",
          placeholder: "广告位名称",
          clearable: true,
        },
        {
          type: "select",
          prop: "status",
          placeholder: "请选择状态",
          clearable: true,
          options: optionComStatus,
        },
        {
          type: "select",
          prop: "locationType",
          placeholder: "请选择页面类型",
          clearable: true,
          options: optionLocationType,
        },
        {
          type: "select",
          prop: "location",
          placeholder: "请选择广告类型",
          clearable: true,
          options: optionAdType,
        },
      ],
      searchData: {
        advertLocationName: "", //广告位名称
        location: "",
        locationType: "",
        status: "",
      },
      searchHandle: [
        { label: "search", type: "primary", callback: this.search },
        { label: "reset", callback: this.reset },
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
          prop: "advertLocationName",
          label: "广告位名称",
        },
        {
          prop: "navigationName",
          label: "所属页面",
        },
        {
          label: "广告类型",
          type: "filter",
          filter: (row) => {
            const item = optionAdType.find((v) => v.id === row.location) || {};
            return item.name;
          },
        },
        {
          label: "状态",
          type: "filter",
          filter: (row) => {
            const item = optionComStatus.find((v) => v.id === row.status) || {};
            return item.name;
          },
        },
        {
          prop: "videoWeight",
          label: "视频权重",
        },
        {
          prop: "imgWeight",
          label: "图片权重",
        },
        {
          prop: "creator",
          label: "创建人",
        },
        {
          prop: "createTime",
          label: "创建时间",
        },
        {
          label: "操作",
          type: "html",
          width: "110",
          html: () => {
            const btn = `<span class='link comBtn' data-tagName="edit">编辑</span>
            <span class='danger comBtn' data-tagName="del"> 删除</span>`;
            return btn;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "edit") {
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
              this.del(row.id);
            }
          },
        },
      ],
      tablePage: {
        total: 1,
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
    getList() {
      const params = {
        ...this.searchData,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      advertisingspace(params)
        .then((res) => {
          const { data } = res;
          this.loading = false;
          data.data.records.forEach((v) => (v.visible = false));
          this.tableData = data.data.records;
          this.tablePage.total = data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    del(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletespace({ id: id }).then((res) => {
            if (res.data.code == 200) {
              const newCurrent = pageHandle(
                this.tablePage.current,
                this.tablePage.size,
                this.tablePage.total
              );
              this.tablePage.current = newCurrent;
              this.$message.success("删除成功");
              this.getList();
            }
          });
        })
        .catch(() => {});
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
