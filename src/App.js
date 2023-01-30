import React from 'react';
import './App.css';

function App() {
  return (
    <div>
      <Title />
      <ListEntryBox />
      <ResetButton />
      <InstructionsAndInfo />
    </div>
  );
}

class Title extends React.Component{
  render(){
    return (
      <div>
        <div className="mainHeader">
          <h2 className="headerLogo">List Ranker</h2>
        </div>
        <div className="mainTitle">
          <center>
            <h1>List Ranking Tool</h1>
          </center>
        </div>
      </div>
    );
  }

}

class ListEntryBox extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      entryButtonClicked: false,
    };
  }
  render(){
    if(!this.state.entryButtonClicked){
      return (
        <div>
          <center>
            <textarea id="entryBox"></textarea>
          </center>
          <div className="textControlButtonPanel">
            <center>
              <button className="entryButton" onClick={() => this.handleClick()} >Enter</button>
            </center>
          </div>
        </div>
      );
    } else if(this.getItemArray() === null) {
      return (
        <div>
          <center>
            <textarea id="entryBox"></textarea>
          </center>
          <div className="textControlButtonPanel">
            <center>
              <button className="entryButton" onClick={() => this.handleClick()} >Enter</button>
            </center>
          </div>
          <center>
            <h2>Please enter a list to be ranked.</h2>
          </center>
        </div>
      );
    } else {
      return (
        <div>
          <center>
            <textarea id="entryBox"></textarea>
          </center>
          <div className="textControlButtonPanel">
            <center>
              <button className="entryButton" onClick={() => this.handleClick()} >Enter</button>
            </center>
          </div>
          <center>
            <div className="comparisonField">
              <center>
                <ChoiceButtons items={this.getItemArray()}/>
              </center>
            </div>
          </center>
        </div>
      );
    }
  }
  handleClick(){
    if(this.getItemArray() !== null && this.getItemArray().length !== 0){
      document.getElementById("entryBox").readOnly = true;
    }
    this.setState({entryButtonClicked: true});
  }
  getItemArray(){
    var enteredList = document.getElementById("entryBox").value;
    while(enteredList.charAt(enteredList.length - 1) === "\n"){
      enteredList = enteredList.substring(0, enteredList.length - 1);
    }
    var characterCounter = 0;
    var itemArray = [];
    if(enteredList && this.hasEnoughReturns(enteredList) && !enteredList.includes("\n\n")){
      for(let i = 0; i < enteredList.length; i++) {
        if(i === enteredList.length - 1){
          itemArray.push(enteredList.substring((i + 1)-(characterCounter + 1)));
        } else if(enteredList.charAt(i) !== "\n"){
          characterCounter++;
        } else {
          itemArray.push(enteredList.substring(i-characterCounter, i));
          characterCounter = 0;
        }
      }
      return itemArray;
    } else {
      return null;
    }
  }
  hasEnoughReturns(list){
    var count = 0;
    for(let i = 0; i < list.length; i++){
      if(list.charAt(i) === "\n"){
        count++;
      }
    }
    if(count < 1){
      return false;
    } else {
      return true;
    }
  }
}

class ChoiceButtons extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      indexCounter: 0,
      firstItem: this.props.items[0],
      secondItem: this.props.items[1],
      orderedArray: [],
      rankingComplete: false,
    };
  }
  render(){
    if(this.state.rankingComplete){
      return(
        <center>
          <h2 className="rankedList">{this.getRankedListString(this.state.orderedArray)}</h2>
        </center>
      );
    } else {
      return (
        <div className="choiceButtonPanel">
          <button className="choiceButton1" onClick={() => this.handleClickA()}>{this.state.firstItem}</button>
          <button className="choiceButton2" onClick={() => this.handleClickB()}>{this.state.secondItem}</button>
        </div>
      );
    }
  }
  handleClickA(){
    if(this.state.orderedArray.length === 0){
      this.setState(
        {orderedArray: [...this.state.orderedArray, this.state.firstItem, this.state.secondItem]}, 
        () => {
          if(this.state.orderedArray.length === this.props.items.length){
            this.setState({rankingComplete: true});
          } else {
            this.setState({secondItem: this.props.items[this.state.orderedArray.length]});
          }
        }
      );
    } else {
      if(this.state.orderedArray.includes(this.state.firstItem)){
        if(this.state.indexCounter === this.state.orderedArray.length - 1){
          this.setState(
            {orderedArray: [...this.state.orderedArray, this.state.secondItem], indexCounter: 0}, 
            () => {
              if(this.state.orderedArray.length === this.props.items.length){
                this.setState({rankingComplete: true});
              } else {
                this.setState(
                  {firstItem: this.state.orderedArray[this.state.indexCounter]},
                  () => {
                    this.setState({secondItem: this.props.items[this.state.orderedArray.length]});
                  }
                );
              }
            }
          );
        } else {
          this.setState(
            {indexCounter: this.state.indexCounter + 1},
            () => {
              if(this.state.orderedArray.length === this.props.items.length){
                this.setState({rankingComplete: true});
              } else {
                this.setState({firstItem: this.state.orderedArray[this.state.indexCounter]});
              }
            }
          );
        }
      } else {
        this.setState(
          {orderedArray: [ ...this.state.orderedArray.slice(0, this.state.orderedArray.indexOf(this.state.secondItem)), 
          this.state.firstItem, ...this.state.orderedArray.slice(this.state.orderedArray.indexOf(this.state.secondItem))], indexCounter: 0},
          () => {
            if(this.state.orderedArray.length === this.props.items.length){
              this.setState({rankingComplete: true});
            } else {
              this.setState({firstItem: this.state.orderedArray[this.state.indexCounter], secondItem: this.props.items[this.state.orderedArray.length]});
            }
          }
        );
      }
    }
  } 
  handleClickB(){
    if(this.state.orderedArray.length === 0){
      this.setState(
        {orderedArray: [...this.state.orderedArray, this.state.secondItem, this.state.firstItem]}, 
        () => {
          if(this.state.orderedArray.length === this.props.items.length){
            this.setState({rankingComplete: true});
          } else {
            this.setState({firstItem: this.props.items[this.state.orderedArray.length]});
          }
        }
      );
    } else {
      if(this.state.orderedArray.includes(this.state.secondItem)){
        if(this.state.indexCounter === this.state.orderedArray.length - 1){
          this.setState(
            {orderedArray: [...this.state.orderedArray, this.state.firstItem], indexCounter: 0}, 
            () => {
              if(this.state.orderedArray.length === this.props.items.length){
                this.setState({rankingComplete: true});
              } else {
                this.setState(
                  {secondItem: this.state.orderedArray[this.state.indexCounter]},
                  () => {
                    this.setState({firstItem: this.props.items[this.state.orderedArray.length]});
                  }
                );
              }
            }
          );
        } else {
          this.setState(
            {indexCounter: this.state.indexCounter + 1},
            () => {
              if(this.state.orderedArray.length === this.props.items.length){
                this.setState({rankingComplete: true});
              } else {
                this.setState({secondItem: this.state.orderedArray[this.state.indexCounter]});
              }
            }
          );
        }
      } else {
        this.setState(
          {orderedArray: [ ...this.state.orderedArray.slice(0, this.state.orderedArray.indexOf(this.state.firstItem)), 
          this.state.secondItem, ...this.state.orderedArray.slice(this.state.orderedArray.indexOf(this.state.firstItem))], indexCounter: 0},
          () => {
            if(this.state.orderedArray.length === this.props.items.length){
              this.setState({rankingComplete: true});
            } else {
              this.setState({firstItem: this.props.items[this.state.orderedArray.length], secondItem: this.state.orderedArray[this.state.indexCounter]});
            }
          }
        );
      }
    }
  } 
  getRankedListString(list){
    var rankedListString = "Your Ranked List:\n\n";
    for(let i = 0; i < list.length; i++){
      if(i === 0){
        rankedListString += (i + 1) + ". " + list[i];
      } else {
        rankedListString += "\n" + (i + 1) + ". " + list[i];
      }
    }
    return rankedListString;
  }
}

class ResetButton extends React.Component{
  render(){
    return(
      <center>
        <button className="resetButton" onClick={() => window.location.reload()} >Reset</button>
      </center>
    );
  }
}

class InstructionsAndInfo extends React.Component{
  render(){
    return(
      <div className="instructions">
        <h1>Instructions</h1>
        <p>Do you have a long list of items which you need to rank? Say no more! This tool makes the ranking process simpler by presenting two items in your list at a time for you to choose between. 
          To begin, enter your list of items in the text field, <strong>with each item on a separate line</strong>, and then click Enter. You will then be presented with two buttons, each with an item 
          from your list. Simply select which out of the two items you would rank higher, and keep doing this until your ranked list appears! If you wish to restart, click Reset, but please note that once 
          you do, none your progress will be saved here.
        </p>
        <h1>About</h1>
        <p>This list ranking tool was made by Vishnu Sreekanth using React JSX and CSS.</p>
      </div>
    )
  }
}

export default App;
