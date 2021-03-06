import React from 'react';
import * as $ from 'axios';

class Game extends React.Component {
  state = {
    gameStart: false,
    isPlayerTurn : false,
    playerInput : [],
    gameInput: [],
    score: 0,
    difficulty :[
      {medium: false},
      {hard: false}
    ]
  }

  handleClick = (event) => {
    event.preventDefault();
    this.playSound(event)
    let playerInputLocal = this.state.playerInput.concat();
    if(!this.state.isPlayerTurn){
    } else if(this.state.isPlayerTurn){
        playerInputLocal.push(event.target.id);
        if(playerInputLocal.length === this.state.gameInput.length){
          if((playerInputLocal.toString()) == (this.state.gameInput.toString())){
            this.setState({score: this.state.score +1})
              if(this.state.score > 9) this.setState({difficulty: {medium: true}});
              if(this.state.score > 19) this.setState({difficulty: {hard: true}})
              
            this.gameTurn();
          } else {
            let url = '/api/scores';
            let data = {'score': this.state.score,
            'gameId': '1'}
            let config = {
              headers: {
                authorization: sessionStorage.getItem('authorization')
              }
            }
            $.post(url, data, config)
              .then((response) =>console.log(response.json))
            .catch((error) => {
              console.log(error.message)
            })
            this.gameRefresh();
          }
        }
        this.setState({
          playerInput: [...this.state.playerInput, event.target.id]
        })
        console.log(`Player Input: ${this.state.playerInput}`);
      }
  }

  startGame = (event) => {
    event.preventDefault();
    this.gameTurn();
  }

  computerInputChoices = number => {
    this.setState({
      gameInput: [...this.state.gameInput, Math.floor((Math.random() * number) + 1)]
    })
  }

  newButtonPress = () => {
    if(this.state.difficulty.hard){
      this.computerInputChoices(6);
    } else if
    (this.state.difficulty.medium){
      this.computerInputChoices(5);
    } else {
      this.computerInputChoices(4);
    }
  }

  resolveTimeOut = (index, resolve) => {
    if(index === this.state.gameInput.length-1){
      console.log("you did a thing")
      resolve();
    }
  }

  computerPressButtons = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.state.gameInput.forEach((button, index) => {
          setTimeout(() => {
            document.getElementById(button).click();
            this.resolveTimeOut(index, resolve);
          }, 800+(index*800))
        })
      }, 50)
    })
  }

  gameRefresh = () => {
    this.setState({
      gameStart: false,
      playerInput: [],
      gameInput: [],
      score: 0,
      difficulty: {medium: false, hard: false}
    })
  }
  
  gameTurn = (event) => {
    this.setState({gameStart: true})
    this.setState({isPlayerTurn: false})
    this.newButtonPress();
    this.computerPressButtons()
    .then(()=>{this.setState({isPlayerTurn: true, playerInput: []})})
  }

  playSound(event) {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(`${event.target.value}`, audioContext.currentTime)
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  }

  render () {
    const gameOn = this.state.gameStart;
    return(
      <div>
        {!gameOn ? (
          <div>
            <h2>Would you like to play a game?</h2>
            <button onClick={this.startGame}>Yes</button>
          </div>
        ) : (
          <div className="container"> <h2 className="score">Score: {this.state.score}</h2><div className="buttons">
            <button onClick={this.handleClick} id="1" value="392" className="button red-button"/> 
            <button onClick={this.handleClick} id="2" value="494" className="button blue-button"/>
            <button onClick={this.handleClick} id="3" value="587" className="button green-button"/> 
            <button onClick={this.handleClick} id="4" value="659" className="button violet-button"/>
              {this.state.difficulty.medium ? (
                <div>
                  <button onClick={this.handleClick} id="5" value="" className="button yellow-button" value="740"/>
                </div>
              ) : (
                null
              )
              }
              {this.state.difficulty.hard ? (
                <div>
                  <div>
                    <button onClick={this.handleClick} id="5" value="" className="button yellow-button" value="740"/>
                  </div>
                  <div>
                    <button onClick={this.handleClick} id="6" value="" className="button silver-button" value="784"/>
                  </div>
                </div>
              ) : (
                null
              )
              }
            </div>
          </div>) 
        }
      </div>
    )
  }
}

export default Game;