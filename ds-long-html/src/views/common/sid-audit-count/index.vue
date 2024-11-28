<template>
  <basic-container>
    <div style="display: flex">
      <div
        v-for="item in countList"
        :key="item.id"
        :itemOption="item"
        style="flex-grow: 1"
        :style="item.edge ? 'border-right:1px solid #eee' : 'border:none'"
      >
        <p style="text-align: center; color: rgba(0, 0, 0, 0.447058823529412)">
          {{ item.title }}
        </p>
        <p style="text-align: center">
          <span
            style="display: inline-block; text-indent: 20px"
            v-for="childItem in item.countNum"
            :key="childItem.unit"
          >
            <avue-count-up
              style="color: rgba(2, 167, 240, 0.996078431372549)"
              :end="parseInt(childItem.value)"
              :start="0"
            ></avue-count-up>
            <span style="color: rgba(0, 0, 0, 0.447058823529412)">{{
              childItem.unit
            }}</span>
          </span>
        </p>
      </div>
    </div>
  </basic-container>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
  },
  watch: {
    options(newVal, oldVal) {
      let RecordObj = newVal;
      this.countList[0].countNum[0].value = RecordObj.weekVideoCount;
      this.countList[0].countNum[1].value = RecordObj.weekCommentCount;
      this.countList[0].countNum[2].value = RecordObj.weekBulletCount;
      this.countList[1].countNum[0].value = RecordObj.avgWeekVideoTime;
      this.countList[2].countNum[0].value = RecordObj.videoCount;
      this.countList[2].countNum[1].value = RecordObj.commentCount;
      this.countList[2].countNum[2].value = RecordObj.bulletCount;
    },
  },
  data() {
    return {
      countList: [
        {
          id: 1,
          title: "本周完成审核数",
          edge: true,
          countNum: [
            {
              value: 0,
              unit: "个视频",
            },
            {
              value: 0,
              unit: "条评论",
            },
            {
              value: 0,
              unit: "条弹幕",
            },
          ],
        },
        {
          id: 2,
          title: "本周视频平均审核时间",
          edge: true,
          countNum: [
            {
              value: 0,
              unit: "分钟",
            },
          ],
        },
        {
          id: 3,
          title: "总计完成审核数",
          edge: false,
          countNum: [
            {
              value: 0,
              unit: "个视频",
            },
            {
              value: 0,
              unit: "条评论",
            },
            {
              value: 0,
              unit: "条弹幕",
            },
          ],
        },
      ],
    };
  },
};
</script>
