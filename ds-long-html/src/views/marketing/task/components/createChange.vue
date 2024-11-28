<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="150px"
    class="demo-ruleForm"
  >
    <el-form-item label="道具" prop="props">
      <el-select
        style="width: 80%"
        v-model="ruleForm.props"
        clearable
        placeholder="请选择道具"
      >
        <el-option
          v-for="item in optProps"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="数量" prop="count">
      <el-input-number
        placeholder="请输入数量"
        style="width: 30%"
        :step="compuShow(ruleForm.props).step"
        :precision="compuShow(ruleForm.props).precision"
        :min="compuShow(ruleForm.props).min"
        v-model="ruleForm.count"
        clearable
      />
      <span class="ml5">{{ compuOptProps(ruleForm.props) }}</span>
    </el-form-item>
    <el-form-item label="需要积分" prop="integral">
      <el-input-number
        placeholder="请输入积分"
        style="width: 30%"
        :step="1"
        :precision="0"
        :min="1"
        v-model="ruleForm.integral"
        clearable
      />
    </el-form-item>
    <el-form-item label="福利范围">
      <el-checkbox-group v-model="ruleForm.scope">
        <el-checkbox
          v-for="item in optWelfare"
          :label="item.id"
          :key="item.id"
          >{{ item.name }}</el-checkbox
        >
      </el-checkbox-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">{{
        $t("determine")
      }}</el-button>
      <el-button @click="row.callback && row.callback()">{{
        $t("cancel")
      }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { saveExchangeProps, editExchangeProps } from "@/api/marketing/index";
import { optProps, EnumProps, debounceCallBack, optWelfare } from "@/util/util";

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
      optProps: optProps.filter(
        (v) => v.id === EnumProps.SVIP || v.id === EnumProps.VIDEO_CARD
      ),
      optWelfare: optWelfare,

      ruleForm: {
        props: "",
        count: undefined,
        integral: undefined,
        scope: [],
      },
      rules: {
        props: [
          {
            required: true,
            message: "请选择道具",
            trigger: "blur",
          },
        ],
        count: [
          {
            required: true,
            message: "请输入数量",
            trigger: "blur",
          },
        ],
        integral: [
          {
            required: true,
            message: "请输入积分",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    compuOptProps() {
      return (params) => {
        return optProps.find((v) => v.id === params)?.unit;
      };
    },
    compuShow() {
      return (props) => {
        const arr = [EnumProps.SVIP, EnumProps.VIDEO_CARD, EnumProps.INTEGRAL];
        if (arr.includes(props)) {
          return {
            step: 1,
            precision: 0,
            min: 1,
          };
        }
        return {
          step: 1,
          precision: 2,
          min: 1,
        };
      };
    },
  },
  mounted() {
    if (this.row.id) {
      this.getInfo();
    }
  },

  methods: {
    getInfo() {
      this.ruleForm.props = this.row.props;
      this.ruleForm.count = this.row.count;
      this.ruleForm.integral = this.row.integral;
      this.ruleForm.scope = this.row?.scope ? this.row?.scope : [];
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.commit();
        }
      });
    },
    commit() {
      const params = {
        ...this.ruleForm,
        id: this.row.id,
        scope: this.ruleForm.scope,
      };
      if (!this.row.id) {
        const debounceAPI = () => {
          return saveExchangeProps(params).then(() => {
            this.$message.success("保存成功");
            this.row.callback(true);
            return Promise.resolve();
          });
        };
        debounceCallBack(debounceAPI)();
      } else {
        editExchangeProps(params).then(() => {
          this.row.callback(true);
          this.$message.success("编辑成功");
        });
      }
    },
  },
};
</script>
