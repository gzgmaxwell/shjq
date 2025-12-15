<template>
  <div>
    <div class="mb10">
      <el-button type="primary" @click="getWork(false)" v-if="!onlineStatus"
        >开始工作</el-button
      >
      <el-button type="primary" @click="getWork(false)" v-if="onlineStatus"
        >停止分配</el-button
      >
      <el-button type="primary" @click="getList()" v-if="onlineStatus"
        >刷新页面</el-button
      >
      <el-button
        @click="this.maskBack"
        type="primary"
        v-if="selectionData.length"
      >
        任务回退
      </el-button>
    </div>
    <search
      v-if="onlineStatus"
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search>
    <tableSearch
      v-if="onlineStatus"
      :loading="loading"
      :tableData="tableData"
      :tableEvents="tableEvents"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isSelection="true"
    >
      <template #intro="{ row }">
        <el-tooltip :content="row.intro" placement="top">
          <div class="clamp3">
            {{ row.intro }}
          </div>
        </el-tooltip>
      </template>
      <template #classifyName="{ row }">
        <div>
          <el-tooltip
            :content="compOpt(classifyOptions, row.classifyIds).join(' ')"
            placement="top"
          >
            <div class="clamp3">
              <template
                v-for="(tag, index) in compOpt(
                  classifyOptions,
                  row.classifyIds
                )"
              >
                <el-tag :key="index" style="margin: 2px">{{ tag }}</el-tag>
              </template>
            </div>
          </el-tooltip>
        </div>
      </template>
    </tableSearch>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import {
  userWork,
  rollBack,
  orderAudit,
  inkloreGather_update,
  pendingPre,
  chapterGather_page,
  chapterGather_preview,
} from "@/api/graphicManagement/index";

import {
  optionsTimeType,
  debounceCallBack,
  showTag,
  resetSearchData,
  ENUM_AuditOpra,
  filterNullSearchData,
  optCartoonStatus,
  optCartoonSpace,
  EnumCartoonType,
  optCartoonType,
} from "@/util/util";

export default {
  name: "comicDistributed", //图文违规审核已分配
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      optionsTimeType: optionsTimeType,
      row: {},
      selectionData: [],
      loading: false,
      onlineStatus: false,
      searchForm: [
        {
          type: "input",
          prop: "inkLoreName",
          placeholder: "作品名称",
          clearable: true,
        },
        {
          type: "select",
          prop: "inkLoreStatus",
          options: optCartoonStatus,
          placeholder: "状态",
          clearable: true,
        },
        {
          styleWidth: "150",
          type: "select",
          prop: "classifyIds",
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
          prop: "inkLoreType",
          options: optCartoonType,
          placeholder: "作品类型",
        },
      ],
      searchData: {
        inkLoreName: "",
        inkLoreStatus: "",
        classifyIds: [],
        inkLoreType: EnumCartoonType.comic,
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
            this.searchData.inkLoreType = EnumCartoonType.comic;
            this.tablePage.total = 0;
            this.tablePage.current = 1;
            this.tablePage.size = 10;
            this.getList();
          },
        },
      ],
      tableData: [],
      tableEvents: {
        selectionChange: (val) => {
          this.selectionData = val;
        },
      },
      tableLabel: [
        {
          label: "作品名称",
          prop: "inkLoreName",
        },
        {
          label: "作者",
          prop: "authorNickName",
        },
        {
          width: "100",
          label: "三方作者名称",
          prop: "thirdAuthorName",
        },
        {
          label: "简介",
          type: "slot",
          slotName: "intro",
        },
        {
          label: "封面",
          type: "imgShow",
          imgUrlkey: "coverImageUrl",
          width: 100,
          callback: (row) => {
            this.$modalImage({
              imageURL: row.coverImageUrl,
            });
          },
        },
        {
          label: "上传时间",
          prop: "uploadTime",
        },
        {
          label: "APP标签",
          type: "slot",
          slotName: "classifyName",
          width: "220",
        },
        {
          label: "章节数",
          prop: "chapterNum",
        },
        {
          label: "正文",
          type: "html",
          html: () => {
            return `<span class='link'>预览</span>`;
          },
          callback: (row) => {
            this.$modalPreview({
              id: row.inkLoreCode,
              type: row.inkLoreType,
              API_chapterPage: chapterGather_page,
              API_chapterPre: chapterGather_preview,
            });
          },
        },
        {
          label: "连载状态",
          type: "filter",
          filter: (row) =>
            optCartoonStatus.find((v) => v.id === row.inkLoreStatus)?.name,
        },
        {
          label: "篇幅",
          type: "filter",
          filter: (row) =>
            optCartoonSpace.find((v) => v.id === row.space)?.name,
        },
        {
          label: "编辑员",
          prop: "editorUserName",
        },
        {
          label: "审核员",
          prop: "rejectUserName",
        },
        {
          label: "渠道来源",
          prop: "channel",
        },
        {
          label: "作品类型",
          type: "filter",
          filter: (row) =>
            optCartoonType.find((v) => v.id === row.inkLoreType)?.name,
        },
        {
          label: "操作",
          type: "html",
          width: "120",
          fixed: "right",
          html: (row) => {
            const pass = `<span data-tagName="pass" class="comBtn link">通过</span>`;
            const reject = `<span data-tagName="reject" class="comBtn danger">驳回</span>`;
            const edit = `<span data-tagName="edit" class="comBtn link">编辑</span>`;
            let str = "";
            str += pass + reject + edit;
            return str;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;

            if (tagname === "pass") {
              const params = {
                id: row.id,
                type: ENUM_AuditOpra.pass,
                workContent: "INK_LORE_CONTENT_EXAMINE",
              };
              const debounceAPI = () => {
                return orderAudit(params).then((res) => {
                  this.$message.success("操作成功");
                  this.onlineStatus = res.data.data.onlineStatus;
                  this.getList();
                });
              };
              debounceCallBack(debounceAPI)();
            } else if (tagname === "reject") {
              this.$modalReject({
                callback: (data) => {
                  const { refuseCode, refuseReason, refuseDesc, refuseType } =
                    data;
                  const params = {
                    id: row.id,
                    type: ENUM_AuditOpra.reject,
                    workContent: "INK_LORE_CONTENT_EXAMINE",
                    refuseCode,
                    refuseReason,
                    refuseDesc,
                    refuseType,
                  };
                  const debounceAPI = () => {
                    return orderAudit(params).then((res) => {
                      this.$notify.success("驳回成功");
                      this.onlineStatus = res.data.data.onlineStatus;
                      this.getList();
                    });
                  };
                  debounceCallBack(debounceAPI)();
                },
                doubleSelect: true,
              });
            } else if (tagname === "edit") {
              this.$modalGraphic({
                row: {
                  ...row,
                  name: row.inkLoreName,
                  status: row.inkLoreStatus,
                  callback: ({ form, handleClose, btnType }) => {
                    let params = {};
                    if (btnType == "save") {
                      params = {
                        ...form,
                        id: row.inkLoreGatherId,
                        commit: false,
                      };
                    }
                    const debounceAPI = () => {
                      return inkloreGather_update(params).then(() => {
                        this.$message.success("编辑成功");
                        handleClose();
                        this.getList();
                      });
                    };
                    debounceCallBack(debounceAPI)();
                  },
                },
                type: row.inkLoreType,
                author: true, // 三方作者字段
                submit: false, // 提交按钮
              });
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
  computed: {
    ...mapGetters({
      classifyOptions: "classifyOptions",
    }),
    compOpt() {
      return (arr, str) => {
        return showTag(arr, str || []);
      };
    },
  },
  mounted() {
    this.getWork(true);
    this.getClassify();
  },

  methods: {
    getClassify() {
      this.searchForm.forEach((v) => {
        if (v.prop === "classifyIds") {
          v.options = this.classifyOptions;
        }
      });
    },
    getWork(onlyGet) {
      userWork({
        onlyGet: onlyGet,
        workContent: "INK_LORE_CONTENT_EXAMINE",
      }).then((res) => {
        this.onlineStatus = res.data.data;
        if (!res.data.data) this.tableData = [];
        if (res.data.data) this.getList();
      });
    },
    getList() {
      const params = {
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
        busPlatformId: localStorage.getItem("BusPlatformId"),
      };
      this.loading = true;
      pendingPre(params)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.data.records;
          this.tablePage.total = res.data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    maskBack() {
      const ids = this.selectionData.map((item) => item.id);
      const params = {
        workOrderIds: ids,
        workContent: "INK_LORE_CONTENT_EXAMINE",
      };
      rollBack(params).then(() => {
        this.getList();
      });
    },
  },
};
</script>
