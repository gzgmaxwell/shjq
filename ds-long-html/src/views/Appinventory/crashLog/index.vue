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
      :isIndex="false"
    >
      <template #content="{ row, index }">
        <span
          @click="item.callback({ row, index })"
          v-for="(item, i) in row.btnList"
          :class="item.class"
          :key="i"
        >
          {{ item.name }}
        </span>
      </template>
    </tableSearch>
  </basic-container>
</template>

<script>
import { collapseFileList } from "@/api/admin/index";
import languageEdit from "@/views/Appinventory/language/languageEdit.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import search from "@/components/tableSearch/search.vue";
export default {
  components: {
    tableSearch,
    search,
    languageEdit,
  },
  data() {
    return {
      loading: false,
      that: this,
      searchForm: [],
      searchData: {},
      searchHandle: [],
      tableData: [],
      tableLabel: [
        {
          prop: "userId",
          label: "用户ID",
        },
        {
          prop: "models",
          label: "机型",
        },
        {
          prop: "deviceNumber",
          label: "设备号",
        },
        {
          prop: "version",
          label: "版本号",
        },
        {
          prop: "createTime",
          label: "上传时间",
          sortable: true,
        },
        {
          label: "操作",
          type: "slot",
          slotName: "content",
          width: "150px",
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
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      collapseFileList(params)
        .then((res) => {
          const { data } = res;
          if (data.code == 200) {
            this.loading = false;
            this.tableData = data.data.records.map((v) => {
              v.btnList = this.getBtnList();
              return v;
            });
            this.tablePage.total = data.data.total;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getBtnList() {
      const btnList = [
        {
          name: "下载崩溃文件",
          class: "comBtn link",
          callback: ({ row }) => {
            fetch(row.collapseFileUrl)
              .then((response) => {
                return response.blob();
              })
              .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = row.collapseFileName;
                link.style.display = "none";
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
              })
              .catch((error) => {
                console.error("下载失败:", error);
              });
          },
        },
      ];
      return btnList;
    },
  },
};
</script>
