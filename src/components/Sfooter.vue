<template>
  <div class="footer">
      <div class="content">Copyright © 2022 covfefe</div>
  </div>
</template>
<script>
export default {
  setup() {},
};
</script>
<style lang="less" scoped>
.footer {
    width: 100%;
    height: 50px;
    background-color: #409eff;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;

    .content {
      margin: 0 80px;
    }
}
</style>