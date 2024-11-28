<template>
  <basic-container>
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
        <!-- <el-dropdown v-if="row.btnList.length > 2">
          <span class="el-dropdown-link ml5 link">
            更多<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              @click.native="item.callback({ row, index })"
              v-for="item in row.btnList.slice(2)"
              :class="item.class"
              :key="item.name"
              >{{ item.name }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown> -->
      </template>
    </tableSearch>
    <el-dialog
      :title="row.id ? $t('edit') : $t('add')"
      :visible.sync="visible"
      center
      width="30%"
      :close-on-click-modal="false"
    >
      <revamp :row="row" v-if="visible"></revamp>
    </el-dialog>
    <el-dialog
      :title="$t('picture_preview')"
      :visible.sync="imgVisible"
      width="40%"
      append-to-body
      center
      :close-on-click-modal="false"
    >
      <img width="100%" :src="bigImage" alt="" />
    </el-dialog>
    <el-dialog
      :visible.sync="in8nVisible"
      width="30%"
      title="国际化"
      :close-on-click-modal="false"
    >
      <createIn18n v-if="in8nVisible" :row="row" />
    </el-dialog>
  </basic-container>
</template>
<script>
import createIn18n from "@/views/content/navigation/component/createIn18n.vue";
import { tabgetlist, deletelisttab } from "@/api/Appinventory/courses";
import revamp from "@/views/Appinventory/mymanage/component/revamp.vue";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { pageHandle } from "@/util/pageHandle";
import { optionsModuleType, optionStatus, EnumStatus } from "@/util/util";
import { mapGetters } from "vuex";
export default {
  components: {
    tableSearch,
    search,
    revamp,
    createIn18n,
  },
  data() {
    return {
      bigImage: "",
      loading: false,
      that: this,
      visible: false,
      imgVisible: false,
      in8nVisible: false,
      row: {},
      searchForm: [
        {
          type: "input",
          prop: "moduleName",
          placeholder: "feature_name",
          clearable: true,
          labelWidth: "75px",
        },
        {
          type: "select",
          prop: "moduleType",
          placeholder: "affiliation_module",
          clearable: true,
          options: optionsModuleType,
        },
      ],
      searchData: {
        moduleName: "",
        moduleType: "",
      },
      searchHandle: [
        { label: "search", type: "primary", callback: this.search },
        { label: "reset", callback: this.reset },
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
        {
          prop: "figmaKey",
          label: "figma 命名",
        },
        {
          prop: "moduleName",
          label: "feature_name",
        },
        {
          prop: "moduleType",
          label: "affiliation_module",
          type: "html",
          html: (row) => {
            const data = optionsModuleType.find(
              (item) => item.id == row.moduleType
            );
            return data.name;
          },
        },
        // {
        //   label: "icon",
        //   type: "html",
        //   html: (row) => {
        //     return row.iconFileUrl
        //       ? `<span class='accessory'><img  src="${row.iconFileUrl}"></span>`
        //       : "";
        //   },
        //   callback: (row, index, e) => {
        //     if (e.target.nodeName == "IMG") {
        //       this.imgVisible = true;
        //       this.bigImage = e.target.src;
        //     }
        //   },
        // },
        {
          prop: "sort",
          label: "sort",
          sortable: true,
        },
        {
          prop: "status",
          label: "status",
          type: "html",
          html: (row) => {
            const className = row.status === EnumStatus.ON ? "start" : "stop";
            const data = optionStatus.find((item) => item.id == row.status);
            return `<span class="${className}">${data.name}</span>`;
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
  computed: {
    ...mapGetters({
      permissions: "permissions",
    }),
  },
  mounted() {
    this.getList();
  },

  methods: {
    getList(data) {
      const params = {
        moduleName: data?.moduleName || undefined,
        moduleType: data?.moduleType || undefined,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      tabgetlist(params)
        .then((res) => {
          const { data } = res;
          if (data.code == 200) {
            this.loading = false;
            this.tableData = data.data.records.map((v) => {
              v.btnList = this.getBtnList(v);
              return v;
            });
            this.tablePage.total = data.data.total;
          }
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
        },
        {
          name: "删除",
          class: "comBtn danger",
          callback: ({ row }) => {
            this.$confirm(this.$t("confirm_content"), this.$t("prompt"), {
              confirmButtonText: this.$t("determine"),
              cancelButtonText: this.$t("cancel"),
              type: "warning",
            }).then(() => {
              deletelisttab({ id: row.id }).then((res) => {
                if (res.data.code == 200) {
                  const newCurrent = pageHandle(
                    this.tablePage.current,
                    this.tablePage.size,
                    this.tablePage.total
                  );
                  this.tablePage.current = newCurrent;
                  this.$message.success(this.$t("successfully_deleted"));
                  this.getList();
                }
              });
            });
          },
        }
      );
      if (this.permissions.sys_myManage_language) {
        btnList.push({
          name: "国际化",
          class: "comBtn link",
          callback: ({ row }) => {
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

    search() {
      this.tablePage.current = 1;
      let params;
      if (this.searchData) {
        params = {
          ...this.searchData,
        };
      }
      this.getList(params);
    },
    reset() {
      this.searchData.moduleName = "";
      this.searchData.moduleType = "";
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
  height: 78px;
  margin: 5px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
::v-deep .el-dialog__header {
  background-color: #0285bd;
  padding: 5px 10px;
  .el-dialog__title {
    color: #fff;
  }
  .el-dialog__headerbtn {
    top: 10px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
}
::v-deep .el-dialog--center .el-dialog__body {
  padding: 5px;
}
</style>
