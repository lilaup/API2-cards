//Example fetch using deck of cards

let deckId = '',
  countP1 = 0,
  countP2 = 0;

//get deck
fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        // console.log(data)
        deckId = data.deck_id
        
      })
      .catch(err => {
          console.log(`error ${err}`)
      });



document.querySelector('#dealCards').addEventListener('click', drawTwo)

function drawTwo(){
  const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`;
  if(! localStorage.getItem('p1TotalScore')){
    localStorage.setItem('p1TotalScore', 0)
  };
  if(! localStorage.getItem('p2TotalScore')){
    localStorage.setItem('p2TotalScore', 0)
  };


  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        if( data.remaining > 0 ){
            document.querySelector('#remaining').innerText = data.remaining;
            document.querySelector('#player1').src = data.cards[0].image;
            document.querySelector('#player2').src = data.cards[1].image;
            let valueP1 = getValue(data.cards[0].value);
            let valueP2 = getValue(data.cards[1].value);
            let cardP1 = data.cards[0].code;
            let cardP2 = data.cards[1].code;
            
            if( data.remaining === 2 && cardP1 === cardP2){
              document.querySelector('#remaining').innerText = `${data.remaining} still but they are the same card. End of game!`;
              document.querySelector('#result').innerText = declareWinner(countP1, countP2);
            }
            else{
              document.querySelector('#result').innerText = doBattle(valueP1, valueP2, cardP1, cardP2);
            }
        }else{
          //update remaining, declare winner and diplay local score for session
          // console.log(countP1, countP2);
          document.querySelector('#remaining').innerText = data.remaining;
          document.querySelector('#result').innerText = declareWinner(countP1, countP2);
          // if( countP1 > countP2 ){
          //   document.querySelector('#sessionResultP1').innerHTML = giveScoreLocallyP1()
          // }
          // else if( countP1 < countP2 ){
          //   document.querySelector('#sessionResultP2').innerHTML = giveScoreLocallyP2()
          // }
        }
      })
      .catch(err => {
          document.querySelector('#remaining').innerText = data.remaining;
          
      });
}

function getValue(card){
  if( card === 'ACE') return 14;
  else if(card === 'KING'){return 13}
  else if(card === 'QUEEN'){return 12}
  else if(card === 'JACK'){return 11}
  else{ return Number(card) }
}

function doBattle(value1,value2, card1, card2){
    if(value1 > value2){
      countP1++;
      document.querySelector('#countP1').innerText = countP1;
      return 'player1 wins'
    } 
    else if(value2 > value1){ 
      countP2++;
      document.querySelector('#countP2').innerText = countP2;
      return 'player2 wins' 
    }
    else{ 
      //return to deck
      fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/return/?cards=${card1},${card2}`);
      fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/shuffle/?remaining=true`);
      return 'even..cards get returned to deck'
     }
}

function declareWinner(count1,count2){
  if( count1 > count2 ) return 'player 1 wins!'
  else if( count2 > count1) return 'player 2 wins!'
  else{ return 'even!!' }
}

// function giveScoreLocallyP1(){
//    let p1TotalScoreVal = Number(localStorage.getItem('p1TotalScore'));
//    p1TotalScoreVal += 1;
//    localStorage.setItem('p1TotalScore', p1TotalScoreVal);
//    return p1TotalScoreVal;
// }
  
// function giveScoreLocallyP2(){
//   let p2TotalScoreVal = Number(localStorage.getItem('p2TotalScore'));
//   p2TotalScoreVal += 1;
//   localStorage.setItem('p2TotalScore', p2TotalScoreVal);
//   return p2TotalScoreVal;
// }
  




//deck
//draw one card for each player
//compare them
//winner get2 1 point
//if even, then cards return to the deck and deck gets shuffled
//play until remaining cards is zero



