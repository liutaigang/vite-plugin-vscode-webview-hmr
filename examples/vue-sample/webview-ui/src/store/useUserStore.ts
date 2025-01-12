import { defineStore } from "pinia";
import { ref } from "vue";

const useUserStore = defineStore("user", () => {
  const user = ref({});
  function changeUser(value: string) {
    user.value = value;
  }

  return {
    user,
    changeUser,
  };
});

export default useUserStore;
