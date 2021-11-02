export const setCurrentChat = (chat) => {
  return {
    type: "CURRENTCHAT",
    payload: chat,
  };
};
