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
      :isIndex="true"
    >
      <div class="mb10">
        <el-button
          type="primary"
          @click="videoUpload"
          v-if="permissions.vm_svl_upload"
          >上传视频</el-button
        >
        <el-button
          type="primary"
          @click="videoUploadList"
          v-if="permissions.vm_svl_upload_list"
          >批量上传视频</el-button
        >
      </div>
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
                v-for="(tag, index) in compOpt(classifyOptions, row.classifyId)"
              >
                <el-tag :key="index" style="margin: 2px">{{ tag }}</el-tag>
              </template>
            </div>
          </el-tooltip>
        </div>
      </template>
      <template #classifyIdWeb="{ row }">
        <div>
          <el-tooltip
            :content="compOpt(adminTag, row.classifyIdWeb).join(' ')"
            placement="top"
          >
            <div class="clamp3">
              <template
                v-for="(tag, index) in compOpt(adminTag, row.classifyIdWeb)"
              >
                <el-tag :key="index" style="margin: 2px">{{ tag }}</el-tag>
              </template>
            </div>
          </el-tooltip>
        </div>
      </template>
    </tableSearch>
    <el-dialog
      title="编辑"
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
    >
      <commVideoEdit v-if="visible" :row="row" :webPageMenu="webPageMenu" />
    </el-dialog>
    <el-dialog
      title="查看"
      :visible.sync="checkVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <commVideoCheck
        v-if="checkVisible"
        :row="row"
        :webPageMenu="webPageMenu"
      />
    </el-dialog>
    <el-dialog
      title="视频上传"
      :visible.sync="uploadVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <upload v-if="uploadVisible" :row="rowUpload"></upload>
    </el-dialog>
    <el-dialog
      title="视频批量上传"
      :visible.sync="uploadListVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <uploadList v-if="uploadListVisible" :row="rowUploadList"></uploadList>
    </el-dialog>
  </basic-container>
</template>

<script>
import { classifyDefault } from "@/api/admin/index";
import { mapGetters } from "vuex";
import pagination from "@/components/bas-pagination/index";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import commVideoEdit from "@/views/common/commVideo/commVideoEdit.vue";
import commVideoCheck from "@/views/common/commVideo/commVideoCheck.vue";
import upload from "./upload.vue";
import uploadList from "./uploadList.vue";
import { supplierVideoPage, substancePreDel } from "@/api/video-manage/index";
import {
  showTag,
  videoLength,
  formatDurationToTime,
  checkOption,
  enum_status,
  ENUM_DIC_TYPE,
  optionsTimeType,
  optionsResolution,
  resetSearchData,
  optVideoStyle,
} from "@/util/util";
import { pageHandle } from "@/util/pageHandle";

export default {
  components: {
    pagination,
    tableSearch,
    search,
    commVideoEdit,
    commVideoCheck,
    upload,
    uploadList,
  },
  props: {
    webPageMenu: {
      type: String,
      default: "BK_VIDEO_LIST",
    },
  },
  data() {
    return {
      channelData: [],
      optClass: [],
      uploadVisible: false,
      uploadListVisible: false,
      visible: false,
      checkVisible: false,
      row: {},
      loading: false,
      searchForm: [
        {
          type: "input",
          prop: "videoTitle",
          placeholder: "请输入视频标题",
          clearable: true,
        },
        {
          type: "input",
          prop: "createUserName",
          placeholder: "请输入作者",
          clearable: true,
          styleWidth: "150",
        },
        // {
        //   styleWidth: "150",
        //   type: "cascader",
        //   prop: "classifyId",
        //   options: [],
        //   props: {
        //     value: "id",
        //     label: "classifyName",
        //     children: "childClassifyList",
        //   },
        //   placeholder: "请选择视频标签",
        //   clearable: true,
        // },
        {
          styleWidth: "150",
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
          styleWidth: "150",
          type: "select",
          prop: "classifyIdWeb",
          options: [],
          labelValue: {
            label: "classifyName",
            value: "id",
          },
          placeholder: "请选择后台标签",
          clearable: true,
          multiple: true,
        },
        {
          styleWidth: "130",
          type: "select",
          prop: "type",
          options: [],
          placeholder: "请选择状态",
          clearable: true,
        },
        {
          styleWidth: "180",
          type: "select",
          prop: "tiemData",
          options: optionsTimeType,
          placeholder: "请选择视频时长(分钟)",
          clearable: true,
          multiple: true,
        },
        {
          type: "select",
          prop: "videoResolutionList",
          placeholder: "分辨率",
          options: optionsResolution,
          styleWidth: "130",
          clearable: true,
          multiple: true,
        },
        {
          type: "datetimerange",
          prop: "dateTime",
        },
        {
          type: "select",
          prop: "videoSiftType",
          placeholder: "视频样式",
          options: optVideoStyle,
          styleWidth: "120",
          clearable: true,
        },
      ],
      searchData: {
        videoTitle: "",
        createUserName: "",
        pushLevel: "",
        classifyId: "",
        type: "",
        dateTime: [],
        tiemData: [],
        videoResolutionList: [],
        sourceOpt: [],
        videoSiftType: "",
      },
      searchHandle: [
        {
          label: "查询",
          type: "primary",
          callback: () => {
            this.tablePage.current = 1;
            this.getList();
          },
          auth: () => this.permissions.vm_svl_search,
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
          auth: () => this.permissions.vm_svl_reset,
        },
      ],
      tableData: [],
      tableLabel: [
        {
          label: "视频信息",
          type: "videoPlay",
          width: 100,
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
          label: "作者",
          type: "html",
          html: (row) => {
            return `<span class='clamp1'>${row.createUserName || ""}</span>`;
          },
        },
        {
          prop: "createTime",
          label: "上传时间",
        },
        {
          label: "APP标签",
          type: "slot",
          slotName: "classifyName",
          width: "220",
        },
        {
          label: "后台标签",
          type: "slot",
          slotName: "classifyIdWeb",
          width: "220",
        },
        {
          prop: "videoLength",
          label: "视频时长",
          type: "filter",
          filter: (row) => {
            const result = row.videoLength / 1000;
            const direct = formatDurationToTime(result);
            return direct;
          },
        },
        {
          prop: "resolution",
          label: "分辨率",
        },
        {
          prop: "type",
          label: "状态",
          type: "html",
          html: (row) => {
            const item = checkOption.find((v) => v.id === row.type);
            // const arr = [enum_status.first_failure, enum_status.second_failure];
            const arr = [enum_status.second_failure];
            const isTrue = arr.includes(item?.id);
            if (item) {
              if (isTrue) {
                return `<span>${item.name}</span> <div class='must'>${
                  row.refuseReason ? row.refuseReason : ""
                }</div>`;
              }
              return `<span>${item.name}</span>`;
            }
            return;
          },
        },
        {
          label: "操作",
          type: "html",
          width: "160",
          html: (row) => {
            const check = `<span class='link comBtn' data-tagName="check">查看</span>`;
            const isDelArr = [enum_status.draft, enum_status.second_failure];
            let str = "";
            if (isDelArr.includes(row.type)) {
              if (this.permissions.vm_svl_check) str += check;
              return str;
            }
            if (this.permissions.vm_svl_check) return `${check}`;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname == "edit") {
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
            } else if (tagname == "check") {
              this.row = {
                ...row,
                callback: () => {
                  this.checkVisible = false;
                },
              };
              this.checkVisible = true;
            } else if (tagname == "del") {
              this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  substancePreDel(row.preId).then((res) => {
                    const { data } = res;
                    if (data.code == 200) {
                      const newCurrent = pageHandle(
                        this.tablePage.current,
                        this.tablePage.size,
                        this.tablePage.total
                      );
                      this.tablePage.current = newCurrent;
                      this.getList();
                      return this.$message.success("删除成功");
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
    };
  },
  computed: {
    ...mapGetters({
      dictionary: "dictionary",
      classifyOptions: "classifyOptions",
      permissions: "permissions",
      adminTag: "adminTag",
    }),
    selectedTimeLength() {
      return videoLength(this.searchData.tiemData, optionsTimeType);
    },
    compOpt() {
      return (arr, str) => {
        const conditon = (str || "").split(",") || [];
        return showTag(arr, conditon);
      };
    },
  },

  mounted() {
    this.getClassifyDefault();
    this.filterSearch();
    this.watchvideo();
    this.getClassify();
    this.getList();
  },

  methods: {
    getClassifyDefault() {
      classifyDefault().then((res) => {
        this.optClass = res.data?.data || [];
      });
    },
    filterSearch() {
      this.searchForm.forEach((v) => {
        if (v.prop === "type") {
          const isIncludes = [
            enum_status.draft,
            enum_status.pending_first_review,
            enum_status.first_review,
            enum_status.pending_second_review,
            enum_status.first_failure,
            enum_status.first_review,
            enum_status.second_failure,
            enum_status.reject_by_info,
            enum_status.reject_by_watermark,
            enum_status.wait_submit,
          ];
          v.options = checkOption.filter((v) => isIncludes.includes(v.id));
        }
      });
    },
    getList() {
      const params = {
        ...this.searchData,
        videoLengthDTOList: this.selectedTimeLength,
        webPageMenu: this.webPageMenu,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      if (this.searchData.dateTime && this.searchData.dateTime.length) {
        params.startTime = this.searchData.dateTime[0];
        params.endTime = this.searchData.dateTime[1];
      }
      if (this.searchData.sourceOpt && this.searchData.sourceOpt.length) {
        params.channelName = this.searchData.sourceOpt[0];
        params.channelSource = this.searchData.sourceOpt[1];
      }
      this.loading = true;
      supplierVideoPage(params).then((res) => {
        const { data } = res;
        this.loading = false;
        data.data.records.forEach((v) => (v.visible = false));
        this.tableData = data.data.records;
        this.tablePage.total = data.data.total;
      });
    },
    watchvideo() {
      this.searchForm.forEach((v) => {
        if (v.prop === "pushLevel") {
          v.options = this.dictionary[ENUM_DIC_TYPE.recommend_level];
        }
      });
    },
    getClassify() {
      this.searchForm.forEach((v) => {
        if (v.prop === "classifyId") {
          v.options = this.classifyOptions;
        }
        if (v.prop === "classifyIdWeb") {
          v.options = this.adminTag;
        }
      });
      this.getList();
    },
    videoUpload() {
      this.uploadVisible = true;
      this.rowUpload = {
        callback: (data) => {
          if (data) {
            this.getList();
          }
          this.uploadVisible = false;
        },
      };
    },
    videoUploadList() {
      this.uploadListVisible = true;
      this.rowUploadList = {
        callback: (data) => {
          if (data) {
            this.getList();
          }
          this.uploadListVisible = false;
        },
      };
    },
  },
};
</script>
