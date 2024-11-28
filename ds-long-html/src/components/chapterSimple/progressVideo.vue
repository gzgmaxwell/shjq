<template>
  <el-form ref="ruleForm" label-width="150px" class="demo-ruleForm">
    <!-- <div class="imgBox">
      <div
        class="imgItem"
        v-for="(item, index) in waterMarkImgList"
        :key="index"
      >
        <img
          :class="item.id === waterMarkItem.id ? 'activeImg' : ''"
          @click="
            () => {
              if (waterMarkItem.id === item.id) {
                waterMarkItem = {};
              } else {
                waterMarkItem = item;
              }
            }
          "
          :src="item.avatarFileUrl"
          class="imgLoad"
        />
      </div>
    </div> -->
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
      :isSelection="false"
    >
    </tableSearch>
    <!-- <el-form-item>
      <el-button
        type="primary"
        @click="row.callback && row.callback(waterMarkItem)"
        >{{ $t("determine") }}</el-button
      >
      <el-button @click="row.callback && row.callback()">{{
        $t("cancel")
      }}</el-button>
    </el-form-item> -->
  </el-form>
</template>
<script>
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { userAvatarPage } from "@/api/admin/index";
import { filterNullSearchData, resetSearchData } from "@/util/util";

export default {
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      waterMarkImgList: [],
      waterMarkItem: {},
      loading: false,
      searchForm: [
        {
          type: "input",
          prop: "iconName",
          placeholder: "请输入ICON名称",
        },
      ],
      searchData: {
        iconName: "",
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
            this.tablePage.size = 10;
            this.tablePage.current = 1;
            resetSearchData(this.searchData);
            this.getList();
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "iconName",
          label: "ICON名称",
        },
        {
          label: "ICON",
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
            let add = `<span data-tagName="add" class="comBtn link">添加</span>`;
            return add;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;

            if (tagname === "add") {
              this.row.callback(row);
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
    getList() {
      const params = {
        ...filterNullSearchData(this.searchData),
        type: "2",
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      userAvatarPage(params).then((res) => {
        // this.waterMarkImgList = res.data.data.records;
        this.tableData = res.data.data.records;
        this.tablePage.total = res.data.data.total;
        // const item = this.waterMarkImgList.find(
        //   (v) => v.avatar === this.row.iconFileName
        // );
        // if (item.id) {
        //   this.waterMarkItem = item;
        // }
      });
    },
  },
};
</script>
<style lang="scss">
// .imgBox {
//   cursor: pointer;
//   display: flex;
//   justify-content: center;
//   flex-wrap: wrap;
//   .imgItem {
//     margin-bottom: 10px;
//     margin-right: 30px;
//     width: 60px;
//     height: 60px;
//     cursor: pointer;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     .activeImg {
//       border: 1px solid #409eff;
//     }
//     .imgLoad {
//       max-width: 60px;
//       max-height: 60px;
//     }
//   }
// }
</style>
