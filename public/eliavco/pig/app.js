function pigGame(){

/*

GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

    var scores, roundScore, activePlayer, gamePlaying;

    function init(){
        scores       = [0, 0];
        roundScore   = 0;
        activePlayer = 0;
        gamePlaying  = true;

        playerOneName = prompt("Player One Name:");
        playerTwoName = prompt("Player Two Name:");

        if (playerOneName && !(playerOneName == " ")){
            document.querySelector('#name-0').textContent = playerOneName;
        } else {
            document.querySelector('#name-0').textContent = 'Player 1';
        }

        if (playerTwoName && !(playerTwoName == " ")){
            document.querySelector('#name-1').textContent = playerTwoName;
        } else {
            document.querySelector('#name-1').textContent = 'Player 2';
        }

        document.querySelector('.dice').style.display = 'none';
        document.querySelector('.btn-roll').style.display = 'block';
        document.querySelector('.btn-hold').style.display = 'block';

        document.getElementById('current-0').textContent = '0';
        document.getElementById('current-1').textContent = '0';
        document.getElementById('score-0').textContent = '0';
        document.getElementById('score-1').textContent = '0';

        document.querySelector('.player-0-panel').classList.remove('winner-panel');
        document.querySelector('.player-1-panel').classList.remove('winner-panel');
        document.querySelector('.player-0-panel').classList.remove('loser-panel');
        document.querySelector('.player-1-panel').classList.remove('loser-panel');
        document.querySelector('.player-0-panel').classList.remove('active');
        document.querySelector('.player-1-panel').classList.remove('active');
        document.querySelector('.main').classList.remove('winner');
        document.querySelector('.player-0-panel').classList.add('active');

}
    init()

    function nextPlayer(){
        activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
        roundScore = 0;
        
        document.querySelector('#current-0').textContent = 0;
        document.querySelector('#current-1').textContent = 0;
        
        document.querySelector('.player-0-panel').classList.toggle('active');
        document.querySelector('.player-1-panel').classList.toggle('active');
        
        document.querySelector('.dice').style.display = 'none';
    }
    
    document.querySelector('.btn-roll').addEventListener('click', function(){
        if (gamePlaying){
            // Generate a random number between 1 and six
            var dice = Math.floor(Math.random() * 6) + 1;

            // Dispaly the results
            var diceDOM = document.querySelector('.dice');
            diceDOM.style.display = 'block';
            diceDOM.src = 'dice-' + dice + '.png';

            // Update the DOM
            if (dice != 1){
                roundScore += dice;
                document.querySelector('#current-' + activePlayer).textContent = roundScore;
            } else {
                nextPlayer();
            }
        }
    });

    document.querySelector('.btn-hold').addEventListener('click', function(){
        if (gamePlaying){
            scores[activePlayer] += roundScore;
            
            document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
            
            if (scores[activePlayer] >= 30){
                document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner-panel');
                document.querySelector('.player-' + (activePlayer === 0 ? 1 : 0) + '-panel').classList.add('loser-panel');
                document.querySelector('.main').classList.add('winner');
                document.querySelector('.dice').style.display = 'none';
                document.querySelector('.btn-roll').style.display = 'none';
                document.querySelector('.btn-hold').style.display = 'none';
                gamePlaying = false;
                document.querySelector('body').addEventListener('dblclick',init);
            } else {
                nextPlayer();
            }
        }
    })
    
    document.querySelector('.btn-new').addEventListener('click', init);

};
pigGame()