import React, { Component } from 'react'
import {View, Text, StyleSheet} from 'react-native'
import Game from './components/Game'
class App extends Component {
  state = {
    gameId: 1,
  };

  resetGame = () => {
    this.setState((prevState) => { 
      return { 
        gameId: prevState.gameId + 1
     }})
    
    
  }
  render() {
    return (
      <Game key={this.state.gameId} onPlayAgain={this.resetGame} randomNumberCount={6} initialSeconds={10}/>
    );
  }
}

export default App;