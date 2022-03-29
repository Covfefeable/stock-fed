<template>
  <el-menu
    default-active="Home"
    class="el-menu-demo"
    mode="horizontal"
    background-color="#409eff"
    text-color="#fff"
    active-text-color="#ffd04b"
    @select="handleSelect"
  >
    <h3>stock-quantitative</h3>
    <el-menu-item index="Home">首页</el-menu-item>
    <el-menu-item index="Model">模型</el-menu-item>
    <el-menu-item index="Foresee" disabled>策略</el-menu-item>
    <el-menu-item index="About">关于</el-menu-item>
    <!-- <el-sub-menu index="2">
      <template #title>Workspace</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu> -->
  </el-menu>
</template>
<script>
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const handleSelect = (e) => {
      router.push({
        name: e,
      });
    };
    return { handleSelect };
  },
};
</script>
<style lang="less" scoped>
h3 {
    padding: 0 30px;
    color: #ffffee;
}
</style>