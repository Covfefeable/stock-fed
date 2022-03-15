<template>
  <el-popover :width="440" @show="updateFavour">
    <template #reference>
      <el-image
        style="width: 30px; height: 30px"
        :src="require('../assets/img/favour.png')"
      />
    </template>
    <template #default>
      <el-table
        v-if="stock.my_stock.length"
        :data="stock.filter_stock"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="name" label="名称" width="180" />
        <el-table-column prop="code" label="代码" width="100" />
        <el-table-column align="right" width="150">
          <template #header>
            <el-input v-model="keyword" size="small" placeholder="输入以搜索" />
          </template>
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleSelect(scope.$index, scope.row)"
              >选择</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-empty
        v-if="!stock.my_stock.length"
        description="还没有自选，快去添加吧"
      />
    </template>
  </el-popover>
</template>
<script>
import { reactive, ref, watch } from "vue";
export default {
  setup(props, context) {
    let stock = reactive({
      my_stock: [],
      filter_stock: []
    });
    if (localStorage.getItem("my_stock")) {
      stock.my_stock = JSON.parse(localStorage.getItem("my_stock"));
      stock.filter_stock = JSON.parse(localStorage.getItem("my_stock"));
    }

    let keyword = ref("");
    watch(keyword, (val) => {
      if (val) {
        stock.filter_stock = stock.my_stock.filter((item) => {
          return item.code.includes(val) || item.name.includes(val)
        })
      } else {
        stock.filter_stock = stock.my_stock
      }
    })

    const updateFavour = () => {
      if (localStorage.getItem("my_stock")) {
        stock.my_stock = JSON.parse(localStorage.getItem("my_stock"));
        stock.filter_stock = JSON.parse(localStorage.getItem("my_stock"));
      }
    };

    const handleDelete = (index, row) => {
      if (localStorage.getItem("my_stock")) {
        stock.my_stock = JSON.parse(localStorage.getItem("my_stock"));
      }
      stock.my_stock.map((item, index) => {
        if (row.code === item.code) {
          stock.my_stock.splice(index, 1);
        }
      });
      localStorage.setItem("my_stock", JSON.stringify(stock.my_stock));
      updateFavour()
      context.emit('update-favour')
    };
    const handleSelect = (index, row) => {
        context.emit('select-favour', row)
    };
    return { stock, keyword, handleDelete, handleSelect, updateFavour };
  },
};
</script>