<template>
    <div class="rules-container">
        <div class="rules-modal">
            <h1 data-test="rules-title">Regras</h1>
            <h3>Objetivo</h3>
            <p>
                Ser o primeiro jogador a conectar quatro discos da mesma cor (na vertical, horizontal ou diagonal)
            </p>
            <h3>Como jogar</h3>
            <div class="rules-row" >
                <h4>1</h4>
                <p>O vermelho é o primeiro a jogar na primeira partida.</p>
            </div>
            <div class="rules-row">
                <h4>2</h4>
                <p>Os jogadores devem alternar os turnos, e apenas um disco pode ser colocado por turno.</p>
            </div>
            <div class="rules-row">
                <h4>3</h4>
                <p>O jogo termina quando um jogado conseguir alinhar 4 discos ou mais nenhuma jogada for possível.</p>
            </div>
            <div class="rules-row">
                <h4>4</h4>
                <p>Quem iniciou o jogo anterior em primeiro deve jogar em segundo agora.</p>
            </div>
            <div v-on:click="back()" data-test="rules-check" class="rules-check-container">
                <span class="material-icons rules-check-icon">done</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    function back(): void {
        navigateTo('/')
    }
</script>

<style scoped>
.rules-container{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #7945FF;
}
.rules-modal{
    background-color: white;
    border: 2px solid black;
    box-shadow: 0 0.4em black;
    padding: 3vh 2.5vw;
    width: 45vw;
    border-radius: 40px;
    box-sizing: border-box;
    position: relative;
}
h1{
    text-align: center;
}
h3{
    color: #7945FF;
    margin-top: 1vh;
}
.rules-row{
    display: flex;
    gap: 1.5vw;
    align-items: center;
    margin-bottom: 1vh;
}
.rules-check-container{
    position: absolute;
    left: 45%;
    cursor: pointer;
    background-color: #FD6687;
    border: 2px solid black;
    box-shadow: 0 0.4em black;
    border-radius: 50%;
    padding: 0.3vw;
}
.rules-check-container:hover{
    box-shadow: 0 0.4em #5C2DD5;
    border: 2px solid #5C2DD5;
}
.rules-check-icon{
    font-size: 2.5em;
}

@media screen and (max-width: 1050px) and (orientation: Portrait) {
  .rules-modal{
    width: 60vw;
  }
}

@media screen and (max-width: 550px) and (orientation: Portrait) {
    .rules-modal{
        width: 90vw;
    }
}
</style>