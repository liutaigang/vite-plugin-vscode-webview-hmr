<template>
  <div>
    <img class="backgrund" :src="bgPictureUrl" />
    <div class="formContainer">
      <h3>xx系统</h3>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        label-width="120px"
        class="loginForm"
        :size="formSize"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(loginFormRef)">登录</el-button>
          <el-button @click="resetForm(loginFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { vscode } from "../utils/vscode";
import { resolveWebviewUrl } from "../utils/resolveWebviewUrl";
import { reactive, ref } from "vue";
import bgPicture from "../assets/sunset.jpg";

const bgPictureUrl = resolveWebviewUrl(bgPicture);

const formSize = ref("default");

const loginFormRef = ref("loginFormRef");
const loginForm = reactive({
  username: "candywall",
  password: "123456",
});

const rules = reactive({
  username: [
    { required: true, message: "用户名不为空！", trigger: "blur" },
    { min: 3, max: 20, message: "用户名长度在3到20个字符之间", trigger: "blur" },
  ],
  password: [
    { required: true, message: "密码不为空！", trigger: "blur" },
    { min: 3, max: 16, message: "用户名长度在3到16个字符之间", trigger: "blur" },
  ],
});

import useRouterStore from "../store/useUserStore";
import { useRouter } from "vue-router";
const router = useRouter();

const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    // 跳转到首页
    router.push("/mainbox");
    vscode.postMessage({
      command: "alert",
      text: "用户登录成功！",
    });
  });
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style lang="scss" scoped>
.backgrund {
  position: absolute;
  background-size: cover;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}
.formContainer {
  width: 500px;
  height: 250px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba($color: #000, $alpha: 0.3);
  text-align: center;
  padding: 20px;

  h3 {
    color: white;
    font-size: 30px;
  }

  .loginForm {
    margin-top: 20px;
  }

  /**
        解决样式不生效的问题 
        :deep() 是用于处理深度选择器的 SCSS 特殊语法，它能够在样式嵌套较深的情况下影响到子组件内的样式。
    */
  :deep(.el-form-item__label) {
    color: white;
  }
}
</style>
