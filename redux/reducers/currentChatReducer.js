const currentChatReducer = (state = "chuj", action) => {
  switch (action.type) {
    case "CURRENTCHAT":
      return (state = "Test");

    default:
      return state;
  }
};

export default currentChatReducer;
