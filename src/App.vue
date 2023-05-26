<template>
  <div class="backdrop"> //efefef
    <div class="messenger">
      <div class="messenger__container" ref="messengerOptions">
        <Suspense>
          <messenger-window
            :load-messages="loadMessages"
            :local-messages="localMessages"
            @messages-loaded="messagesLoaded"
          />
          <template #fallback>loading...</template>
        </Suspense>
      </div>
      <div class="messenger__add">
        <input v-model="newMessage" />
        <button class="btn" @click="addLocalMessage" :disabled="!newMessage">
          send
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import MessengerWindow from "./components/MessengerWindow.vue";

const messengerOptions = ref(null);
const loadMessages = ref(false);
const localMessages = ref([]);
const newMessage = ref("");
const newMessageSend = ref(false);

onMounted(() => {
  messengerOptions.value.addEventListener("scroll", () => {
    const scrollUp =
      Math.abs(messengerOptions.value.scrollTop) +
        messengerOptions.value.clientHeight + 1 >=
      messengerOptions.value.scrollHeight; //ведет себя по разному при разном масштабе браузера
    if (scrollUp) {
      loadMessages.value = true;
    }
  });
});

function messagesLoaded() {
  loadMessages.value = false;
}

async function addLocalMessage() {
  localMessages.value.push({ msg: newMessage.value, type: "local" });
  newMessageSend.value = true;
  await animationScrollBack();
}

function clearInput() {
  if (newMessageSend.value) {
    newMessage.value = "";
    newMessageSend.value = false;
  }
}

async function animationScrollBack() {
  let smoothness = 100;
  for (let i = 0; i < smoothness; i++) {
    await new Promise((resolve) => {
      window.setTimeout(function () {
        resolve();
      }, 100 / smoothness);
    });
    messengerOptions.value.scrollTo(
      messengerOptions.value.scrollTop,
      messengerOptions.value.scrollTop +
        messengerOptions.value.scrollHeight / smoothness
    );
  }
}
watch(newMessageSend, clearInput);
</script>
<style lang="scss" scoped>
.backdrop {
  background-color: rgba(0, 0, 0, 0.377);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.messenger {
  display: flex;
  flex-direction: column;
  position: absolute;
  background-color: white;
  width: 400px;
  height: 650px;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 100px;
  border-radius: 15px;
  justify-content: space-between;
  &__container {
    position: relative;
    overflow-y: scroll;
    min-height: 590px;
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-start;
  }
  &__add {
    display: flex;
    justify-content: space-between;
    padding: 15px;
    input {
      flex: 1 1 auto;
    }
  }
}
.btn {
  background-color: green;
  padding: 5px;
  margin-left: 5px;
  width: 60px;
  text-align: center;
  color: white;
  border-radius: 5px;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    transition: 0.3s;
    background-color: grey;
  }
}
</style>
