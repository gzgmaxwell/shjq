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
  </div>
</template>

<script>
import {
  resetSearchData,
  filterNullSearchData,
  userGender,
  optionblacklistSource,
} from "@/util/util";
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import { pageHandle } from "@/util/pageHandle";
import { blacklistPage, blacklistRemove } from "@/api/admin/index";
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
          prop: "gender",
          label: "性别",
          type: "filter",
          filter: (row) => {
            const item = userGender.find((v) => v.id === row.gender);
            return item?.name;
          },
        },
        {
          prop: "sourceType",
          label: "来源",
          type: "filter",
          filter: (row) => {
            const item = optionblacklistSource.find(
              (v) => v.id === row.sourceType
            );
            return item?.name;
          },
        },
        {
          prop: "createTime",
          label: "移入时间",
        },

        {
          label: "operate",
          type: "html",
          width: "120",
          html: () => {
            const del = `<span class='link comBtn' data-tagName="del">移除</span>`;
            let btn = "";
            if (this.permissions.sys_charging_manage_black_list_remove) {
              btn += del;
            }
            return btn;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "del") {
              this.$confirm(
                "这是进行一项操作时必须了解的重要信息,<br>博主将被移除黑名单，继续吗?",
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                  dangerouslyUseHTMLString: true,
                }
              )
                .then(() => {
                  blacklistRemove({ id: row.id }).then(() => {
                    const newCurrent = pageHandle(
                      this.tablePage.current,
                      this.tablePage.size,
                      this.tablePage.total
                    );
                    this.tablePage.current = newCurrent;
                    this.$message.success("移除成功");
                    this.getList();
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
      blacklistPage(params)
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
