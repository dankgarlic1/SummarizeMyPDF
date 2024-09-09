import { useRouter } from "next/router";

const ChatPage = () => {
  const router = useRouter();
  const { chatId } = router.query; // Access the query parameter

  // Optional: Add a console log to see the chatId
  console.log("Chat ID:", chatId);

  if (!chatId) return <div>Loading...</div>;

  return <div>Chat ID: {chatId}</div>;
};

export default ChatPage;
