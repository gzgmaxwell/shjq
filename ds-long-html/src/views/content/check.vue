<template>
  <div class="execution">
    <basic-container>
      <div class="audit">
        <ul>
          <li>
            <p>本周完成审核数</p>
            <div>
              <ul>
                <li><span>50</span>个视频</li>
                <li><span>100</span>条评论</li>
                <li><span>100</span>条弹幕</li>
              </ul>
            </div>
          </li>
          <li class="border-left">
            <p>本周视频平均审核时间</p>
            <div>
              <ul>
                <li><span>8</span>分钟</li>
              </ul>
            </div>
          </li>
          <li class="border-left">
            <p>总计完成审核数</p>
            <div>
              <ul>
                <li><span>12</span>个视频</li>
                <li><span>56</span>条评论</li>
                <li><span>38</span>条弹幕</li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </basic-container>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  mounted() {
  }
};
</script>

<style lang="scss" scoped>
.basic-container {
  padding: 8px 20px;
}
.execution {
  margin: 35px 0 10px;
}
.el-card__body {
  padding-top: 0 !important;
}
.audit {
  ul {
    display: flex;
    justify-content: center;
    align-items: center;
    li {
      flex: 1;
      list-style: none;
      color: #ccc;
      text-align: center;
      p {
        text-align: center;
        margin-top: 0;
      }
      span {
        color: #409eff;
      }
      &.border-left {
        border-left: 1px solid #ccc;
      }
    }
  }
}
</style>