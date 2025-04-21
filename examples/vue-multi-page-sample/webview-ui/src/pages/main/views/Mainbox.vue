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
  <br />
  <br />
  <div>
    <h2>来自 Vscode Webview 的报时：</h2>
    <p>{{ nowDate }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { vscode } from "../../../utils/vscode";

function goTo(command: string) {
  vscode.postMessage({ command });
}

const nowDate = ref<String>("");
vscode.listeningMessage((message) => {
  if (message.command === "dateProductor") {
    nowDate.value = message.payload;
  }
});
</script>

<style lang="scss" scoped></style>
