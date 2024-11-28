<template>
  <div>
    <search
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
      <div style="position: absolute; right: 0; top: 0">
        <el-button type="primary" @click="control">
          {{ vipKeyStatus == 1 ? "开启" : "关闭" }}超级会员特邀</el-button
        >
      </div>
    </search>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
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
      <create :row="row"></create>
    </el-dialog>
    <div class="configDialog">
      <el-dialog
        :visible.sync="configVisible"
        width="500px"
        title="升级配置"
        :close-on-click-modal="false"
      >
        <configuration v-if="configVisible" :row="row" />
      </el-dialog>
    </div>
    <el-dialog
      title="操作日志"
      :visible.sync="logsVisible"
      width="70%"
      :close-on-click-modal="false"
    >
      <logs v-if="logsVisible" :row="row" />
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
  debounceCallBack,
  filterNullSearchData,
  resetSearchData,
} from "@/util/util";
import createIn18n from "@/views/content/navigation/component/createIn18n.vue";
import create from "./create.vue";
import configuration from "./configuration.vue";
import logs from "./logs.vue";
import { fetchList } from "@/api/admin/dict";
import {
  pageList,
  schemeDeleteScheme,
  updateDictByKey,
} from "@/api/admin/index";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { pageHandle } from "@/util/pageHandle";
import { mapGetters } from "vuex";

export default {
  components: {
    tableSearch,
    search,
    create,
    configuration,
    logs,
    createIn18n,
  },
  data() {
    return {
      loading: false,
      visible: false,
      configVisible: false,
      logsVisible: false,
      in8nVisible: false,
      vipKeyStatus: "",
      row: {},
      searchForm: [
        {
          type: "input",
          prop: "agentName",
          placeholder: "请输入代理名称",
          clearable: true,
        },
      ],
      searchData: {
        agentName: "",
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
          prop: "agentLevel",
          label: "代理等级",
        },
        {
          prop: "agentName",
          label: "代理名称",
        },
        {
          label: "分成比例",
          type: "html",
          html: (row) => {
            return `<span>${row.agentRatio}%</span>`;
          },
        },
        {
          label: "操作",
          type: "slot",
          slotName: "slotBtn",
          width: "270",
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
    this.getvipKeyStatus();
    this.getList();
  },

  methods: {
    getvipKeyStatus() {
      const params = {
        dictionaryKey: "EXT_USER_SVIP_SETTING",
      };
      fetchList(params).then((res) => {
        const { data } = res;
        this.vipKeyStatus = data.data.records.map((v) => v.dictionaryValue);
      });
    },
    control() {
      const params = {
        dictionaryKey: "EXT_USER_SVIP_SETTING",
        dictionaryValue: this.vipKeyStatus == 0 ? "1" : "0",
      };
      updateDictByKey(params).then(() => {
        this.getvipKeyStatus();
        this.$message.success(this.vipKeyStatus == 1 ? "开启成功" : "关闭成功");
      });
    },
    getList() {
      const params = {
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      pageList(params)
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
      btnList.push(
        {
          name: "编辑",
          class: "comBtn link",
          callback: () => {
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
          },
        },
        {
          name: "删除",
          class: "comBtn danger",
          callback: () => {
            this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                const comSubmit = () => {
                  return schemeDeleteScheme(row.id).then((res) => {
                    const newCurrent = pageHandle(
                      this.tablePage.current,
                      this.tablePage.size,
                      this.tablePage.total
                    );
                    this.tablePage.current = newCurrent;
                    this.$message.success("删除成功!");
                    this.getList();
                    Promise.resolve();
                  });
                };
                debounceCallBack(comSubmit)();
              })
              .catch(() => {});
          },
        },
        {
          name: "升级配置",
          class: "comBtn link",
          callback: () => {
            this.configVisible = true;
            this.row = {
              ...row,
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.configVisible = false;
              },
            };
          },
        },
        {
          name: "变更历史",
          class: "comBtn link",
          callback: () => {
            this.logsVisible = true;
            this.row = {
              ...row,
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.logsVisible = false;
              },
            };
          },
        }
      );

      if (this.permissions.nationalagent_agentconfig_in18n) {
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
      return btnList;
    },
  },
};
</script>
<style lang="scss" scoped>
@media screen and (max-width: 992px) {
  ::v-deep .configDialog .el-dialog {
    width: 500px !important;
  }
}
</style>
