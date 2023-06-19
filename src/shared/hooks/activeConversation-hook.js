//react
import { useContext } from "react";

//context
import { ChatsContext } from "../../shared/context/chats-context";

export const useActiveConversation = () => {
  //destructuring from chats context
  const { chats, handleActiveConversation } = useContext(ChatsContext);

  //function to set the active conversation
  const openConversationHandler = (id) => {
    let chatId = null;
    chats.forEach((chat) => {
      if (
        chat._id === id ||
        (chat.participants.length == 2 &&
          chat.participants.some((user) => user.phone === id))
      ) {
        chatId = chat._id;
        return;
      }
    });
    if (chatId !== null) {
      handleActiveConversation(chatId);
      // console.log(chatId);
    } else {
      handleActiveConversation({ _id: -1, phone: id });
    }
  };

  //returning the function that could be used in other components
  return { openConversationHandler };
};
