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
      :isIndex="true"
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
      <addBackendTags :row="row"></addBackendTags>
    </el-dialog>
  </div>
</template>

<script>
import { optionStatus, EnumStatus, debounceCallBack } from "@/util/util";
import addBackendTags from "@/views/content/classify/component/addBackendTags.vue";
import {
  getVideoCount,
  classifyWebPage,
  classifyWebDelete,
} from "@/api/content/classify";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { pageHandle } from "@/util/pageHandle";
import { mapGetters } from "vuex";

export default {
  components: {
    tableSearch,
    search,
    addBackendTags,
  },
  data() {
    return {
      loading: false,
      visible: false,
      // in8nVisible: false,
      row: {},
      searchForm: [
        {
          type: "input",
          prop: "classifyName",
          placeholder: "请输入标签名称",
          clearable: true,
        },
        // {
        //   type: "select",
        //   prop: "classifyStatus",
        //   placeholder: "请选择状态",
        //   clearable: true,
        //   options: optionStatus,
        // },
      ],
      searchData: {
        classifyName: "",
        classifyStatus: "",
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
        {
          label: "新建",
          type: "primary",
          callback: () => {
            this.visible = true;
            this.row = {
              callback: (data) => {
                if (data) {
                  this.getList();
                  this.$store.dispatch("actionAdminTag");
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
          label: "标签名称",
          type: "html",
          html: (row) => {
            return `<span>${row.classifyName}</span>`;
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
          label: "操作",
          type: "slot",
          slotName: "slotBtn",
          width: "100",
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
      classifyWebPage(params)
        .then((res) => {
          const { data } = res;
          if (data.code == 200) {
            this.loading = false;
            this.tableData = data?.data?.records.map((v) => {
              v.btnList = this.getBtnList(v);
              return v;
            });
            this.tablePage.total = data?.data?.total - 0;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getBtnList(row) {
      const btnList = [];
      const str = row.classifyStatus == EnumStatus.OFF ? "btnDisable" : "";
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
                  this.$store.dispatch("actionAdminTag");
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
      return btnList;
    },
    getTagCount(row) {
      return this.$confirm("此操作将永久删除该标签, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return classifyWebDelete({ id: row.id }).then((res) => {
            const newCurrent = pageHandle(
              this.tablePage.current,
              this.tablePage.size,
              this.tablePage.total
            );
            this.tablePage.current = newCurrent;
            this.$message.success("删除成功!");
            this.getList();
            this.$store.dispatch("actionAdminTag");
            return Promise.resolve(res);
          });
        })
        .catch(() => {});
    },
    search() {
      this.tablePage.current = 1;
      this.getList();
    },
    reset() {
      this.searchData.classifyName = "";
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
