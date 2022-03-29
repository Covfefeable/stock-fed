<template>
  <Sheader />
  <TrainModel />
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" v-if="$route.meta.alive" />
    </keep-alive>
    <component :is="Component" v-if="!$route.meta.alive" />
  </router-view>
  <Sfooter />
</template>

<script>
import Sheader from "@/components/Sheader";
import Sfooter from "@/components/Sfooter";
import TrainModel from "@/components/TrainModel.vue";
export default {
  components: {
    Sheader,
    Sfooter,
    TrainModel,
  },
  setup() {},
};
</script>
<style lang="less">
body {
  padding: 0;
  margin: 0;
  background: #f2f6fc;
}
</style>
