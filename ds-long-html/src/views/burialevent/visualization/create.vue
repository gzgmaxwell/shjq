<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="事件ID" prop="eventId">
        <el-input
          v-model="ruleForm.eventId"
          placeholder="请输入事件ID"
        ></el-input>
      </el-form-item>
      <el-form-item label="事件名称" prop="name">
        <el-input
          v-model="ruleForm.name"
          placeholder="请输入事件名称"
        ></el-input>
      </el-form-item>

      <el-form-item label="中文名称" prop="description">
        <el-input
          v-model="ruleForm.description"
          placeholder="请输入中文名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="触发方式" prop="triggerMode">
        <el-select
          v-model="ruleForm.triggerMode"
          clearable
          placeholder="请选择触发方式"
        >
          <el-option
            v-for="item in optTrigger"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="及时回传" prop="uploadImmediately">
        <el-select
          v-model="ruleForm.uploadImmediately"
          clearable
          placeholder="请选择及时回传"
        >
          <el-option
            v-for="item in optCallbackImme"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="页面" prop="moduleName">
        <el-input
          v-model="ruleForm.moduleName"
          placeholder="请输入页面"
        ></el-input>
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
import { saveOrUpdateEvent } from "@/api/burialevent";
import { optTrigger, optCallbackImme } from "@/util/util";

export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      optTrigger: optTrigger,
      optCallbackImme: optCallbackImme,
      ruleForm: {
        eventId: "",
        name: "",
        description: "",
        triggerMode: "",
        uploadImmediately: "",
        moduleName: "",
      },

      rules: {
        eventId: [{ required: true, message: "请输入事件ID", trigger: "blur" }],
        name: [{ required: true, message: "请输入事件名称", trigger: "blur" }],
        description: [
          { required: true, message: "请输入中文名称", trigger: "blur" },
        ],
        triggerMode: [
          { required: true, message: "请选择触发方式", trigger: "change" },
        ],
        uploadImmediately: [
          { required: true, message: "请选择及时回传", trigger: "change" },
        ],
        moduleName: [
          { required: true, message: "请输入页面", trigger: "blur" },
        ],
      },
    };
  },

  mounted() {
    if (this.row.id) {
      this.ruleForm.eventId = this.row.eventId;
      this.ruleForm.name = this.row.name;
      this.ruleForm.description = this.row.description;
      this.ruleForm.triggerMode = this.row.triggerMode;
      this.ruleForm.uploadImmediately = this.row.uploadImmediately;
      this.ruleForm.moduleName = this.row.moduleName;
    }
  },
  methods: {
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
      };
      saveOrUpdateEvent(params).then((res) => {
        if (res.data.code === 200) {
          const tip = this.row.id ? "编辑成功" : "保存成功";
          this.$message.success(tip);
          this.row.callback(true);
        }
      });
    },
  },
};
</script>
