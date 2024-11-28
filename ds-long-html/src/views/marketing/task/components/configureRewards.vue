<template>
  <el-form label-width="160px" class="demo-ruleForm">
    <el-form-item v-for="(item, index) in configList" :key="index">
      <label slot="label">
        <!-- <span class="must">*</span> -->
        {{ compuLable(item) }}</label
      >
      <el-input-number
        :min="0"
        :precision="0"
        :step="1"
        :max="9999"
        v-model="item.propQuantity"
      ></el-input-number>
    </el-form-item>

    <el-form-item>
      <el-button @click="row.callback && row.callback()">取消</el-button>
      <el-button type="primary" @click="submitForm()">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { addObj } from "@/api/admin/version";
import { configList, awardConfig } from "@/api/marketing/index";
import { debounceCallBack, optProps } from "@/util/util";
export default {
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      configList: [],
    };
  },
  computed: {
    compuLable() {
      return (item) => {
        return optProps.find((v) => v.id === item.propName)?.label;
      };
    },
  },
  mounted() {
    configList({
      type: "USER_BIND_MOBILE",
    }).then((res) => {
      this.configList = res.data.data;
    });
  },
  methods: {
    comSubmit(apiFunc) {
      const params = {
        configList: this.configList,
        type: "USER_BIND_MOBILE",
      };
      return awardConfig(params).then(() => {
        this.$message.success("配置成功");
        this.row.callback(true);
        return Promise.resolve();
      });
    },
    submitForm() {
      debounceCallBack(() => this.comSubmit(addObj))();
    },
  },
};
</script>
