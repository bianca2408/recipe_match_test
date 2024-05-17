import React, { useEffect, useRef, useState } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { database, auth, storage } from '../firebase.js'; // Importă instanța de bază de date Firebase
import '../ChatRoom.css'
import EmojiPicker from 'emoji-picker-react'
import profile from '../assets/profile.png';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const ChatRoom = ({ groupId }) => {
    
    const user = auth.currentUser;
    const [messages, setMessages] = useState([]);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [userImageUrls, setUserImageUrls] = useState({}); // Stocăm URL-urile imaginilor utilizatorilor
    const endRef = useRef(null);
    const fileInputRef = useRef(null); // Referința către input-ul de fișiere

    useEffect(() => {
        const messagesRef = collection(database, 'grupuri', groupId, 'chats');
        const q = query(messagesRef, orderBy('timestamp'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newMessages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(newMessages);
            scrollToBottom();
        });
        return () => unsubscribe();
    }, [groupId]);

    useEffect(() => {
        const fetchUserImageUrls = async () => {
            const urls = {};
            for (const message of messages) {
                try {
                    const userImageRef = ref(storage, `${message.userId}.png`); // Referința către imaginea utilizatorului
                    const imageUrl = await getDownloadURL(userImageRef); // Obținem URL-ul imaginii
                    urls[message.userId] = imageUrl;
                } catch (error) {
                    console.error('Eroare la obținerea URL-ului imaginii utilizatorului:', error);
                    urls[message.userId] = null;
                }
            }
            setUserImageUrls(urls); // Actualizăm starea cu URL-urile imaginilor utilizatorilor
        };

        fetchUserImageUrls();
    }, [messages]); // Trebuie să reîncărcați URL-urile imaginilor de fiecare dată când mesajele se schimbă

    const scrollToBottom = () => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (text.trim() === '') return;
        try {
            // Adaugă mesajul în colecția 'chats' pentru grupul selectat
            await addDoc(collection(database, 'grupuri', groupId, 'chats'), {
                text: text,
                timestamp: serverTimestamp(),
                userId: user.uid,
            });
            setText('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click(); // Simulăm click-ul pe input-ul de fișiere
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const storageRef = ref(storage, `images/${user.uid}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    // You can handle progress here if needed
                }, 
                (error) => {
                    console.error('Upload failed:', error);
                }, 
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    // Add the image URL to Firestore
                    await addDoc(collection(database, 'grupuri', groupId, 'chats'), {
                        imageUrl: downloadURL,
                        timestamp: serverTimestamp(),
                        userId: user.uid,
                    });
                }
            );
        }
    };
    
    const formatDate = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            const date = new Date(timestamp.seconds * 1000); // Convertim timestamp-ul în milisecunde
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', seconds:'numeric' };
            return date.toLocaleDateString('ro-RO', options);
        } else {
            return ''; // sau o valoare implicită pentru cazurile în care timestamp este null sau nu are proprietatea seconds
        }
    };
    
    return (
        <div className='container-chat'>
            <div className='top'></div>
            <div className='center'>
                {messages.map((message) => (
                    <div className={`message ${message.userId === user.uid ? 'own' : ''}`} key={message.id}>
                        <img src={userImageUrls[message.userId] || profile} alt="Avatar" /> {/* Folosim profilul implicit în cazul în care nu avem un URL al imaginii */}
                        <div className='texts'>
                            {message.text && <p>{message.text}</p>}
                            {message.imageUrl && <img src={message.imageUrl} alt="Uploaded" />}
                            <span>{formatDate(message.timestamp)}</span>
                        </div>
                    </div>
                ))}
                <div ref={endRef}></div>
            </div>
            <div className='bottom'>
                <div className="icons">
                    <box-icon name='image' onClick={handleImageClick}></box-icon>
                    <input
                        type='file'
                        accept='image/*'
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>
                <input
                    type='text'
                    placeholder='Scrie un mesaj...'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <div className="emoji" style={{zIndex: '100'}}>
                    <box-icon name='happy' onClick={() => setOpen((prev) => !prev)}></box-icon>
                    <div className="picker">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
                    </div>
                </div>
                <button className='sendButton' onClick={handleSubmit}>
                    Trimite
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;
