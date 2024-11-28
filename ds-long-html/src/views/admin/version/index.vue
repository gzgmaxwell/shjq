<template>
  <basic-container>
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
      </tableSearch>
      <el-dialog
        :visible.sync="visible"
        width="60%"
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
    </div>
  </basic-container>
</template>

<script>
import { optionsVersionUpdate, resetSearchData } from "@/util/util";
import { editionList } from "@/api/admin/version";
import editVersion from "@/views/admin/version/editVersion.vue";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import comIn18n from "@/views/common/commVideo/comIn18n.vue";
export default {
  components: {
    tableSearch,
    search,
    editVersion,
    comIn18n,
  },
  data() {
    return {
      timestamp: "",
      yesterday: new Date().getTime(),
      loading: false,
      title: "",
      visible: false,
      in18nVisible: false,
      row: {},
      searchForm: [
        {
          labelWidth: "75",
          type: "input",
          prop: "versionOfficial",
          placeholder: "请输入官方版本号",
          clearable: true,
        },
      ],
      searchData: {
        versionOfficial: "",
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
          prop: "versionOfficial",
          label: "官方版本号",
        },

        {
          prop: "platform",
          label: "平台",
        },
        {
          prop: "forceUpdate",
          label: "是否强制更新",
          type: "filter",
          filter: (row) => {
            return optionsVersionUpdate.find((v) => {
              return v.id === row.forceUpdate;
            })?.name;
          },
        },
        {
          prop: "updateContent",
          label: "更新内容",
          width: "400",
        },
        {
          prop: "apkFileName",
          label: "全量包",
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
          type: "html",
          html: (row) => {
            const timestamp = Date.parse(row.pushTime);
            const yesterday = new Date().getTime();
            if (timestamp < yesterday) {
              return `<span >是</span>`;
            } else {
              return `<span >否</span>`;
            }
          },
        },
        {
          label: "操作",
          type: "html",
          width: "120",
          html: (row) => {
            const timestamp = Date.parse(row.pushTime);
            const yesterday = new Date().getTime();
            let str = "";
            const edit = `<span class='link comBtn' data-tagName="edit">编辑</span>`;
            const in18n = `<span class='link comBtn' data-tagName="in18n">国际化</span>`;
            if (timestamp > yesterday) {
              str += edit;
              str += in18n;
            }
            return str;
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
            }

            if (tagname === "in18n") {
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
          this.tableData = res.data?.data?.records;
          this.tablePage.total = res.data?.data?.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
