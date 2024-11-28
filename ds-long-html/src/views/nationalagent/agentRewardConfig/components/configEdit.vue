<template>
  <el-form
    :model="ruleForm"
    ref="ruleForm"
    label-width="120px"
    class="demo-ruleForm"
  >
    <template>
      <div>
        <div>
          <el-form-item
            v-for="(item, index) in ruleForm.list"
            label="每邀请"
            :key="index"
          >
            <el-input
              :value="item.userNum"
              style="width: 25%"
              placeholder="请输入人数"
              @input="(val) => handleInputBlur(val, item)"
            >
            </el-input>
            人,获得
            <el-select
              :value="item.type"
              placeholder="请选择类型"
              style="width: 25%"
              @change="(val) => handleSelectChange(val, item)"
            >
              <el-option
                v-for="item in propsOpt"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-input
              v-model="item.num"
              style="width: 25%; margin-left: 5px"
              placeholder="请输入"
            >
            </el-input>
            <span> {{ propsTitle(item) }}</span>
            <i
              class="el-icon-remove btn"
              @click.prevent="removeProps(index)"
              v-if="index > 0 || ruleForm.list.length > 1"
            ></i>
            <i
              class="el-icon-circle-plus btn"
              @click="addProps"
              v-if="index >= 0 && index === ruleForm.list.length - 1"
            ></i>
          </el-form-item>
        </div>
      </div>
    </template>
    <el-form-item style="text-align: right; margin-top: 40px">
      <el-button @click="row.callback && row.callback()">{{
        $t("cancel")
      }}</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">{{
        $t("determine")
      }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { debounceCallBack, optProps, EnumProps } from "@/util/util";
import { updateClearingAppSchemeDetail } from "@/api/admin/index";
export default {
  components: {},
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
        list: [{ userNum: undefined, type: undefined, num: "" }],
      },
    };
  },
  computed: {
    propsOpt() {
      return optProps.filter((v) => {
        return v.id !== EnumProps.INTEGRAL;
      });
    },
    propsTitle() {
      return (item) => {
        const matchedProp = optProps.find((v) => v.id === item.type);
        return matchedProp?.unit || "";
      };
    },
  },
  mounted() {
    this.getInfo();
  },

  methods: {
    handleInputBlur(val, item) {
      let isRepeat = this.ruleForm.list.some(
        (v) => v.userNum == val && v.type == item.type
      );
      if (isRepeat) {
        item.userNum = undefined;
        this.$message.error(
          "系统提示：检测到重复输入，请确认信息无误后再次提交"
        );
        return;
      }
      item.userNum = val;
    },

    handleSelectChange(val, item) {
      let isRepeat = this.ruleForm.list.some(
        (v) => v.userNum == item.userNum && v.type == val
      );

      if (isRepeat) {
        item.type = undefined;
        this.$message.error(
          "系统提示：检测到重复输入，请确认信息无误后再次提交"
        );
        return;
      }
      item.type = val;
    },
    // 道具校验
    validProps() {
      const regex = /^[1-9]\d*$/;
      const peopleNum = this.ruleForm.list.some(
        (item) => !item.userNum || !item.type || !item.num
      );
      const peopleValidNum = this.ruleForm.list.some(
        (item) => !regex.test(item.userNum) || !regex.test(item.num)
      );

      if (peopleNum) {
        this.$message.error(`请填写道具!`);
        return false;
      }
      if (peopleValidNum) {
        this.$message.warning("请填写正整数!");
        return false;
      }
      return true;
    },
    addProps() {
      this.ruleForm.list.push({ userNum: "", type: "", num: "" });
    },
    removeProps(index) {
      if (index >= 0) {
        this.ruleForm.list.splice(index, 1);
      }
    },
    getInfo() {
      if (this.row.list.length) {
        this.ruleForm.list = JSON.parse(JSON.stringify(this.row.list));
      }
    },
    submitForm() {
      let PropsCondition = this.validProps();
      if (!PropsCondition) {
        return false;
      }
      if (PropsCondition) {
        this.commit();
      }
    },
    commit() {
      const list = [...this.ruleForm.list];
      const comSubmit = () => {
        return updateClearingAppSchemeDetail(list)
          .then((res) => {
            if (res.data.code == 200) {
              this.$message.success("操作成功");
              this.row.callback(true);
              return Promise.resolve();
            }
          })
          .catch((err) => {});
      };
      debounceCallBack(comSubmit)();
    },
  },
};
</script>
<style lang="scss" scoped>
.btn {
  font-size: 20px;
  margin: 0 5px;
  cursor: pointer;
}
</style>
