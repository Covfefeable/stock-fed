<template>
  <Sheader></Sheader>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" v-if="$route.meta.alive"/>
    </keep-alive>
    <component :is="Component" v-if="!$route.meta.alive"/>
  </router-view>
  <Sfooter></Sfooter>
</template>

<script>
import Sheader from "@/components/Sheader";
import Sfooter from "@/components/Sfooter";
export default {
  components: {
    Sheader,
    Sfooter,
  },
  setup() {
  },
};
</script>
<style lang="less">
body {
  padding: 0;
  margin: 0;
  background: #f2f6fc;
}
</style>
