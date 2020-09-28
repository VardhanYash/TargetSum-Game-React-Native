import React, { Component } from 'react'
import {View, Text, StyleSheet, Button} from 'react-native'
import PropTypes from 'prop-types'
import RandomNumber from './RandomNumber'
import shuffle from 'lodash.shuffle'

class Game extends Component {
      static propTypes = {
            randomNumberCount: PropTypes.number.isRequired,
            initialSeconds: PropTypes.number.isRequired,
            onPlayAgain: PropTypes.func.isRequired,
      }

      state = {
            selectedIds: [],
            remainingSeconds: this.props.initialSeconds,
      }

      gameStatus = 'PLAYING';
      randomNumbers = Array
                        .from({length: this.props.randomNumberCount})
                        .map(() => 1 + Math.floor(10 * Math.random()));
      target = this.randomNumbers
                  .slice(0, this.props.randomNumberCount - 2)
                  .reduce((acc, curr) => acc + curr, 0);
      
      shuffledRandomNumbers = shuffle(this.randomNumbers);

      isNumberSelected = (numberIndex) => {
            return this.state.selectedIds.indexOf(numberIndex) >=0;
      }

      componentDidMount() {
            this.intervalId = setInterval(() => {
                  this.setState((prevState) => { 
                        return {
                              remainingSeconds: prevState.remainingSeconds - 1
                        }
                  }, () => {
                        if (this.state.remainingSeconds === 0) {
                              clearInterval(this.intervalId);
                        }
                  });
            }, 1000);
      }
      
      componentWillUnmount() {
            clearInterval(this.intervalId);
      }
      

      selectNumber = (numberIndex) => {
            this.setState((prevState) => ({
                  selectedIds: [...prevState.selectedIds, numberIndex],
            }));
      };

      UNSAFE_componentWillUpdate(nextProps, nextState) {
            if (nextState.selectedIds !== this.state.selectedIds || nextState.remainingSeconds ===0) {
                  this.gameStatus = this.calcGameStatus(nextState);
                  if(this.gameStatus !== 'PLAYING') {
                        clearInterval(this.intervalId)
                  }
            }
      }

      // Game status: PLAYING, WON, LOST
      calcGameStatus =(nextState) => {
            const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
                  return acc + this.shuffledRandomNumbers[curr];
            }, 0);
            //console.warn(sumSelected)

            if(nextState.remainingSeconds === 0) {
                  return 'LOST'
            }

            if(sumSelected < this.target) {
                  return 'PLAYING'
            }

            if (sumSelected === this.target) {
                  return 'WON'
            }

            if(sumSelected > this.target) {
                  return 'LOST'
            }
      }

      
      render() {
            const gameStatus = this.gameStatus;
            return (
                  <View style={styles.container}>
                        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>{this.target}</Text>
                        <View style={styles.randomContainer}>
                              {this.shuffledRandomNumbers.map((randomNumber, index) => 
                              <RandomNumber 
                              key={index} 
                              id={index}
                              number={randomNumber} 
                              isDisabled={this.isNumberSelected(index) || gameStatus !== 'PLAYING'}
                              onPress={this.selectNumber}
                              /> 
                              
                              )}    
                        </View>
                        <Text style={styles.timer}>{this.state.remainingSeconds}</Text>
                        {this.gameStatus !== 'PLAYING' && (
                              <Button style={styles.button} title="Play Again" onPress={this.props.onPlayAgain}/>        
                        )}
                        
                        
                  </View>
            );
      }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex : 1,
    paddingTop: 30.
  },

  target: {
        fontSize: 40,
        backgroundColor: '#aaa',
        margin: 50,
        textAlign: 'center',
  },

  randomContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: "wrap",
        justifyContent: "space-around"
  },

  STATUS_PLAYING : {
        backgroundColor: '#bbb'
  },

  STATUS_WON : {
      backgroundColor: 'green'
  },

  STATUS_LOST : {
      backgroundColor: 'red'
  },

  timer: {
        fontSize: 30,
        textAlign: "center",
        backgroundColor: 'red',
        color: 'white',
        width: 50,
        alignSelf: "center",
        marginBottom: 220,
        borderRadius: 100
  },

  button: {
        height: 100
  }
})

export default Game;