<template>
    <div class="player-status-container" :data-test="dataTestName" :class="{'status-mobile': isMobile, 'status-desktop': !isMobile}">
        <img data-test="player-icon-1" v-if="player == '1'" class="player-status-icon" src="@/assets/player-one.svg" alt="">
        <img data-test="player-icon-2" v-if="player == '2'" class="player-status-icon" src="@/assets/player-two.svg" alt="">
        <img data-test="player-icon-cpu" v-if="player == 'cpu'" class="player-status-icon" src="@/assets/cpu.svg" alt="">
        <h3 style="margin-top: 1vh;" data-test="player-name">{{ name }}</h3>
        <h1 data-test="player-score">{{ score }}</h1>
    </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    player: String,
    name: String,
    score: Number,
    isMobile: Boolean
  })

  const dataTestName = computed(() => {
    if (!props.isMobile) return 'player-container-' + props.player
    else return ''
  })
</script>

<style scoped>
.player-status-container{
    background-color: white;
    height: 18vh;
    width: 10vw;
    border: 2px solid black;
    box-shadow: 0 0.4em black;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.player-status-icon{
    width: 35%;
    margin-top: -15%;
}
.status-mobile{
    display: none;
}

@media screen and (((max-width: 1050px) and (orientation: Portrait)) or ((max-width: 800px) and (orientation: landscape)))  {
  .status-desktop{
    display: none;
  }
  .status-mobile{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 35vw;
    height: 10vh;
    box-sizing: border-box;
    padding-right: 5%;
  }
  .player-status-icon{
    margin-top: 0;
    margin-left: -10%;
    width: 25%;
  }
}

@media screen and (max-width: 550px) and (orientation: Portrait){
    .status-mobile{
        width: 40vw;
    }
}
</style>