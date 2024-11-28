<template>
  <el-form
    :model="ruleForm"
    ref="ruleForm"
    label-width="150px"
    class="demo-ruleForm"
    :rules="rules"
  >
    <el-form-item label="观看权限" prop="watchLevel">
      <el-select
        v-model="ruleForm.watchLevel"
        clearable
        @change="change"
        placeholder="请选择观看权限"
      >
        <el-option
          v-for="item in optWatchLevel"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="金币个数"
      prop="price"
      v-if="comShowPrice(ruleForm.watchLevel)"
    >
      <el-input-number
        placeholder="请输入金币个数"
        :min="1"
        :precision="1"
        :max="999999999"
        style="width: 56%"
        v-model="ruleForm.price"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="row.callback(ruleForm)">{{
        $t("determine")
      }}</el-button>
      <el-button @click="row.callback && row.callback()">{{
        $t("cancel")
      }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { optionWatchPermission, ENUM_WATCH_PERMISSION } from "@/util/util";
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
  data() {
    return {
      ruleForm: {
        watchLevel: "",
        price: 0,
      },
      optWatchLevel: optionWatchPermission,
      rules: {
        price: [
          {
            required: true,
            message: "请输入金币个数",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    comShowPrice() {
      return (watchLevel) => {
        if (watchLevel === ENUM_WATCH_PERMISSION.charge) {
          return true;
        }
        return false;
      };
    },
  },
  mounted() {
    this.ruleForm.price = this.row.price;
    this.ruleForm.watchLevel = this.row.watchLevel;
  },
  methods: {
    change() {
      if (this.ruleForm.watchLevel !== ENUM_WATCH_PERMISSION.charge) {
        this.ruleForm.price = undefined;
      }
    },
  },
};
</script>
