<template>
  <Transition name="error">
    <div class="error" v-if="errorAPI">Ошибка загрузки</div>
  </Transition>
  <transition-group name="list">
    <div
      class="message list-item"
      v-for="(message, id) in allMessages"
      :key="id"
      :class="{
        message__user: message?.type === 'local',
        message__end: message?.type === 'end',
      }"
    >
      {{ message?.msg ?? message }}
    </div>
  </transition-group>
</template>
<script setup>
import { watch, ref } from "vue";
import { useMessages } from "../use/messages";

const allMessages = ref([]);
const errorAPI = ref(null);

const props = defineProps({
  loadMessages: Boolean,
  localMessages: Array,
});

const emit = defineEmits(["messages-loaded"]);

getMessage();

async function getMessage(offset = 0) {
  if (!checkLastMessage()) {
    errorAPI.value = null;
    const { messages, error } = await useMessages(offset);
    if (error) {
      errorAPI.value = error;
      return;
    }
    allMessages.value = [...allMessages.value, ...messages.value.result];
  }
}

async function addMessages() {
  if (props.loadMessages) {
    const smsOnDisplay = allMessages.value.length - props.localMessages.length;
    getMessage(smsOnDisplay);
    emit("messages-loaded");
  }
}

function addLocalMessage() {
  allMessages.value = [
    props.localMessages[props.localMessages.length - 1],
    ...allMessages.value,
  ];
}

function checkLastMessage() {
  let checkLabel = false;
  allMessages.value.forEach((message) => {
    if (message?.type === "end") {
      checkLabel = true;
    }
  });
  return checkLabel;
}

watch(() => props.loadMessages, addMessages);
watch(() => props.localMessages, addLocalMessage, { deep: true });
</script>
<style lang="scss" scoped>
.message {
  padding: 8px;
  max-width: 290px;
  margin: 6px 0px 6px 15px;
  border-radius: 25px;
  box-shadow: 1px 1px 7px rgba(0, 0, 0, 0.233);
  word-wrap: break-word;
  &__user {
    background-color: rgb(161, 161, 168);
    align-self: flex-end;
    margin: 6px 15px 6px 0px;
  }
  &__end {
    box-shadow: none;
    align-self: center;
    color: grey;
  }
}
.error {
  position: fixed;
  top: 5px;
  padding: 15px;
  background-color: rgba(206, 40, 40, 0.966);
  color: white;
  font-weight: 700;
  border-radius: 25px;
  z-index: 5;
  left: calc(50% - 79px);
}
.error-enter-active {
  transition: 0.5s ease all;
}
.error-leave-active {
  transition: 0.2s ease all;
}
.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.list-item {
  display: inline-block;
  margin-right: 10px;
}

.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
