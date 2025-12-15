<template>
  <basic-container>
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
      <template #content="{ row, index }">
        <span
          @click="item.callback({ row, index })"
          v-for="(item, i) in row.btnList"
          :class="item.class"
          :key="i"
          >{{ item.name }}</span
        >
      </template>
    </tableSearch>
    <el-dialog
      :visible.sync="visible"
      width="1202px"
      v-if="visible"
      :title="row.id ? '编辑' : '新建'"
      :close-on-click-modal="false"
    >
      <editVersion :row="row" v-if="visible"></editVersion>
    </el-dialog>
    <el-dialog
      :visible.sync="in18nVisible"
      width="60%"
      title="国际化"
      :close-on-click-modal="false"
    >
      <comIn18n
        :row="row"
        v-if="in18nVisible"
        :langKey="row.languageKey || ''"
      />
    </el-dialog>
  </basic-container>
</template>

<script>
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { optionsVersionUpdate } from "@/util/types";
import { editionList, delObj } from "@/api/admin/version";
import editVersion from "@/views/admin/version_new/editVersion.vue";
import comIn18n from "@/views/common/commVideo/comIn18n.vue";
import { optLong, resetSearchData } from "@/util/util";
import { mapGetters } from "vuex";

export default {
  components: {
    editVersion,
    comIn18n,
    search,
    tableSearch,
  },
  data() {
    return {
      loading: false,
      visible: false,
      in18nVisible: false,
      optionsVersionUpdate,
      row: {},
      searchData: {
        versionOfficial: "",
      },
      searchForm: [
        {
          type: "input",
          prop: "versionOfficial",
          placeholder: "请输入官方版本号",
          clearable: true,
        },
      ],
      searchHandle: [
        {
          label: "search",
          type: "primary",

          callback: () => {
            this.tablePage.current = 1;
            this.getList();
          },
        },
        {
          label: "reset",
          callback: () => {
            resetSearchData(this.searchData);
            this.tablePage.current = 1;
            this.tablePage.size = 10;
            this.getList();
          },
        },
        {
          auth: () => this.permissions.sys_version_add,
          label: "add",
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
          prop: "versionOfficial",
          label: "官方版本号",
        },
        {
          prop: "platform",
          label: "平台",
        },
        {
          label: "是否上线",
          type: "filter",
          filter: (row) => {
            return row.online ? "正式上线" : "预上线";
          },
        },
        {
          label: "是否强制更新",
          type: "filter",
          filter: (row) => {
            return this.optionsVersionUpdate.find(
              (v) => v.id === row.forceUpdate
            )?.name;
          },
        },
        {
          prop: "updateContent",
          label: "更新内容",
        },
        {
          label: "视频平台",
          type: "filter",
          filter: (row) => {
            return optLong.find((v) => v.id === row.registerBusPlatformId)
              ?.name;
          },
        },
        {
          prop: "packageName",
          label: "启用包名/签",
        },
        {
          prop: "createTime",
          label: "创建时间",
        },
        {
          prop: "pushTime",
          label: "推送时间",
        },
        {
          label: "已推送",
          type: "filter",
          filter: (row) => {
            const timestamp = Date.parse(row.pushTime);
            const yesterday = new Date().getTime();
            if (timestamp < yesterday) {
              return "是";
            }
            return "否";
          },
        },
        {
          label: "操作",
          type: "slot",
          slotName: "content",
          width: "150",
        },
      ],
      tablePage: {
        total: 10,
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
      editionList(params)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.data.records.map((v) => {
            v.btnList = this.getBtnList(v);
            return v;
          });
          this.tablePage.total = res.data?.data?.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getBtnList(row) {
      const btnList = [];
      if (this.permissions.sys_version_edit) {
        btnList.push({
          name: "编辑",
          class: "comBtn link",
          callback: ({ row }) => {
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
        });
      }
      if (this.permissions.sys_version_del) {
        btnList.push({
          name: "删除",
          class: "comBtn danger",
          callback: () => {
            this.$confirm(this.$t("confirm_content"), this.$t("prompt"), {
              confirmButtonText: this.$t("determine"),
              cancelButtonText: this.$t("cancel"),
              type: "warning",
            }).then(() => {
              delObj(row.id).then(() => {
                this.getList();
                this.$notify.success(this.$t("successfully_deleted"));
              });
            });
          },
        });
      }

      if (this.permissions.sys_version_language) {
        btnList.push({
          name: "国际化",
          class: "comBtn link",
          callback: ({ row }) => {
            this.in18nVisible = true;
            this.row = {
              ...row,
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.in18nVisible = false;
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
