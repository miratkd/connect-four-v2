<template>
    <div class="math-container">
        <div class="math-header-container">
            <button data-test="math-menu-button" class="math-header-button" v-on:click="() => showMenuAlert = true">Menu</button>
            <img  src="@/assets/menuIcon.svg" alt="">
            <button data-test="math-restart-button" class="math-header-button" v-on:click="restartAlertClick()">Restart</button>
        </div>
        <div class="math-mobile-status">
            <PlayerStatus :isMobile="true" player="1" name="player 1" :score="player1Score"/> 
            <PlayerStatus :isMobile="true" player="2" name="player 2" :score="player2Score"/>
        </div>
        <div class="math-body-container">
             <PlayerStatus player="1" name="player 1" :score="player1Score"/>
            <MathBoard :isCpuMatch="isCpuMatch" :playerWin="playerWin" v-if="showBoard" :player="player" :changePlayer="changePlayer"/>
            <div v-else class="math-board-placeholder"></div>
            <PlayerStatus :player="isCpuMatch ? 'cpu' : '2'" :name="isCpuMatch ? 'CPU' : 'player 2'" :score="player2Score"/> 
        </div>
        <div class="math-round-container" v-if="!roundWinner">
            <img class="math-round-icon" data-test="player-1-round-icon" v-show="player == 1" src="@/assets/round-icon.svg" alt="">
            <img class="math-round-icon" data-test="player-2-round-icon" v-show="player == 2" src="@/assets/round-icon-yellow.svg" alt="">
            <div class="math-round-text-container">
               <h3 data-test="math-round-player" class="math-round-text">{{ player == 1 ? 'Jogador 1' : 'Jogador 2' }}</h3>
               <h2 class="math-round-text">{{time}}s</h2> 
            </div>
        </div>
        <div class="math-round-container" v-else>
            <div data-test="math-winner-container" class="math-round-winner">
                <h3 >{{ roundWinner == 1 ? 'Jogador 1' : 'Jogador 2' }}</h3>
                <h1 >Vitoria</h1> 
                <button class="math-header-button" data-test="next-round-button" v-on:click="restartBoard()">Jogar de novo</button>
            </div>
        </div>
        <div class="math-footer-container">
            <div class="math-footer" :style="getFooterBackground()"></div>
        </div>

        <RestartAlert v-if="showRestartAlert" :close="() => showRestartAlert = false" :submit="restartGame"/>
        <MenuAlert v-if="showMenuAlert" :close="() => showMenuAlert = false" :submit="cancelGame"/> 
    </div>
</template>

<script setup lang="ts">
    const route = useRoute()
    let player = ref(1)
    let player1Score = ref(0)
    let player2Score = ref(0)
    let time = ref(50)
    let round = ref(1)
    let showBoard = ref(true)
    let runTimer = ref(true)
    let roundWinner = ref(0)
    let showRestartAlert = ref(false)
    let showMenuAlert = ref(false)
    let isCpuMatch = ref(false)

    function getFooterBackground(): string {
        if(roundWinner.value == 1) return 'background-color: #FD6687'
        else if (roundWinner.value == 2) return 'background-color: #FFCE67'
        else return ''
    }
    function playerWin(player:number): void {
        if (player == 1) player1Score.value++
        else player2Score.value++
        runTimer.value = false
        roundWinner.value = player
    }
    function cancelGame(): void {
        navigateTo('/')
    }
    function restartAlertClick(): void {
        showRestartAlert.value = true
    }
    function restartGame(): void {
        player1Score.value = 0
        player2Score.value = 0
        restartBoard()
    }
    function restartBoard(): void {
        showBoard.value = false
        setTimeout(() => {
            showBoard.value = true
            roundWinner.value = 0
            runTimer.value = true
            round.value = 1
            reduceTime(50, 1)
            showRestartAlert.value = false
        }, 50);
    }
    function reduceTime(localTime:number, localRound:number):void {
        if (!runTimer.value) return
        time.value = localTime
        localTime--
        setTimeout(() => {
            if (localTime > 0 && localRound == round.value) {
                reduceTime(localTime, localRound)
            } else if (localRound == round.value) {
                changePlayer()
            }
        }, 1000);
    }
    function changePlayer():void {
        if (player.value == 1) player.value = 2
        else player.value = 1
        round.value++
        reduceTime(50, round.value)
    }
    onMounted(()=> {
        if(route.params.cpu) isCpuMatch.value = true
        reduceTime(50, 1)
    })

</script>

<style scoped>
.math-container{
    min-height: 100vh;
    background-color: #7945FF;
}
.math-header-container{
    display: flex;
    justify-content: space-evenly;
    padding-top: 5vh;
    align-items: center;
}
.math-mobile-status{
    display: none;
}
.math-header-button{
    color: white;
    font-size: 1em;
    background-color: #5C2DD5;
    text-transform: uppercase;
    padding: 1vh 2vw;
    border: none;
    border-radius: 10px;
    cursor: pointer;
}
.math-header-button:hover{
    background-color: #FD6687;
}
.math-body-container{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 5vh;
    gap: 2vw;
}
.math-round-container{
    display: flex;
    justify-content: center;
    position: absolute;
    width: 100%;
}
.math-round-icon{
    position: absolute;
    z-index: 6;
    margin-top: -5vh;
    height: 15vh;
}
.math-round-text{
    color: white;
    z-index: 7;
}
.math-round-text-container{
    position: absolute;
    z-index: 7;
    text-align: center;
}
.math-board-placeholder{
    width: 632px;
    height: 594px;
}
.math-footer{
    background-color: #5C2DD5;
    min-height: 30vh;
    border-radius: 70px 70px 0 0;
}
.math-round-winner{
    background-color: white;
    border: 2px solid black;
    box-shadow: 0 0.4em black;
    min-height: 150px;
    width: 20vw;
    position: absolute;
    z-index: 6;
    margin-top: -5vh;
    border-radius: 20px;
    text-align: center;
    padding: 1vh 0;
}
.math-footer-container{
    position: absolute;
    top: 20vh;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column-reverse;
}

@media screen and (min-height: 850px) {
    .math-footer-container{
        height: 80vh;
    }
    .math-footer{
        min-height: 25vh;
    }
}

@media screen and (max-width: 1050px) and (orientation: Portrait){
    .math-round-winner{
        width: 40vw;
    }
    .math-mobile-status{
        display: flex;
        justify-content: center;
        gap: 5vw;
        margin-top: 5vh;
    }
}
@media screen and (max-width: 550px) and (orientation: Portrait) {
    .math-round-icon{
        margin-top: -4vh;
    }
    .math-round-text-container{
        margin-top: 1vh;
    }
    .math-footer-container{
        height: 85vh;
    }
    .math-round-winner{
        width: 60vw;
    }
}
</style>