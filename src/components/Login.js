import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../components/Header';
import * as auth from '../components/auth';
import InfoTooltip from '../components/InfoTooltip';


export default function Login({ onLogin }) {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  ///////////
  const [infoPopup, setInfoPopup] = useState({
    isOpenLoginPopup: false,
    errorLogin: false,
    message: ''
  });
  ///////////

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.email || !values.password) {
      return;
    }
    auth
      .authorize(values.email, values.password)
      .then((res) => {
        if (res.token) {
          setValues({
            email: "",
            password: "",
          })
          localStorage.setItem('jwt', res.token);
          onLogin(values.email);  // обновляем стейт внутри App.js
          navigate("/"); // и переадресуем пользователя! 
        }
        ////////////
        else {
          setInfoPopup({
            message: 'Что-то пошло не так!',
            errorLogin: false,
            isOpenLoginPopup: false
          });
          openPopup();
        }
        /////////////
      })
      .catch((err) => console.log(err));
  };
////////////////////////////
  const openPopup = () => {
    setInfoPopup((prevState) => ({
      ...prevState,
      isOpenLoginPopup: true,
    }));
  }

  const closePopup = () => {
    setInfoPopup((prevState) => ({
      ...prevState,
      isOpenLoginPopup: false,
    }));
    if (infoPopup.errorLogin) navigate("/sign-up");
  };
/////////////////////////////////

  return (
    <div className="login">
        <Header nav={'/sign-up'} navStatus={'Регистрация'} emailUser={''}/>
        <p className="login__welcome">
          Вход
        </p>
        <form onSubmit={handleSubmit} className="login__form">
          <input id="email" name="email" type="email" placeholder="Email" className="login__input"
                 value={values.username} onChange={handleChange} />
          <input required id="password" name="password" type="password" placeholder="Пароль" className="login__input"
                 value={values.password} onChange={handleChange} />
          <button type="submit" className="login__link" onSubmit={handleSubmit}>Войти</button>
          {(infoPopup.isOpenLoginPopup) && <InfoTooltip  errorLogin={infoPopup.errorLogin} onClosePopup={closePopup}/> }
        </form>
      </div>
  )
  ////<div className="login__button-container">
  //<button type="submit" className="login__link" onSubmit={handleSubmit}>Войти</button>
  //</div>
  ///
  //
}
