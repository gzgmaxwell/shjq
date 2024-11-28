<template>
  <el-form
    :model="form"
    :rules="rules"
    ref="form"
    label-width="80px"
    class="demo-ruleForm"
  >
    <el-form-item label="作者:" prop="createUserId">
      <el-select
        v-model="form.createUserId"
        remote
        filterable
        clearable
        reserve-keyword
        placeholder="请输入作者名"
        :remote-method="remoteMethod"
      >
        <el-option
          v-if="optionAuthor.length"
          v-for="(result, i) in optionAuthor"
          :key="i"
          :value="result.id"
          :label="result.nickName"
          :disabled="result.status !== 'ENABLE'"
        >
          <span style="float: left">{{ result.nickName }}</span>
          <span style="float: right" class="must">{{ compLabel(result) }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('form')">确认修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { AuthorStatus, ENUM_USER_STATUS } from "@/util/util";
import { dsUserList } from "@/api/userList";
export default {
  props: {
    row: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      optionAuthor: [],
      form: {
        createUserId: "",
      },
      rules: {
        createUserId: [
          {
            required: true,
            message: "请选择作者",
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {
    compLabel() {
      return (val) => {
        // const item = AuthorStatus.find((v) => v.id === val.status);
        const item = AuthorStatus.filter(
          (item) => item.id !== ENUM_USER_STATUS.enable
        ).find((v) => v.id === val.status);
        return item?.name;
      };
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.getAuthorName();
    },
    async getAuthorName() {
      const { data: res } = await dsUserList({
        current: 1,
        size: 20,
      });
      this.optionAuthor = res.data.records;
    },
    async remoteMethod(query) {
      if (query) {
        const { data: res } = await dsUserList({
          current: 1,
          size: 20,
          nickName: query,
        });
        this.optionAuthor = res.data.records.filter((item) => {
          return item.nickName.indexOf(query) > -1;
        });
      } else {
        this.getAuthorName();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.row.callback(this.form);
        }
      });
    },
  },
};
</script>
