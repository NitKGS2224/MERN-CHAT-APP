import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
export const ChatContext = createContext();
export const ChatProvider =({children})=>{

  const [messages , setMessages] = useState([])
  const [ users , setUsers] = useState([]);
   const [selectedUser, setSelectedUser] = useState(null)
  const [unseenMessage , setUnseenMessage] = useState({}); 
const {socket } = useContext(AuthContext);


// create a function to get all users for sidebar //

const getUsers = async()=>{
  try{
  const {data} = await axios.get("/api/messages/users");
  if(data.success){
    setUsers(data.users);
    setUnseenMessage(data.unseenMessage);

  }
  }
  catch(err){
    toast.error(err.message)
  }
}
  // create a function to get all messages for selcted users

  const getMessages = async(userId)=>{

    try{
const {data} = await axios.get(`/api/messages/${userId}`)

//checking the response
if(data.success){
  setMessages(data.messages);
}
    }
    catch(err){
toast.error(err.message)
    }
  }


const sendMessage =  async(messageData)=>{
  try{
const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData)
if(data.success){
  setMessages((prevMessage)=>[...prevMessage , data.newMessage])
}else{
  toast.error(data.data.message)
}
  }
  catch(err){
    toast.error(data.data.message)
  }
}

// create the function when new message send by selcted user

const subscribeToMessage= async ()=>{
  if(!socket) return

  socket.on("newMessage"  , (newMessage)=>{
if(selectedUser && newMessage.senderId === selectedUser._id){
  newMessage.seen = true;
  setMessages((prevMessage)=>[...prevMessage , newMessage]);
  axios.put(`/api/messages/mark/${newMessage._id}`)

}else{
  setUnseenMessage((prevUnseenMessages)=>({
    ...prevUnseenMessages  ,[newMessage.senderId] :  prevUnseenMessages[newMessage.senderId]? prevUnseenMessages[newMessage.senderId] +1: 1
  }))
}
  })
}


//create function to unscribe from messages
const unscribeFromMessages =()=>{
  if(socket) socket.off("newMessage");

}
useEffect(()=>{
subscribeToMessage()
return()=>
  unscribeFromMessages();
},[socket , selectedUser])

  const value = {
messages ,
 getMessages  ,
  sendMessage ,
  selectedUser,
  users ,
 getUsers ,
  setSelectedUser ,
   unseenMessage , 
   setUnseenMessage
  }
  return(
    
      <ChatContext.Provider value={value}>
{children}
      </ChatContext.Provider>
  )
}

