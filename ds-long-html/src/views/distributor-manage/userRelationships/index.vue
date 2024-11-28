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
      :lazy="true"
      rowKey="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :tableEvents="tableEvents"
    >
    </tableSearch>
  </basic-container>
</template>

<script>
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import { relationList, relationListByParentId } from "@/api/admin/index";

import {
  resetSearchData,
  filterNullSearchData,
  optTaskStatus,
} from "@/util/util";
export default {
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      row: {},
      loading: false,
      tableEvents: {
        load: (tree, treeNode, resolve) => {
          const params = {
            current: 1,
            id: tree.id,
            size: 9999,
          };
          relationListByParentId(params).then((res) => {
            const data = res.data.data.records.map((v) => {
              v.hasChildren = true;
              return v;
            });
            resolve(data);
          });
        },
      },
      searchForm: [
        {
          type: "input",
          prop: "nickName",
          placeholder: "用户昵称",
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
          prop: "distrName",
          placeholder: "渠道商名称",
          clearable: true,
        },
      ],
      searchData: {
        nickName: "",
        mobile: "",
        distrName: "",
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
          prop: "nickname",
          label: "用户昵称",
          align: "left",
        },
        {
          prop: "distrName",
          label: "所属渠道商名称",
        },
        {
          prop: "mobile",
          label: "手机号",
        },
        {
          prop: "createTime",
          label: "注册时间",
        },
        {
          label: "账号状态",
          type: "filter",
          filter: (row) => {
            return optTaskStatus.find((v) => v.id === row.status)?.name;
          },
        },
        {
          label: "operate",
          type: "html",
          width: "120",
          html: () => {
            const details = `<span class='link comBtn' data-tagName="details">详情</span>`;
            return details;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "details") {
              this.$router.push({
                path: "/user/details/index",
                query: { id: row.id },
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
    };
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
      relationList(params)
        .then((res) => {
          this.loading = false;
          res.data?.data?.records.forEach(
            (v) => (v.hasChildren = true)
          );
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
