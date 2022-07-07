import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
export default function Card({card, onCardClick, onCardLike, onCardDeleteClick}) {
    const {owner, link, name, likes } = card;
    const currentUser = React.useContext(CurrentUserContext);
  /* const {
    card: { link, name, likes }
  } = props; */
  const isOwn = owner._id === currentUser._id;
  const cardDeleteButtonClassName = `places__delete ${isOwn && 'places__delete_not-visible'}`;

  const isLiked = likes.some((i) => i._id === currentUser._id);
  const cardLikeButtonClassName = `places__like ${
    isLiked && 'places__like_active'}`;

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDeleteClick(card);
  }
  return(
    <div className="places__card">
        <img 
        src={link}
        alt={name} 
        className="places__image" 
        onClick={handleClick}
        />
        <h2 className="places__title">{name} </h2>
        <div className="places__like-container">
            <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
            <p className="places__like-number">{likes.length}</p>
        </div>
        {/* <!-- <button type="button" className="places__like"></button> --> */}
        <button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteClick}></button>
    </div>
  );
}