<template>
    <div class="main-menu-container">
        <div class="main-menu-body">
            <img class="main-menu-icon" src="~/assets/menuIcon.svg" alt="">
            <MenuButton :action="cpuClick" :cpuMatch="true" text="PLAYER VS CPU" style="margin-top: 2vh;"/>
            <MenuButton :action="playerClick" :playerMatch="true" text="PLAYER VS PLAYER" style="margin-top: 2vh;" />
            <MenuButton :action="rulesClick" text="REGRAS" style="margin-top: 2vh;" />
        </div>
    </div>
</template>

<script setup lang="ts">
    function cpuClick(): void {
        navigateTo('/mathcpu')
    }
    function playerClick(): void {
        navigateTo('/math')
    }
    function rulesClick(): void {
        navigateTo('/rules')
    }
</script>

<style scoped>
.main-menu-container{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #5C2DD5;
}
.main-menu-body{
    background-color: #7945FF;
    min-height: 50vh;
    width: 35vw;
    border-radius: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px solid black;
    box-shadow: 0 0.4em black;
    padding-bottom: 5vh;
}
.main-menu-icon{
    margin-top: 20%;
}

@media screen and (max-width: 1050px) and (orientation: Portrait) {
  .main-menu-body{
    width: 60vw;
  }
}

@media screen and (max-width: 550px) and (orientation: Portrait) {
  .main-menu-body{
    width: 100%;
    height: 100vh;
    background-color: #7945FF;
    border: none;
    box-shadow: none;
    justify-content: center;
    border-radius: 0;
    padding-bottom: 0;
  }
  .main-menu-icon{
    margin-top: 0;
    margin-bottom: 5vh;
  }
}
</style>