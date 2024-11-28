<template>
  <div class="mt10">
    <basic-container>
      <search
        :searchData="searchData"
        :searchForm="searchForm"
        :searchHandle="searchHandle"
      >
      </search>
      <div class="choice">
        <span class="el-icon-warning icon-span"></span>
        <p>
          已选择 {{ selectionData.length }} 个列表
          <el-button
            @click="Alldeleted"
            :disabled="selectionData.length === 0"
            class="deleteBtn"
            type="danger"
          >
            批量删除
          </el-button>
        </p>
      </div>
      <tableSearch
        :loading="loading"
        :tableData="tableData"
        :searchData="searchData"
        :tableLabel="tableLabel"
        :operation="operation"
        :tablePage="tablePage"
        :tableEvents="tableEvents"
        :isSelection="true"
      >
        <template #videoTitle="{ row }">
          <el-tooltip :content="row.videoTitle" placement="top">
            <div class="clamp3">
              {{ row.videoTitle }}
            </div>
          </el-tooltip>
        </template>
        <template #classifyName="{ row }">
          <div>
            <el-tooltip
              :content="compOpt(classifyOptions, row.classifyId).join(' ')"
              placement="top"
            >
              <div class="clamp3">
                <template
                  v-for="(tag, index) in compOpt(
                    classifyOptions,
                    row.classifyId
                  )"
                >
                  <el-tag :key="index" style="margin: 2px">{{ tag }}</el-tag>
                </template>
              </div>
            </el-tooltip>
          </div>
        </template>
        <template #topic="{ row }">
          <div>
            <el-tooltip
              :content="
                row.labelDtoList
                  ? row.labelDtoList.map((item) => item.labelName).join(' ')
                  : ''
              "
              placement="top"
            >
              <div class="clamp3">
                <template v-for="(item, index) in row.labelDtoList">
                  <el-tag :key="index" style="margin: 2px">{{
                    item.labelName
                  }}</el-tag>
                </template>
              </div>
            </el-tooltip>
          </div>
        </template>
      </tableSearch>
      <el-dialog
        title="新增"
        :visible.sync="addVisible"
        width="80%"
        center
        v-if="addVisible"
        :close-on-click-modal="false"
      >
        <seniority :row="row"></seniority>
      </el-dialog>
      <!-- 排行信息名称排行调整 -->
      <el-dialog
        :visible.sync="rankingEditVisible"
        width="400px"
        top="300px"
        :title="title"
        v-if="rankingEditVisible"
        center
        :close-on-click-modal="false"
      >
        <rankingEdit :competition="competition"></rankingEdit>
      </el-dialog>
    </basic-container>
  </div>
</template>
<script>
import { showTag, videoUnmountStatus, ENUM_VIDEO_STATUS } from "@/util/util";
import seniority from "@/views/content/sisters/component/seniority.vue";
import rankingEdit from "@/views/common/ranking/rankingEdit.vue";
import { pageHandle } from "@/util/pageHandle";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import {
  recordPage,
  deleteVideoFromRank,
  modifyVideoFromRank,
} from "@/api/content/sisters";
import { mapGetters } from "vuex";

export default {
  components: {
    tableSearch,
    search,
    rankingEdit,
    seniority,
  },
  data() {
    return {
      competition: {},
      title: "",
      selectionData: [],
      loading: false,
      row: {},
      visible: false,
      addVisible: false,
      rankingEditVisible: false,
      tableEvents: {
        selectionChange: (val) => {
          this.selectionData = val;
        },
      },
      searchForm: [
        {
          labelWidth: "75px",
          type: "input",
          prop: "videoTitle",
          placeholder: "请输入视频标题",
          clearable: true,
        },
        {
          type: "select",
          prop: "classifyId",
          options: [],
          labelValue: {
            label: "classifyName",
            value: "id",
          },
          placeholder: "请选择标签",
          clearable: true,
        },
      ],
      searchData: {
        videoTitle: "",
        classifyId: "",
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
        {
          label: "新增",
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
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "sort",
          label: "排行名次",
          width: "100",
          sortable: true,
        },
        {
          prop: "videoTitle",
          label: "视频信息",
          width: "100",
          type: "videoPlay",
          callback: (row) => {
            row.visible = true;
          },
          closeCallback: (row) => {
            row.visible = false;
          },
        },
        {
          label: "视频标题",
          type: "slot",
          slotName: "videoTitle",
        },
        {
          prop: "createUserName",
          label: "上传用户",
          width: "150",
        },
        {
          prop: "createTime",
          label: "上传时间",
        },
        {
          label: "话题",
          type: "slot",
          slotName: "topic",
          // width: "100",
        },
        {
          label: "视频标签",
          type: "slot",
          slotName: "classifyName",
          width: "220",
        },
        {
          label: "播放量",
          prop: "playCount",
        },
        {
          label: "点赞量",
          prop: "likeCount",
        },
        {
          label: "收藏量",
          prop: "collectCount",
        },
        {
          label: "视频状态",
          type: "html",
          html: (row) => {
            const item = videoUnmountStatus.find((v) => v.id === row.failure);
            const className =
              row.failure == ENUM_VIDEO_STATUS.delist ? "must" : "";
            return `<span class="${className}">${item?.name}</span>`;
          },
        },
      ],
      operation: {
        label: "操作",
        width: "250",
        btnList: [
          {
            label: "删除",
            type: "danger",
            callback: (row) => {
              this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  deleteVideoFromRank({
                    ids: [row.id],
                  }).then((res) => {
                    if (res.data.code == 200) {
                      const newCurrent = pageHandle(
                        this.tablePage.current,
                        this.tablePage.size,
                        this.tablePage.total
                      );
                      this.tablePage.current = newCurrent;
                      this.getList();
                      this.$message.success("删除成功");
                    }
                  });
                })
                .catch(() => {});
            },
          },
          {
            label: "调整",
            type: "primary",
            callback: (row) => {
              this.title = "排行调整";
              this.rankingEditVisible = true;
              this.competition = {
                ranking: true,
                title: "排行调整",
                callback: (data) => {
                  const { sort } = data || {};
                  if (sort) {
                    let info = {
                      id: row.rankRecordId,
                      sort: sort,
                    };
                    modifyVideoFromRank(info).then((res) => {
                      if (res.data.code == 200) {
                        this.getList();
                        this.$message.success("编辑成功");
                      }
                    });
                  }
                  this.rankingEditVisible = false;
                },
              };
            },
          },
          {
            label: "数据管理",
            type: "primary",
            callback: (row) => {
              this.$router.push({
                path: "/content/management/details",
                query: {
                  watchLevel: row.watchLevel,
                  createUserStatus: row.createUserStatus,
                  id: row.id,
                  preId: row.preId,
                  createUserId: row.createUserId,
                  createUserName: row.createUserName,
                  // row,
                  tab: "fourth",
                },
              });
            },
          },
        ],
      },
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
  computed: {
    ...mapGetters({
      classifyOptions: "classifyOptions",
    }),
    compOpt() {
      return (arr, str) => {
        const conditon = (str || "").split(",") || [];
        return showTag(arr, conditon);
      };
    },
  },
  mounted() {
    this.getList();
    this.categoryList();
  },

  methods: {
    Alldeleted() {
      if (this.selectionData.length == 0) {
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
          deleteVideoFromRank({
            ids: params,
          }).then((res) => {
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
    categoryList() {
      this.searchForm.forEach((v) => {
        if (v.prop === "classifyId") {
          v.options = this.classifyOptions;
        }
      });
    },

    getList() {
      const params = {
        ...this.searchData,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      recordPage(params)
        .then((res) => {
          const { data } = res;
          if (data.code == 200) {
            this.loading = false;
            this.tableData = data.data.records.map((v) => {
              v.visible = false;
              v.coverUrl = v?.coverFileUrl;
              return v;
            });
            this.tablePage.total = data.data.total;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    search() {
      this.tablePage.current = 1;
      this.getList();
    },
    reset() {
      this.searchData.videoTitle = "";
      this.searchData.classifyId = "";
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
.choice {
  width: 100%;
  height: 40px;
  border: 1px solid #b3d8ff;
  background-color: #ecf5ff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 10px;
  .icon-span {
    color: #409eff;
  }
  .deleteBtn {
    padding: 5px 5px;
  }
}
</style>
