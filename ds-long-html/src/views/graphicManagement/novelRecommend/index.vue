<template>
  <comicRecommend :type="EnumCartoonType.novel" />
</template>

<script>
import comicRecommend from "@/views/graphicManagement/comicRecommend";
import { EnumCartoonType } from "@/util/util";

export default {
  name: "novelRecommend", //小说推荐管理
  components: {
    comicRecommend,
  },

  data() {
    return {
      EnumCartoonType: EnumCartoonType,
    };
  },
};
</script>
