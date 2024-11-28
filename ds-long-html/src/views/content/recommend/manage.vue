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
      <div style="text-align: right; margin-bottom: 10px">
        权重规则：0-9999 为推荐，10000-19999为精品，20000以上为极品
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
        :defaultSort="sortData"
      >
        <template #videoTitle="{ row }">
          <el-tooltip :content="row.videoTitle" placement="top">
            <div class="clamp3">
              {{ row.videoTitle }}
            </div>
          </el-tooltip>
        </template>
        <template #weight="{ row }">
          <el-input-number
            v-model="row.weight"
            :min="0"
            :max="999999"
            :precision="0"
            :controls="false"
            @change="onWeightChange(row)"
            style="width: 80%"
          />
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
        <!-- 1.31需求隐藏 -->
        <!-- <template #topic="{ row }">
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
        </template> -->
      </tableSearch>
      <el-dialog
        title="新增"
        :visible.sync="addVisible"
        width="80%"
        v-if="addVisible"
        :close-on-click-modal="false"
      >
        <redactdialog :row="row"></redactdialog>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { pageHandle } from "@/util/pageHandle";
import redactdialog from "./component/redactdialog.vue";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import {
  showTag,
  videoUnmountStatus,
  ENUM_VIDEO_STATUS,
  filterNullSearchData,
  optVideoStyle,
  resetSearchData,
  videoViolation,
  optPaidVideo,
} from "@/util/util";
import {
  recordPage,
  deleteVideoToRecommend,
  updateRecommendVideoWeight,
} from "@/api/content/recommend";
import { mapGetters } from "vuex";
import { SORT_TYPE_ENUM } from "@/util/types";

export default {
  components: {
    tableSearch,
    search,
    redactdialog,
  },
  data() {
    return {
      selectionData: [],
      loading: false,
      row: {},
      addVisible: false,
      sortData: { prop: "weight", order: SORT_TYPE_ENUM.DESCENDING },
      tableEvents: {
        selectionChange: (val) => {
          this.selectionData = val;
        },
        sortChange: ({ order, prop }) => {
          this.tablePage.current = 1;
          this.sortData.prop = prop;
          this.sortData.order = order;
          this.getList();
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
          placeholder: "请选择APP标签",
          clearable: true,
          multiple: true,
        },
        {
          type: "select",
          prop: "videoSiftType",
          placeholder: "视频样式",
          options: optVideoStyle,
          styleWidth: "120",
          clearable: true,
        },
        {
          type: "select",
          prop: "paidVideo",
          placeholder: "是否收费",
          options: optPaidVideo,
          styleWidth: "120",
          clearable: true,
        },
        {
          label: "权重分值",
          type: "input",
          prop: "weightScoreLowerLimit",
          placeholder: "起始分值0",
          clearable: true,
        },
        {
          type: "input",
          prop: "weightScoreUpperLimit",
          placeholder: "结束分值20000",
          clearable: true,
        },
      ],
      searchData: {
        videoTitle: "",
        classifyId: "",
        type: null,
        videoSiftType: "",
        weightScoreLowerLimit: "",
        weightScoreUpperLimit: "",
        paidVideo: "",
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
          label: "新增",
          type: "primary",
          callback: (row) => {
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
          },
        },
      ],
      tableData: [],
      tableLabel: [
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
          label: "权重",
          type: "slot",
          prop: "weight",
          slotName: "weight",
          sortable: "custom",
          width: "120",
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
        // {
        //   label: "话题",
        //   type: "slot",
        //   slotName: "topic",
        //   // width: "165",
        // },
        {
          label: "APP标签",
          type: "slot",
          slotName: "classifyName",
          width: "220",
        },
        {
          label: "权重分值",
          prop: "weightScore",
        },
        {
          prop: "videoCardVisibility",
          width: "85",
          label: "观影卡可看",
          type: "filter",
          filter: (row) => {
            const data = videoViolation.find(
              (v) => v.id === row.videoCardVisibility
            );
            return data?.name;
          },
        },
        {
          width: "85",
          label: "是否收费",
          type: "filter",
          filter: (row) => {
            const data = optPaidVideo.find((v) => v.id === row.paidVideo);
            return data?.name;
          },
        },
        {
          prop: "postTime",
          label: "上架时间",
          sortable: "custom",
          width: "160",
        },
        {
          label: "状态",
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
        width: "220",
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
                  deleteVideoToRecommend({
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
          deleteVideoToRecommend({
            ids: params,
            // substanceIds: [],
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
    async onWeightChange(row) {
      if (row.weight === undefined) {
        row.weight = 0;
      }
      try {
        this.loading = true;
        await updateRecommendVideoWeight({
          substanceId: row.id,
          weight: row.weight,
        });
        this.$message.success("操作成功");
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    getList() {
      const { prop, order } = this.sortData;
      const propMapping = {
        weight: "WEIGHT",
        postTime: "POST_TIME",
      };
      const params = {
        ...filterNullSearchData(this.searchData),
        orderBy: order === null ? undefined : propMapping[prop],
        asc:
          order === SORT_TYPE_ENUM.ASCENDING
            ? true
            : order === SORT_TYPE_ENUM.DESCENDING
            ? false
            : undefined,
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
