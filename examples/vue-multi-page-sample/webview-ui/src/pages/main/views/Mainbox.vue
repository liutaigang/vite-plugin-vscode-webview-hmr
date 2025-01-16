<template>
  <div>
    <h1>主页</h1>
    <ul>
      <li>
        <el-button link @click="goTo('openSignPage')"> 登录页 </el-button>
      </li>
      <li>
        <el-button link @click="goTo('openAboutPage')"> 关于我们 </el-button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { vscode } from "../../../utils/vscode";

function goTo(command: string) {
  vscode.postMessage({ command });
}
</script>

<style lang="scss" scoped></style>
