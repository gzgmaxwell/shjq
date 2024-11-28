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
      :isIndex="true"
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
                v-for="(tag, index) in compOpt(classifyOptions, row.classifyId)"
              >
                <el-tag :key="index" style="margin: 2px">{{ tag }}</el-tag>
              </template>
            </div>
          </el-tooltip>
        </div>
      </template>
    </tableSearch>
    <span
      slot="footer"
      style="display: block; text-align: right; margin-top: 20px"
    >
      <el-button @click="row.callback && row.callback()">取 消</el-button>
      <el-button type="primary" @click="submit" :disabled="isDisabled"
        >添加</el-button
      >
    </span>
  </div>
</template>
<script>
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import chapter from "@/components/chapter/index.vue";
import {
  showTag,
  createParams,
  debounce,
  filterNullSearchData,
  resetSearchData,
} from "@/util/util";
import { getOnlineList, saveReferralPools } from "@/api/admin/index";
import { dsUserList } from "@/api/userList";
import { mapGetters } from "vuex";

export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    tableSearch,
    search,
    chapter,
  },
  data() {
    return {
      selectionData: [],
      loading: false,
      that: this,
      tableEvents: {
        selectionChange: (val) => {
          this.selectionData = val;
        },
      },
      searchForm: [
        {
          type: "input",
          prop: "videoTitle",
          placeholder: "请输入标题",
          clearable: true,
          styleWidth: "150",
        },
        {
          type: "input",
          prop: "createUserName",
          placeholder: "请输入作者",
          clearable: true,
          styleWidth: "150",
        },

        {
          styleWidth: "170",
          type: "select",
          prop: "classifyId",
          options: [],
          labelValue: {
            label: "classifyName",
            value: "id",
          },
          placeholder: "请选择标签",
          clearable: true,
          multiple: true,
        },
      ],
      searchData: {
        videoTitle: "",
        createUserName: "",
        classifyId: [],
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "videoTitle",
          label: "视频信息",
          type: "videoPlay",
          width: "100",
          callback: (row) => {
            row.visible = true;
          },
          closeCallback: (row) => {
            row.visible = false;
          },
        },
        {
          prop: "createUserName",
          label: "作者",
        },
        {
          label: "视频标题",
          type: "slot",
          slotName: "videoTitle",
        },
        {
          prop: "userOverallScoring",
          label: "用户评分",
        },
        {
          label: "APP标签",
          type: "slot",
          slotName: "classifyName",
          width: "220",
        },
        {
          prop: "createTime",
          label: "上传时间",
        },
        {
          prop: "postTime",
          label: "上架时间",
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
      classifyOptions: "classifyOptions",
    }),
    isDisabled() {
      return (
        this.selectionData.length > 6 - this.row.count ||
        this.selectionData.length === 0
      );
    },
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
      getOnlineList(params).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.loading = false;
          this.tableData =
            data.data?.records?.map((v) => {
              v.visible = false;
              v.coverUrl = v?.coverFileUrl;
              v.topicVoList = v?.labelDtoList;
              v.partList = [];
              return v;
            }) || [];
          this.tablePage.total = data.data.total;
        }
      });
    },
    submit() {
      debounce(this.commit, 400)();
    },
    commit() {
      const data = this.selectionData.map((item) => item.onlineId);
      const params = {
        createUserId: this.$store.getters.userInfo.id,
        level: this.row.level,
        onlineIds: data,
      };
      saveReferralPools(params).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("添加成功");
          this.getList();
          this.row.callback(true);
        }
      });
    },
    search() {
      this.tablePage.current = 1;
      this.getList();
    },
    reset() {
      resetSearchData(this.searchData);
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
