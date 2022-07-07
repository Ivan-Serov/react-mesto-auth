class Api {
  constructor(url, token) {
    this._url = url;
    this._authorizationToken = token;
    this._headers ={authorization:this._authorizationToken, 'Content-Type': 'application/json'};
  }
  getUserInfo() {
    return fetch(this._url +'/users/me', {
      method: 'GET',
      headers: {
        authorization: this._authorizationToken
      }})
    .then(this.checkResult);
  }
  getInitialCards() {
    return fetch(this._url +'/cards', {
      headers: {
        authorization: this._authorizationToken
      }})
    .then(this.checkResult);
  }
  editProfile(data){
    return fetch(this._url +'/users/me', {
        method: 'PATCH',
        headers: this._headers,
        body: JSON.stringify(data)
      })
    .then(this.checkResult);
  }
  addPlace(data){
    return fetch(this._url +'/cards', {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(data)
    })
    .then(this.checkResult);
  }
  deletePost(cardId) {
    return fetch(this._url + '/cards/' + cardId, {
      method: 'DELETE',
      headers: this._headers,
    })
    .then(this.checkResult);
  }
  addLike(cardId){
    return fetch(this._url + '/cards/likes/' + cardId, {
      method: 'PUT',
      headers: this._headers,
    })
    .then(this.checkResult);
  }
  deleteLike(cardId){
    return fetch(this._url + '/cards/likes/' + cardId, {
      method: 'DELETE',
      headers: this._headers,
    })
    .then(this.checkResult);
  }
  addAvatar(avatar){
    return fetch(this._url +'/users/me/avatar', {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(avatar)
    })
    .then(this.checkResult);
  }
  checkResult = res => {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }
}
export const api = new Api('https://nomoreparties.co/v1/cohort-28', 'd0022a9e-a6be-4d9a-ab6e-3949875c7c34');