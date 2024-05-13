import React, { useEffect, useRef, useState } from 'react'
import '../ChatRoom.css'
import EmojiPicker from 'emoji-picker-react'
import profile from '../assets/profile.png';

const ChatRoom = () => {

const [open,setOpen] = useState(false);
const [text, setText] = useState("");

const endRef = useRef(null);

useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth"});
},[]);

const handleEmoji = e =>{
    setText((prev) => prev+ e.emoji)
    setOpen(false)
};


  return (
    <div className='container-chat'>
        <div className="top">

        </div>
        <div className="center">
    <div className="message">
        <img src={profile} alt="" />
        <div className="texts">
            <p>Lorem ipsum dolor sit amet.</p>
            <span>1 min ago</span>
        </div>
        
    </div>
    <div className="message own">
      
        <div className="texts">
            <p>Lorem ipsum dolor sit amet.</p>
        <span>1 min ago</span>
        </div>
        
    </div>
    <div className="message">
    <img src={profile} alt="" />
        <div className="texts">
            <img src={profile} alt="" />
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente asperiores labore quaerat explicabo animi sit libero dolorem omnis dicta odio, dignissimos ea nostrum? Nihil, totam quo maiores hic veniam nisi.</p>
        <span>1 min ago</span>
        </div>
        <div ref={endRef}></div>
    </div>
        </div>
        <div className="bottom">
            <div className="icons">
            <box-icon name='image' ></box-icon>
            </div>
            <input type="text" placeholder='Scrie un mesaj...' 
            value={text}
            onChange={(e) => setText(e.target.value)}/>

            <div className="emoji" style={{zIndex: '100'}}>
            <box-icon name='happy' onClick={() => setOpen((prev) => !prev)}></box-icon>
            <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji}/></div>
            </div>
            <button className='sendButton'>Trimite</button>
        </div>
    </div>
  )
}
export default ChatRoom;