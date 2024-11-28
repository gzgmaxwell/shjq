<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" label-width="90px">
      <el-form-item
        label="审核名称:"
        prop="strategyName"
        :rules="[
          { required: true, message: '请输入审核名称', trigger: 'blur' },
          { validator: checkUsername, trigger: 'blur' },
        ]"
      >
        <el-input
          :disabled="ruleForm.strategyName === '默认审核'"
          v-model="ruleForm.strategyName"
          placeholder="请输入审核名称..."
          :maxlength="20"
        ></el-input>
      </el-form-item>
      <el-form-item label="启用状态:" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="审核人数:"
        prop="workRounds"
        :rules="[
          { required: true, message: '请选择审核人数', trigger: 'bulur' },
        ]"
      >
        <el-select
          v-model="ruleForm.workRounds"
          style="width: 100%"
          placeholder="请选择审核人数..."
        >
          <el-option label="1" value="1"></el-option>
          <el-option label="2" value="2"></el-option>
          <el-option label="3" value="3"></el-option>
          <el-option label="4" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="通过人数:"
        prop="passRounds"
        :rules="[
          { required: true, message: '请选择通过人数', trigger: 'bulur' },
        ]"
      >
        <el-select
          v-model="ruleForm.passRounds"
          style="width: 100%"
          placeholder="请选择通过人数..."
        >
          <el-option label="1" value="1"></el-option>
          <el-option label="2" value="2"></el-option>
          <el-option label="3" value="3"></el-option>
          <el-option label="4" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="视频标签:"
        prop="classifyList"
        v-if="!(ruleForm.strategyName === '默认审核')"
        :rules="[
          { required: true, message: '请选择视频标签', trigger: 'bulur' },
        ]"
      >
        <el-cascader
          style="width: 100%"
          :options="options"
          v-model="ruleForm.classifyList"
          clearable
          :show-all-levels="false"
          placeholder="请选择视频标签..."
          :props="{
            label: 'classifyName',
            value: 'id',
            children: 'childClassifyList',
            multiple: true,
          }"
        ></el-cascader>
      </el-form-item>
      <el-form-item
        v-if="ruleForm.strategyName !== '默认审核'"
        label="设置期限:"
        prop="sfszqx"
      >
        <el-radio-group v-model="ruleForm.sfszqx">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="ruleForm.strategyName !== '默认审核' && ruleForm.sfszqx === '1'"
        label="持续日期:"
        prop="times"
        :rules="[{ required: true, message: '请选择日期', trigger: 'change' }]"
      >
        <el-date-picker
          v-model="ruleForm.times"
          style="width: 100%"
          type="datetimerange"
          range-separator="至"
          value-format="yyyy-MM-dd hh:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
        <el-button @click="row.callback && row.callback()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { addForm, editData } from "@/api/video-manage/allocation.js";
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
      options: [],
      ruleForm: {
        id: "",
        strategyName: "",
        status: "1",
        workRounds: "",
        passRounds: "",
        classifyList: "",
        times: [],
        sfszqx: "1",
      },
    };
  },
  mounted() {
    this.getVidTypeData();
  },
  computed: {
    ...mapGetters({
      classifyOptions: "classifyOptions",
    }),
  },
  methods: {
    checkUsername(rule, value, callback) {
      //正则表达式
      var reg = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+$");
      if (!reg.test(value)) {
        callback(new Error("请输入中文、数字和英文！"));
      } else {
        callback();
      }
    },
    getVidTypeData() {
      this.options = this.classifyOptions;
      this.getRow();
    },
    getRow() {
      this.ruleForm.classifyList = this.row?.classifyList?.map((item) => [
        item.parentClassifyId,
        item.classifyId,
      ]);
      this.ruleForm.strategyName = this.row.strategyName;
      this.ruleForm.status = this.row?.status == "启用" ? "1" : "0" || "1";
      this.ruleForm.workRounds = this.row.workRounds;
      this.ruleForm.passRounds = this.row.passRounds;
      if (this.row.startTime && this.row.endTime) {
        this.row.sfszqx = "1";
        this.ruleForm.times = [this.row.startTime, this.row.endTime];
      } else {
        this.row.sfszqx = "0";
      }
      this.ruleForm.sfszqx = this.row.sfszqx;
      this.ruleForm.id = this.row.id;
    },
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          let obj = {};
          if (this.ruleForm.times.length > 0) {
            obj = {
              startTime: this.ruleForm.times[0],
              endTime: this.ruleForm.times[1],
            };
          }
          let newObj = Object.assign(this.ruleForm, obj);
          let arr = [];
          if (this.ruleForm.classifyList.length > 0) {
            this.ruleForm.classifyList.map((item) => {
              arr.push(item[1]);
            });
          }
          this.ruleForm.classifyList = arr;
          if (this.row.id) {
            editData(newObj).then((res) => {
              this.$message.success("编辑成功");
              this.row.callback();
            });
          } else {
            addForm(newObj).then((res) => {
              this.$message.success("新增成功");
              this.row.callback();
              this.page = 1;
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
