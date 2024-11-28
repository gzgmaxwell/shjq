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
            @click="AllAddVideo"
            :disabled="selectionData.length === 0"
            class="deleteBtn"
            type="primary"
          >
            批量添加
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
      </tableSearch>
    </basic-container>
  </div>
</template>
<script>
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { recordVideoPage, saveVideoToRecommend } from "@/api/content/recommend";
import {
  debounceCallBack,
  showTag,
  optPaidVideo,
  filterNullSearchData,
  resetSearchData,
} from "@/util/util";
import { mapGetters } from "vuex";
export default {
  props: {
    row: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      selectionData: [],
      loading: false,
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
        {
          type: "select",
          prop: "paidVideo",
          placeholder: "是否收费",
          options: optPaidVideo,
          styleWidth: "120",
          clearable: true,
        },
      ],
      searchData: {
        videoTitle: "",
        classifyId: "",
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
          prop: "createUserName",
          label: "上传用户",
          width: "150",
        },
        {
          prop: "createTime",
          label: "上传时间",
        },
        {
          prop: "postTime",
          label: "上架时间",
        },
        {
          label: "APP标签",
          type: "slot",
          slotName: "classifyName",
          width: "220",
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
      ],
      operation: {
        label: "操作",
        width: "220",

        btnList: [
          {
            label: "添加",
            type: "primary",
            callback: (row) => {
              let info = {
                substanceIds: [row.id],
              };
              const comSubmit = () => {
                return saveVideoToRecommend(info).then((res) => {
                  this.row.callback(true);
                  this.$message.success("新增成功");
                  this.getList();
                  Promise.resolve();
                });
              };
              debounceCallBack(comSubmit)();
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

  mounted() {
    this.getList();
    this.categoryList();
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
  methods: {
    AllAddVideo() {
      if (this.selectionData.length == 0) {
        return;
      }
      const params = this.selectionData.map((item) => {
        return item.id;
      });
      let info = {
        substanceIds: params,
      };
      const comSubmit = () => {
        return saveVideoToRecommend(info).then((res) => {
          if (this.tableData.length && this.tablePage.current > 1) {
            this.tablePage.current--;
          }
          this.$message.success("新增成功");
          this.getList();
          this.row.callback(true);
          Promise.resolve();
        });
      };
      debounceCallBack(comSubmit)();
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
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      recordVideoPage(params)
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
