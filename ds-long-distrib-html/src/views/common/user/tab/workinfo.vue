<script setup lang="ts">
import { ref, onMounted } from "vue";
import { classifyList, getSubstanceDataInfo } from "@/api/system";
import { ENUM_DIC_TYPE } from "@/enums";
import { useRoute } from "vue-router";
import { useCommonStore } from "@/store/modules/common";

const useCommon = useCommonStore();
const dictionary: any = useCommon.dictionary;
const recommendLevel = dictionary[ENUM_DIC_TYPE.recommend_level];

const route = useRoute();

const loading = ref(false);
const tableData = ref([]);

const searchForm: any = [
  {
    label: "账号:",
    type: "input",
    prop: "videoTitle",
    placeholder: "请输入账号",
    clearable: true,
    labelWidth: "50",
  },
  {
    label: "推荐等级:",
    type: "select",
    prop: "pushLevel",
    placeholder: "请输入昵称",
    options: [],
    labelValue: {
      label: "dictionaryKey",
      value: "dictionaryValue",
    },
    clearable: true,
  },
  {
    type: "cascader",
    prop: "classifyId",
    placeholder: "分类",
    props: {
      label: "classifyName",
      value: "id",
      children: "childClassifyList",
    },
    options: [],
    clearable: true,
  },

  {
    label: "时间:",
    labelWidth: "50",
    type: "datetimerange",
    prop: "dateTime",
  },
];
const searchData = reactive({
  createUserId: route.query.id,
  videoTitle: "",
  pushLevel: "",
  classifyId: "",
  dateTime: [],
});
const search = () => {
  tablePage.current = 1;
  getList();
};
const reset = () => {
  searchData.videoTitle = "";
  searchData.pushLevel = "";
  searchData.classifyId = "";
  searchData.dateTime = [];
  getList();
};

const searchHandle = [
  { label: "查询", type: "primary", callback: search },
  { label: "重置", type: "primary", callback: reset },
];

const tableLabel = [
  {
    label: "视频信息",
    prop: "videoTitle",
    width: "100",
    align: "center",
    type: "videoPlay",
    callback: (col: any) => {
      col.visible = true;
    },
    closeCallback: (col: any) => {
      col.visible = false;
    },
  },
  {
    label: "视频标题",
    prop: "videoTitle",
    width: "150",
    align: "center",
  },

  {
    label: "发布时间",
    prop: "createTime",
    width: "150",
    align: "center",
  },
  {
    label: "推荐等级",
    prop: "pushLevel",
    width: "150",
    align: "center",
    type: "html",
    html: (col: any) => {
      const item = recommendLevel.find((v: any) => v.dictionaryValue === col.pushLevel);
      return item ? `<span>${item.dictionaryKey}</span>` : "";
    },
  },
  {
    label: "视频分类",
    prop: "classifyName",
    align: "center",
  },
  {
    prop: "failure",
    label: "状态",
    align: "center",
    type: "html",
    html: (row: any) => {
      return `<span class='must'>${row.failure == true ? "下架" : "正常"}</span>`;
    },
  },
  {
    label: "播放",
    prop: "playCount",
  },
  {
    label: "点赞",
    prop: "likeCount",
  },
  {
    label: "评论",
    prop: "commentCount",
  },
  {
    label: "收藏",
    prop: "collectCount",
  },
  {
    label: "分享",
    prop: "retweetCount",
  },
  {
    label: "下载",
    prop: "downloadCount",
  },
  {
    label: "举报",
    prop: "accusationCount",
  },
];
const tablePage = {
  total: 1,
  current: 1,
  size: 10,
  pagination: ({ currentPage, pageSize }: { currentPage: number; pageSize: number }) => {
    tablePage.current = currentPage;
    tablePage.size = pageSize;
    getList();
  },
};

const getList = () => {
  let startTime = "";
  let endTime = "";
  if (searchData.dateTime && searchData.dateTime.length) {
    startTime = searchData.dateTime[0];
    endTime = searchData.dateTime[1];
  }
  const params = {
    ...searchData,
    startTime,
    endTime,
    current: tablePage.current,
    size: tablePage.size,
  };
  loading.value = true;
  getSubstanceDataInfo(params)
    .then((res: any) => {
      const { data } = res;
      loading.value = false;
      tableData.value = data.data.records;
      tablePage.total = data.data.total;
    })
    .catch(() => {
      loading.value = false;
    });
};
const categoryList = () => {
  let info = {
    current: 1,
    size: 10000,
  };
  classifyList(info).then((res: any) => {
    const { data } = res;
    if (data.code == 200) {
      searchForm.forEach((v: any) => {
        if (v.type === "cascader") {
          v.options = data.data.webClassifyViewDTOS;
        }
      });
    }
  });
};
onMounted(() => {
  getList();
  categoryList();
});
</script>

<template>
  <base-card>
    <SearchList :searchData="searchData" :searchForm="searchForm" :searchHandle="searchHandle" />
    <TableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isIndex="true"
    >
    </TableSearch>
  </base-card>
</template>
