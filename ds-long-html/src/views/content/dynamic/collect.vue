<template>
  <div class="mt10">
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
      :isSelection="false"
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
      title="合集"
      :visible.sync="visible"
      width="60%"
      v-if="visible"
      :close-on-click-modal="false"
    >
      <createCollect :row="row" v-if="visible"></createCollect>
    </el-dialog>
    <el-dialog
      title="添加视频"
      :visible.sync="visibleAdd"
      width="65%"
      v-if="visibleAdd"
      :close-on-click-modal="false"
    >
      <addVideo :row="row" v-if="visibleAdd"></addVideo>
    </el-dialog>
    <el-dialog
      title="查看视频"
      :visible.sync="visibleCheck"
      width="65%"
      v-if="visibleCheck"
      :close-on-click-modal="false"
    >
      <checkVideo :row="row" v-if="visibleCheck"></checkVideo>
    </el-dialog>
    <el-dialog
      title="图片预览"
      :visible.sync="imgVisible"
      width="40%"
      append-to-body
      center
      v-if="imgVisible"
      :close-on-click-modal="false"
    >
      <img width="100%" :src="bigImage" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import {
  resetSearchData,
  optionComStatus,
  filterNullSearchData,
} from "@/util/util";
import createCollect from "@/views/content/dynamic/component/createCollect.vue";
import addVideo from "@/views/content/dynamic/component/addVideo.vue";
import checkVideo from "@/views/content/dynamic/component/checkVideo.vue";
import rankingEdit from "@/views/common/ranking/rankingEdit.vue";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { collectionPage, collectionsSaveOrUpdate } from "@/api/content/index";

export default {
  components: {
    tableSearch,
    search,
    rankingEdit,
    createCollect,
    addVideo,
    checkVideo,
  },
  data() {
    return {
      loading: false,
      row: {},
      imgVisible: false,
      bigImage: "",
      visible: false,
      visibleAdd: false,
      visibleCheck: false,
      tableEvents: {},
      searchForm: [
        {
          type: "input",
          prop: "name",
          placeholder: "合集名称",
          clearable: true,
        },
      ],
      searchData: {
        name: "",
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
          label: "新增集合",
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
          label: "排序",
          prop: "sort",
        },
        {
          label: "合集名称",
          prop: "name",
        },
        {
          label: "合集封面",
          prop: "coverFileUrl",
          width: "100",
          // type: "videoPlay",
          type: "html",
          html: (row) => {
            return `<span class='accessory'><img src=${
              row.coverFileUrl || ""
            }></span>`;
          },
          callback: (row, index, e) => {
            if (e.target.nodeName == "IMG") {
              this.imgVisible = true;
              this.bigImage = e.target.src;
            }
          },
        },
        {
          label: "视频数量",
          prop: "videoNum",
        },
        {
          label: "状态",
          prop: "status",
          type: "filter",
          filter: (row) =>
            optionComStatus.find((v) => v.id === row.status)?.name,
        },
        {
          label: "操作",
          type: "slot",
          slotName: "slotBtn",
          width: "260",
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
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      collectionPage(params)
        .then((res) => {
          const { data } = res;
          this.loading = false;
          this.tableData = data.data.records.map((v) => {
            v.visible = false;
            v.coverUrl = v?.coverFileUrl;
            v.btnList = this.getBtnList(v);
            return v;
          });
          this.tablePage.total = data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getBtnList(row) {
      const btnList = [];
      btnList.push({
        name: "查看",
        class: "comBtn link",
        callback: () => {
          this.row = {
            ...row,
            callback: (data) => {
              if (data) {
                this.getList();
              }
              this.visibleCheck = false;
            },
          };
          this.visibleCheck = true;
        },
      });
      btnList.push({
        name: "添加",
        class: "comBtn link",
        callback: () => {
          this.row = {
            ...row,
            callback: (data) => {
              if (data) {
                this.getList();
              }
              this.visibleAdd = false;
            },
          };
          this.visibleAdd = true;
        },
      });
      btnList.push({
        name: "编辑",
        class: "comBtn link",
        callback: () => {
          this.row = {
            ...row,
            callback: (data) => {
              if (data) {
                this.getList();
              }
              this.visible = false;
            },
          };
          this.visible = true;
        },
      });
      if (row.status === "ON") {
        btnList.push({
          name: "停用",
          class: "comBtn danger",
          callback: () => {
            this.$confirm("此操作将被停用, 是否继续?", this.$t("prompt"), {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }).then(() => {
              collectionsSaveOrUpdate({ status: "OFF", id: row.id }).then(
                () => {
                  this.$message.success("停用成功");
                  this.getList();
                }
              );
            });
          },
        });
      }
      if (row.status === "OFF") {
        btnList.push({
          name: "启用",
          class: "comBtn link",
          callback: () => {
            collectionsSaveOrUpdate({ status: "ON", id: row.id }).then(() => {
              this.$message.success("启用成功");
              this.getList();
            });
          },
        });
      }
      return btnList;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .accessory {
  display: inline-block;
  width: 78px;
  height: 78px;
  // margin: 5px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
