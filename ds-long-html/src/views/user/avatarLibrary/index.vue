<template>
  <div class="mt10">
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
        :tableEvents="tableEvents"
        :isSelection="true"
      >
      </tableSearch>
      <el-dialog
        :title="row.id ? '编辑头像' : '上传头像'"
        :visible.sync="addVisible"
        width="30%"
        v-if="addVisible"
        :close-on-click-modal="false"
      >
        <uploadAvatar :row="row"></uploadAvatar>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { pageHandle } from "@/util/pageHandle";
import { userAvatarPage, userAvatarDelete } from "@/api/admin/index";
import uploadAvatar from "./uploadAvatar.vue";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
export default {
  components: {
    tableSearch,
    search,
    uploadAvatar,
  },
  data() {
    return {
      selectionData: [],
      loading: false,
      row: {},
      addVisible: false,
      tableEvents: {
        selectionChange: (val) => {
          this.selectionData = val;
        },
      },
      searchForm: [],
      searchData: {},
      searchHandle: [
        {
          label: "上传",
          type: "primary",
          callback: () => {
            this.addVisible = true;
            this.row = {
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.addVisible = false;
              },
            };
          },
        },
        {
          label: "批量删除",
          type: "danger",
          disabled: () => this.selectionData.length == 0,
          callback: this.Alldeleted,
        },
      ],
      tableData: [],
      tableLabel: [
        {
          label: "头像",
          width: "100",
          type: "html",
          html: (row) => {
            return row.avatarFileUrl
              ? `<span class='accessory'><img style="width: 60px;height: 60px;"  src="${row.avatarFileUrl}"></span>`
              : "";
          },
        },
        {
          prop: "createTime",
          label: "上传时间",
        },
        {
          label: "操作",
          type: "html",
          width: "100",
          html: (col) => {
            let edit = `<span data-tagName="editBtn" class="comBtn link">编辑</span>`;
            let fixeBtn = `<span data-tagName="delBtn" class="comBtn danger">删除</span>`;
            return edit + fixeBtn;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;

            if (tagname === "editBtn") {
              this.addVisible = true;
              this.row = {
                ...row,
                callback: (data) => {
                  if (data) {
                    this.getList();
                  }
                  this.addVisible = false;
                },
              };
            } else if (tagname === "delBtn") {
              this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  userAvatarDelete([row.id]).then((res) => {
                    if (res.data.code == 200) {
                      const newCurrent = pageHandle(
                        this.tablePage.current,
                        this.tablePage.size,
                        this.tablePage.total
                      );
                      this.tablePage.current = newCurrent;
                      this.$message.success("删除成功");
                      this.getList();
                    }
                  });
                })
                .catch(() => {});
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
    Alldeleted() {
      if (this.selectionData.length == 0) {
        this.$message.warning("请选择要删除的数据");
        return;
      }
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const params = this.selectionData.map((item) => {
            return item.id;
          });
          userAvatarDelete(params).then((res) => {
            if (res.data.code == 200) {
              if (this.tableData.length && this.tablePage.current > 1) {
                this.tablePage.current--;
              }
              this.getList();
              this.$message.success("删除成功");
            }
          });
        })
        .catch(() => {});
    },

    getList() {
      const params = {
        type: "1",
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      userAvatarPage(params)
        .then((res) => {
          const { data } = res;
          if (data.code == 200) {
            this.loading = false;
            this.tableData = data.data.records;
            this.tablePage.total = data.data.total;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped></style>
