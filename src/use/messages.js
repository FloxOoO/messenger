import { ref } from "vue";
import { useFetch } from "./fetch";

export async function useMessages(offset = 0) {
  const SMS_ON_DISPLAY = 12;

  const loaded = ref(false);
  let error = "";
  const { response: messages, request } = useFetch(
    `https://numia.ru/api/getMessages?offset=${offset}`
  );

  if (!loaded.value) {
    try {
      await request();
      loaded.value = true;
      correctDisplayMessage()
    } catch (e) {
      error = e;
    }
  }

  function correctDisplayMessage() {
    messages.value.result.length = SMS_ON_DISPLAY;
    if (messages.value.result.includes(undefined)) {
      messages.value.result = [
        ...messages.value.result.filter((message) => message !== undefined),
        { msg: "начало переписки", type: "end" },
      ];
    }
  }

  return { messages, error };
}
