import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { database, storage } from '../firebase.js';
import '../Stilizare/ParticipantsList.css';
import { getDownloadURL, ref } from 'firebase/storage';
import profile from '../assets/profile.png'

const ParticipantsList = ({ groupId }) => {
  const [participants, setParticipants] = useState([]);
  const [userImageUrls, setUserImageUrls] = useState({}); // Stocăm URL-urile imaginilor utilizatorilor
      
  useEffect(() => {
    const fetchParticipants = async () => {
      if (groupId) {
        const groupDocRef = doc(database, 'grupuri', groupId);
        const groupDoc = await getDoc(groupDocRef);

        if (groupDoc.exists()) {
          const groupData = groupDoc.data();
          const participantsData = [];

          for (const participantId of groupData.participants) {
            const userDocRef = doc(database, 'utilizatori', participantId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const userData = userDoc.data();
              participantsData.push({ ...userData, id: participantId }); // Adăugăm datele utilizatorului la lista de participanți, inclusiv ID-ul său
              try {
                const userImageRef = ref(storage, `${participantId}.png`); // Referința către imaginea utilizatorului
                const imageUrl = await getDownloadURL(userImageRef); // Obținem URL-ul imaginii
                setUserImageUrls(prevState => ({
                  ...prevState,
                  [participantId]: imageUrl // Salvăm URL-ul imaginii în starea userImageUrls, asociat cu ID-ul participantului
                }));
              } catch (error) {
                console.error('Eroare la obținerea URL-ului imaginii utilizatorului:', error);
                // Dacă apare o eroare, poți seta un URL implicit sau poți trata eroarea în alt mod
                setUserImageUrls(prevState => ({
                  ...prevState,
                  [participantId]: null // Setați URL-ul ca null dacă există o eroare
                }));
              }
            }
          }

          setParticipants(participantsData); // Actualizăm starea cu lista de participanți
        }
      }
    };

    fetchParticipants();
  }, [groupId]);

  return (
    <div className="participants-list">
      {participants.map((participant, index) => (
        <div key={index} className="participant">
          {console.log(participant)}
          <img
           
            src={userImageUrls[participant.id] || participant.url || profile} // Utilizați URL-ul implicit dacă imaginea nu este disponibilă
            alt={`${participant.nume_utilizator}'s profile`}
            className="participant-photo"
          />
          <span className="participant-name">{participant.nume_utilizator || participant.photoURL ||participant.email}</span>
        </div>
      ))}
    </div>
  );
};

export default ParticipantsList;
