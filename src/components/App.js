import React, { useEffect, useState } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
////////////////
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPopup from "./AddPopup";
import DeletePopup from "./DeletePopup";
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import {api}  from '../utils/Api'
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
///////1/////////
import Register from '../components/Register';
import Login from '../components/Login';
import RequireAuth from './ProtectedRoute';
import * as auth from '../utils/auth';
import InfoTooltip from '../components/InfoTooltip';

function App() {
  
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  const [isAddCardPopupOpen, setisAddCardPopupOpen] = React.useState(false);
  function handleAddCardClick() {
    setisAddCardPopupOpen(true);
  }
  const [isAvatarProfilePopupOpen, setisAvatarProfilePopupOpen] = React.useState(false);
  function handleAvatarProfileClick() {
    setisAvatarProfilePopupOpen(true);
  }
  const [selectedCard, setSelectedCard] = React.useState(null);
  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpenen(true);
  }
  const [isImagePopupOpenen, setIsImagePopupOpenen] = React.useState(false);
  ////////////////////////
  const [isSucceed, setIsSucceed] = React.useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  function handleInfoTooltipPopupOpen() {
    setIsInfoTooltipOpen(!isInfoTooltipOpen);
  }
  
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setisAddCardPopupOpen(false);
    setisAvatarProfilePopupOpen(false);
    setSelectedCard(null);
    setIsDeletePopupOpenen(false);
    setIsImagePopupOpenen(false);
    setIsInfoTooltipOpen(false);
  }
  ////////////////////////////////////////////
  const [currentUser, setCurrentUser] = React.useState({});
  React.useEffect(() => {
    if (loggedIn) {
      api
        .getUserInfo()
        .then((data) => {
          setCurrentUser(data);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);
  
  const [cards, setCards] = React.useState([]);
  React.useEffect(() => {
    if (loggedIn) {
      api
        .getInitialCards()
        .then((data) => {
          setCards(data);
        })
        .catch((err) => console.log(err));
    } 
  }, [loggedIn]);
  ///////////////////////////////////////////
  function handleCardLike(card){
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    
    if (isLiked) {
      api
        .deleteLike(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
        })
        .catch((err) => {
          console.log(err);

          return [];
        });
    } else {
      api
        .addLike(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
        })
        .catch((err) => {
          console.log(err);

          return [];
        });
    }
  } 
////////////////
  function handleEditUser(data) {
    api
      .editProfile(data)
      .then((data) => {
        setCurrentUser(data);
        //console.log(data);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(data) {
    api
      .addAvatar(data)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }
  function handleAddPlace(data) {
    api
      .addPlace(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }
  const [isDeletePopupOpenen, setIsDeletePopupOpenen] =React.useState(false);
  function handleCardDeleteClick(card) {
    setIsDeletePopupOpenen(true);
    setSelectedCard(card);
  }
  function handleDeletePlace(card) {
    api
      .deletePost(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }
/////////////1/////////////
  useEffect(() => {
    handleTokenCheck(location.pathname);
  }, []);

  const handleTokenCheck = (path) => {
    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem("jwt");
    // проверяем токен пользователя
      auth.checkToken(jwt).then((res) => {
        if (res) {
          setLoggedIn(true);
          setUserEmail(res.data.email);
          navigate(path);
        }
      })
      .catch((err) => console.log(err));
    }
  };

  const handleLogin = (email, password) => {
    auth
    .authorize(email, password)
      .then((res) => {
        if (res.token) {
          setLoggedIn(true);
          setUserEmail(email);
          localStorage.setItem('jwt', res.token);
          navigate("/"); // и переадресуем пользователя! 
        }
      })
      .catch((err) => {
        console.log(err);
        setIsSucceed(false);
        handleInfoTooltipPopupOpen();
      });
  };

  const handleLogout= (evt) => {
    evt.preventDefault();
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    setUserEmail('');
    navigate('/sign-in')
  }

  const handleRegister = (password, email) => {
    auth.register(email, password)
      .then((res) => {
        if (res) {
          setIsSucceed(true);
          handleInfoTooltipPopupOpen();
          navigate("/sign-in");
        }
      })
      .catch((err) => {
        console.log(`Ошибка регистрации ${err}`);
        setIsSucceed(false);
        handleInfoTooltipPopupOpen();
      });
  }; 

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
          <Routes>
            <>
              <Route
                path="/"
                element={
                  <>
                    <RequireAuth loggedIn={loggedIn}>
                      <div>
                        <Header 
                        nav={'/sign-in'}
                        navStatus={'Выйти'} 
                        emailUser={userEmail} 
                        onLogout={handleLogout} 
                        />
                        <Main 
                          onEditProfile={handleEditProfileClick}
                          onAddPlace={handleAddCardClick}
                          onEditAvatar={handleAvatarProfileClick}
                          onCardClick={handleCardClick}
                          onCardLike={handleCardLike}
                          onCardDeleteClick={handleCardDeleteClick}
                          cards={cards}
                        />  
                        <Footer />
                      </div>
                    </RequireAuth>
                  </>
                }
              />  
              <Route path="/sign-up" element={<Register onRegister={handleRegister}/> } />
              <Route path="/sign-in" element={<Login onLogin={handleLogin}/>} />
            </> 
          </Routes>
          <InfoTooltip
            isOpen={isInfoTooltipOpen}
            onClose={closeAllPopups}
            isSucceed={isSucceed}
          />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onEditUser={handleEditUser}
          />
          <AddPopup
            isOpen={isAddCardPopupOpen}
            onClose={closeAllPopups}
            onAddPost={handleAddPlace}
          />
          <EditAvatarPopup
            isOpen={isAvatarProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <ImagePopup 
            isOpen={isImagePopupOpenen}
            card={selectedCard}
            onClose={closeAllPopups}
          />
          <DeletePopup
            isOpen={isDeletePopupOpenen}
            onClose={closeAllPopups}
            card={selectedCard}
            onDeletePlace={handleDeletePlace}
          />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
