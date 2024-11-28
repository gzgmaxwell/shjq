<template>
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
      :tableEvents="tableEvents"
      :isSelection="false"
      :isIndex="true"
    >
    </tableSearch>
    <el-dialog
      title="详情"
      :visible.sync="visible"
      width="30%"
      v-if="visible"
      center
      :close-on-click-modal="false"
    >
      <fileDetails :row="row"></fileDetails>
    </el-dialog>
  </div>
</template>

<script>
import {
  resetSearchData,
  filterNullSearchData,
  Enum_blacklistSource,
} from "@/util/util";
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import { pageHandle } from "@/util/pageHandle";
import { chargeInfoPage, blacklistAdd } from "@/api/admin/index";
import fileDetails from "@/views/marketing/bloggerChargingManage/components/fileDetails.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    tableSearch,
    search,
    fileDetails,
  },
  data() {
    return {
      visible: false,
      pictureUrl: "",
      row: {},
      loading: false,
      selectionData: [],
      that: this,
      searchForm: [
        {
          type: "input",
          prop: "userName",
          placeholder: "姓名",
          clearable: true,
        },
        {
          type: "input",
          prop: "mobile",
          placeholder: "手机号",
          clearable: true,
        },
        {
          type: "input",
          prop: "userId",
          placeholder: "用户ID",
          clearable: true,
        },
      ],
      searchData: {
        userName: "",
        mobile: "",
        userId: "",
      },
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
            this.tablePage.total = 0;
            this.tablePage.current = 1;
            this.tablePage.size = 10;
            this.getList();
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "nickName",
          label: "用户昵称",
        },
        {
          prop: "userId",
          label: "用户ID",
        },
        {
          prop: "userName",
          label: "姓名",
        },
        {
          prop: "mobile",
          label: "手机号",
        },
        {
          label: "分成占比",
          type: "html",
          html: (row) => {
            return `<span>${row.commissionRatio || 0}</span>%`;
          },
        },
        {
          label: "operate",
          type: "html",
          width: "150",
          html: (row) => {
            const Details = `<span class='link comBtn' data-tagName="Details">详细</span>`;
            const move = `<span class='danger comBtn' data-tagName="move">移入黑名单</span>`;
            let btn = "";
            if (this.permissions.sys_charging_manage_record_detail) {
              btn += Details;
            }
            if (this.permissions.sys_charging_manage_apply_block) {
              btn += move;
            }
            return btn;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "Details") {
              this.visible = true;
              this.row = {
                id: row.id,
                callback: (data) => {
                  if (data) {
                    this.getList();
                  }
                  this.visible = false;
                },
              };
            } else if (tagname === "move") {
              this.$confirm(
                "这是进行一项操作时必须了解的重要信息,<br>博主将被移入黑名单，继续吗?",
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                  dangerouslyUseHTMLString: true,
                }
              )
                .then(() => {
                  const params = {
                    sourceId: row.id,
                    sourceType: Enum_blacklistSource.ARCHIVES,
                  };
                  blacklistAdd(params).then((res) => {
                    const { data } = res;
                    if (data.code == 200) {
                      const newCurrent = pageHandle(
                        this.tablePage.current,
                        this.tablePage.size,
                        this.tablePage.total
                      );
                      this.tablePage.current = newCurrent;
                      this.getList();
                      return this.$message.success("移入黑名单成功");
                    }
                  });
                })
                .catch(() => {});
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
    ...mapGetters(["permissions"]),
  },
  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      const params = {
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      chargeInfoPage(params)
        .then((res) => {
          const { data } = res;
          this.loading = false;
          this.tableData = data.data.records;
          this.tablePage.total = data.data.total;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss"></style>
