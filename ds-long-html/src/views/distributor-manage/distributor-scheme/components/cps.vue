<template>
  <div class="mt10">
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
      :tableEvents="tableEvents"
      :isSelection="false"
      :isIndex="true"
    >
    </tableSearch>
    <el-dialog
      :title="row.id ? $t('edit') : $t('add')"
      :visible.sync="visible"
      width="40%"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <cpsEdit v-if="visible" :row="row"></cpsEdit>
    </el-dialog>
  </div>
</template>

<script>
import {
  EnumChannelStatus,
  optionChannelStatus,
  optionsSchemeType,
  EnumSCHEMETYPE,
} from "@/util/util";
import { mapGetters } from "vuex";
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import {
  clearingSchemeList,
  updateClearingSchemeStatus,
  deleteClearingSchemes,
} from "@/api/admin/index";
import cpsEdit from "@/views/distributor-manage/distributor-scheme/cpsEdit.vue";
import { pageHandle } from "@/util/pageHandle";
export default {
  components: {
    tableSearch,
    search,
    cpsEdit,
  },
  data() {
    return {
      visible: false,
      row: {},
      loading: false,
      selectionData: [],
      that: this,
      searchForm: [
        {
          type: "input",
          prop: "schemeName",
          placeholder: "方案名称",
          clearable: true,
        },
        {
          type: "input",
          prop: "createName",
          placeholder: "创建人",
          clearable: true,
        },
      ],
      searchData: {
        schemeName: "",
        createName: "",
      },
      searchHandle: [
        {
          label: "查询",
          type: "primary",
          callback: this.search,
        },
        {
          label: "重置",
          callback: this.reset,
        },
        {
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
        // 1.31日需求隐藏
        // {
        //   label: "方案类型",
        //   prop: "schemeType",
        //   type: "filter",
        //   filter: (row) => {
        //     const item = optionsSchemeType.find((item) => {
        //       return item.id === row.schemeType;
        //     });
        //     return item?.name;
        //   },
        // },
        {
          label: "方案名称",
          prop: "schemeName",
        },
        // 1.31日需求隐藏
        // {
        //   label: "游戏发行方分成",
        //   prop: "gamePublishersRatio",
        //   type: "filter",
        //   filter: (row) => {
        //     if (row.schemeType === EnumSCHEMETYPE.game_cps) {
        //       return `${row.gamePublishersRatio}%`;
        //     }
        //     return `-`;
        //   },
        // },
        // {
        //   label: "游戏平台分成",
        //   type: "filter",
        //   filter: (row) => {
        //     if (row.schemeType === EnumSCHEMETYPE.game_cps) {
        //       return `${row.platformRatio}%`;
        //     }
        //     return `-`;
        //   },
        // },
        // {
        //   label: "游戏渠道商分成",
        //   type: "filter",
        //   filter: (row) => {
        //     if (row.schemeType === EnumSCHEMETYPE.game_cps) {
        //       return `${row.distrRatio}%`;
        //     }
        //     return `-`;
        //   },
        // },
        // {
        //   label: "视频平台分成",
        //   type: "filter",
        //   filter: (row) => {
        //     if (row.schemeType === EnumSCHEMETYPE.cps) {
        //       return `${row.platformRatio}%`;
        //     }
        //     return `-`;
        //   },
        // },
        {
          label: "视频渠道商分成",
          type: "filter",
          filter: (row) => {
            if (row.schemeType === EnumSCHEMETYPE.cps) {
              return `${row.distrRatio}%`;
            }
            return `-`;
          },
        },
        {
          label: "状态",
          prop: "status",
          type: "filter",
          filter: (row) => {
            const item = optionChannelStatus.find((item) => {
              return item.id === row.status;
            });
            return item?.name;
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
          label: "operate",
          type: "html",
          width: "140",
          html: (row) => {
            const edit = `<span class='link comBtn' data-tagName="edit">${this.$t(
              "edit"
            )}</span>`;
            const del = `<span class='danger comBtn' data-tagName="del">删除</span>`;
            let enable = `<span class='link comBtn' data-tagName="enable">${this.$t(
              "enable"
            )}</span>`;
            let disabled = `<span class='danger comBtn' data-tagName="disabled">${this.$t(
              "disable"
            )}</span>`;
            if (row.status == EnumChannelStatus.disabled) {
              return edit + del + enable;
            } else if (row.status == EnumChannelStatus.normal) {
              return edit + del + disabled;
            }
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            const operations = {
              enable: {
                confirmMessage: `${this.$t("confirm_enable")}`,
                successMessage: `${this.$t("success_enabled")}`,
              },
              disabled: {
                confirmMessage: `${this.$t("confirm_disable")}`,
                successMessage: `${this.$t("success_disable")}`,
              },
            };

            const operation = operations[tagname];
            if (operation) {
              const { confirmMessage, successMessage } = operation;

              this.$confirm(confirmMessage, `${this.$t("prompt")}`, {
                confirmButtonText: `${this.$t("determine")}`,
                cancelButtonText: `${this.$t("cancel")}`,
                type: "warning",
              })
                .then(() => {
                  const params = {
                    id: row.id,
                    status: tagname === "enable" ? "NORMAL" : "DISABLED",
                  };
                  updateClearingSchemeStatus(params).then((res) => {
                    const { data } = res;
                    if (data.code == 200) {
                      this.$message.success(successMessage);
                      this.getList();
                    }
                  });
                })
                .catch(() => {});
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
              this.$confirm(this.$t("confirm_content"), this.$t("prompt"), {
                confirmButtonText: this.$t("determine"),
                cancelButtonText: this.$t("cancel"),
                type: "warning",
              }).then(() => {
                const params = {
                  schemeId: row.id,
                };
                deleteClearingSchemes(row.id).then((res) => {
                  const { data } = res;
                  if (data.code == 200) {
                    const newCurrent = pageHandle(
                      this.tablePage.current,
                      this.tablePage.size,
                      this.tablePage.total
                    );
                    this.tablePage.current = newCurrent;
                    this.$message.success(`${this.$t("successfully_deleted")}`);
                    this.getList();
                  }
                });
              });
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
      tableEvents: {
        selectionChange: (val) => {},
      },
    };
  },
  computed: {
    ...mapGetters({ dictionary: "dictionary" }),
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
        platformType: "2",
      };
      this.loading = true;
      clearingSchemeList(params).then((res) => {
        const { data } = res;
        this.loading = false;
        this.tableData = data.data.records;
        this.tablePage.total = data.data.total;
      });
    },
    search() {
      this.tablePage.current = 1;
      this.getList();
    },
    reset() {
      this.searchData.schemeName = "";
      this.searchData.createName = "";
      this.getList();
    },
  },
};
</script>
