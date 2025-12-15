<template>
  <div class="mt20">
    <el-form :model="form" ref="form" label-width="150px" class="demo-ruleForm">
      <el-form-item label="url">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="roomNum">
        <el-input v-model="form.roomNum"></el-input>
      </el-form-item>
      <el-form-item label="time">
        <el-input v-model="form.time"></el-input>
      </el-form-item>
      <el-form-item label="size">
        <el-input v-model="form.size"></el-input>
      </el-form-item>
      <el-form-item>
        <div style="width: 700px; height: 400px; position: relative">
          <easyPlayer
            title="视频预览"
            :row="{
              videoUrl:
                form.url ||
                `${origin}/live-server/live/get/${form.roomNum}/live.m3u8?time=${form.time}&size=${form.size}`,
            }"
            v-if="form.url || (form.roomNum && form.time && form.size)"
          />
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import easyPlayer from "@/components/easyPlayer/index.vue";

export default {
  components: {
    easyPlayer,
  },
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
      form: {
        url: "",
        roomNum: "",
        time: "",
        size: "",
      },
      origin: window.origin,
    };
  },
  methods: {},
};
</script>
