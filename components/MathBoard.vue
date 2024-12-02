<template>
    <div class="board-container">
        <img class="board-img1" src="@/assets/blackLayer.svg" alt="">
        <img class="board-img2" src="@/assets/whiteLayer.svg" alt="">

        <img v-for="coin in coins" :key="coin.id" :id="`yellow-coin-${coin.id}`" class="board-coin" src="@/assets/yellowCoin.svg" alt="">
        <img v-for="coin in coins" :key="coin.id" :id="`pink-coin-${coin.id}`" class="board-coin" src="@/assets/pinkCoin.svg" alt="">

        <div class="coin-hitbox" :data-test="'hitbox-'+coin.id" v-on:click="userCoinClick(coin)" v-on:mouseleave="hitboxleave(coin.position.x)" v-on:mouseover="hitboxHover(coin.position.x)" :style="getCoinPosition(coin.position.x, coin.position.y)" v-for="coin in coins" :key="coin.id"></div>

        <img v-for="number in [0,1,2,3,4,5,6]" :key="number" :id="'hover-id-'+number" :style="'left: ' + xPosition[number] + '%'" class="math-hover-icon" src="@/assets/hoverIcon.svg" alt="">
        <div v-for="winnerCoin in winnerCoinsMain" :key="winnerCoin.id" :style="getCoinPosition(winnerCoin.position.x, winnerCoin.position.y)" class="coin-win-icon"></div>
    </div>
</template>

<script setup lang="ts">
interface coin {
    id: number,
    player?: number,
    position: {x:number,y:number}
}
const props = defineProps({
    player: {
        type:Number,
        required: true
    },
    changePlayer: {
        type: Function,
        required: true,
    },
    playerWin:{
        type: Function,
        required: true
    },
    isCpuMatch: Boolean
})
let xPosition = ref([3, 16.5, 30.5, 44.5, 58.4, 72.3, 86.3])
let yPosition = ref([3, 17.5, 32.5, 47.7, 62.5, 77])
let coins = ref<coin[]>([])
let isOver = ref(false)
let winnerCoinsMain = ref<coin[]>([])

watch(() => props.player, (selection, prevSelection) => {
    if (props.isCpuMatch && props.player != 1) setTimeout(cpuCoinClick, 1500);
})
function cpuCoinClick():void {
    const nextMove = testVerticalLine()
    const nextMove2 = testHorizontalLine()
    if (nextMove || nextMove2) {
        if (nextMove) coinClick(nextMove)
        else if (nextMove2) coinClick(nextMove2)
        return
    } else {
        // click random coin
        let xList = [0,1,2,3,4,5,6]
        for (let index = 0; index < 7; index++) {
            const tryNumber = getRndInteger(0,xList.length)
            const tryCoin = getColumHeigth(xList[tryNumber])
            if (tryCoin){
                coinClick(coins.value[xList[tryNumber]])
                break
            }
            xList.splice(tryNumber,1)
        }
    }
}
function testVerticalLine():coin | undefined{
    for (let x = 0; x < 7; x++) {
        let lastCoin = undefined
        let coinStreak = 0
        let resp = undefined
        for (let y = 5; y > -1; y--) {
            const coin = coins.value[x + y * 7].player
            if (!coin) break
            if (!lastCoin && coinStreak == 0) {
                lastCoin = coin
                coinStreak++
            } else if (lastCoin == coin) coinStreak++
            else {
                lastCoin = coin
                coinStreak = 1
            }
        }
        if (coinStreak == 3) resp = getColumHeigth(x)
        if (resp) {
            return resp
        }
    }
}
function getColumHeigth (x: number):coin {
    let resp = 0
    let columCoins = [
        coins.value[ x + 35],
        coins.value[ x + 28],
        coins.value[ x + 21],
        coins.value[ x + 14],
        coins.value[ x + 7],
        coins.value[ x ],
    ]
    for (let index = 0; index < columCoins.length; index++) {
        const element = columCoins[index];
        if (element.player) resp++
    }
    return columCoins[resp]
}
function testHorizontalLine ():coin | undefined {
    for (let y = 5; y > -1; y--) {
        let coinInit = undefined
        let coinStreak = 0
        for (let x = 0; x < 7; x++){
            if (coins.value[x + y * 7].player) {
                if (!coinInit){
                    coinInit = coins.value[x + y * 7]
                    coinStreak++
                } else if (coinInit.player == coins.value[x + y * 7].player){
                    coinStreak++
                } else {
                    coinInit = coins.value[x + y * 7]
                    coinStreak = 1
                }
            } else {
                coinInit = undefined
                coinStreak = 0
            }
            if (coinStreak == 3) {
                break
            }
        }
        if (coinInit && coinStreak == 3) {
            if (coinInit.position.y < 5 && coinInit.position.x < 4 && !coins.value[coinInit.position.x+3 + coinInit.position.y * 7].player && coins.value[coinInit.position.x+3 + coinInit.position.y+1 * 7].player){
                return coins.value[coinInit.position.x+3 + coinInit.position.y * 7]
            }
            if (coinInit.position.y < 5 && coinInit.position.x > 0 && !coins.value[coinInit.position.x-1 + coinInit.position.y * 7].player && coins.value[coinInit.position.x-1 + coinInit.position.y+1 * 7].player){
                return coins.value[coinInit.position.x-1 + coinInit.position.y * 7]
            }if (coinInit.position.x > 0 && !coins.value[coinInit.position.x-1 + coinInit.position.y * 7].player){
                return coins.value[coinInit.position.x-1 + coinInit.position.y * 7]
            }if (coinInit.position.x < 4 && !coins.value[coinInit.position.x+3 + coinInit.position.y * 7].player){
                return coins.value[(coinInit.position.x+3) + coinInit.position.y * 7]
            }
        }
    }
}
function coinClick (coin:coin):void {
    coin = getColumHeigth(coin.position.x)
    if (!coin) return
    if(isOver.value) return
    let element = undefined
    if (props.player == 1) element = document.getElementById('pink-coin-'+ coin.id)
    else element = document.getElementById('yellow-coin-'+ coin.id)
    if (!element) return

    coin.player = props.player
    element.style.display = 'block'
    element.style.top = '-15%'
    element.style.left = xPosition.value[coin.position.x] + '%'
    setTimeout(() => {
        element.style.top = yPosition.value[coin.position.y] + '%'
        testWin(coin)
        props.changePlayer()
    }, 100);
}
function testWin(coin:coin) {
    let isWin = false
    let winnerCoins:coin[] = []
    let xLine = [coin]
    let accendLine = [coin]
    let descendLine = [coin]
    // pegar valores a direita
    if (coin.position.x + 1 < 7 && coins.value[(coin.position.x+1) + coin.position.y * 7].player == coin.player) {
        xLine.push(coins.value[(coin.position.x+1) + coin.position.y * 7])
        if (coin.position.x + 2 < 7 && coins.value[(coin.position.x+2) + coin.position.y * 7].player == coin.player) {
            xLine.push(coins.value[(coin.position.x+2) + coin.position.y * 7])
            if (coin.position.x + 3 < 7 && coins.value[(coin.position.x+3) + coin.position.y * 7].player == coin.player) {
                xLine.push(coins.value[(coin.position.x+3) + coin.position.y * 7])
            }
        }
    }
    // pegar valores a Direita-Cima
    if (coin.position.x + 1 < 7 && coin.position.y - 1 > -1 && coins.value[(coin.position.x+1) + (coin.position.y-1) * 7].player == coin.player){
        accendLine.push(coins.value[(coin.position.x+1) + (coin.position.y-1) * 7])
        if (coin.position.x + 2 < 7 && coin.position.y - 2 > -1 && coins.value[(coin.position.x+2) + (coin.position.y-2) * 7].player == coin.player){
            accendLine.push(coins.value[(coin.position.x+2) + (coin.position.y-2) * 7])
            if (coin.position.x + 3 < 7 && coin.position.y - 3 > -1 && coins.value[(coin.position.x+3) + (coin.position.y-3) * 7].player == coin.player){
                accendLine.push(coins.value[(coin.position.x+3) + (coin.position.y-3) * 7])
            }
        }
    }
    // pegar valores Direita-Baixo
    if(coin.position.x + 1 < 7 && coin.position.y + 1 < 6 && coins.value[(coin.position.x+1) + (coin.position.y+1) * 7].player == coin.player){
        descendLine.push(coins.value[(coin.position.x+1) + (coin.position.y+1) * 7])
        if(coin.position.x + 2 < 7 && coin.position.y + 2 < 6 && coins.value[(coin.position.x+2) + (coin.position.y+2) * 7].player == coin.player){
            descendLine.push(coins.value[(coin.position.x+2) + (coin.position.y+2) * 7])
            if(coin.position.x + 3 < 7 && coin.position.y + 3 < 6 && coins.value[(coin.position.x+3) + (coin.position.y+3) * 7].player == coin.player){
                descendLine.push(coins.value[(coin.position.x+3) + (coin.position.y+3) * 7])
            }
        }
    }
    // pegar valores a esquerda
    if (coin.position.x - 1 > -1 && coins.value[(coin.position.x-1) + coin.position.y * 7].player == coin.player) {
        xLine.push(coins.value[(coin.position.x-1) + coin.position.y * 7])
        if (coin.position.x - 2 > -1 && coins.value[(coin.position.x-2) + coin.position.y * 7].player == coin.player){
            xLine.push(coins.value[(coin.position.x-2) + coin.position.y * 7])
            if (coin.position.x - 3 > -1 && coins.value[(coin.position.x-3) + coin.position.y * 7].player == coin.player){
                xLine.push(coins.value[(coin.position.x-3) + coin.position.y * 7])
            }
        }
    }
    // pegar valores a esquerda-cima
    if(coin.position.x - 1 > -1 && coin.position.y - 1 > -1 && coins.value[(coin.position.x-1) + (coin.position.y-1) * 7].player == coin.player ) {
        descendLine.push(coins.value[(coin.position.x-1) + (coin.position.y-1) * 7])
        if(coin.position.x - 2 > -1 && coin.position.y - 2 > -1 && coins.value[(coin.position.x-2) + (coin.position.y-2) * 7].player == coin.player ) {
            descendLine.push(coins.value[(coin.position.x-2) + (coin.position.y-2) * 7])
            if(coin.position.x - 3 > -1 && coin.position.y - 3 > -1 && coins.value[(coin.position.x-3) + (coin.position.y-3) * 7].player == coin.player ) {
                descendLine.push(coins.value[(coin.position.x-3) + (coin.position.y-3) * 7])
            }
        }
    }
    // pegar valores esquerda-baixo
    if(coin.position.x - 1 > -1 && coin.position.y + 1 < 6 && coins.value[(coin.position.x-1) + (coin.position.y+1) * 7].player == coin.player){
        accendLine.push(coins.value[(coin.position.x-1) + (coin.position.y+1) * 7])
        if(coin.position.x - 2 > -1 && coin.position.y + 2 < 6 && coins.value[(coin.position.x-2) + (coin.position.y+2) * 7].player == coin.player){
            accendLine.push(coins.value[(coin.position.x-2) + (coin.position.y+2) * 7])
            if(coin.position.x - 3 > -1 && coin.position.y + 3 < 6 && coins.value[(coin.position.x-3) + (coin.position.y+3) * 7].player == coin.player){
                accendLine.push(coins.value[(coin.position.x-3) + (coin.position.y+3) * 7])
            }
        }
    }
    // pegar valores pra baixo
    if(coin.position.y < 3 && 
    coins.value[(coin.position.x) + (coin.position.y+1) * 7].player == coin.player &&
    coins.value[(coin.position.x) + (coin.position.y+2) * 7].player == coin.player &&
    coins.value[(coin.position.x) + (coin.position.y+3) * 7].player == coin.player) {
        isWin = true
        winnerCoins = [
            coin,
            coins.value[(coin.position.x) + (coin.position.y+1) * 7],
            coins.value[(coin.position.x) + (coin.position.y+2) * 7],
            coins.value[(coin.position.x) + (coin.position.y+3) * 7]
        ]
    }

    if(xLine.length > 3) {
        isWin = true
        winnerCoins = xLine
    }
    if(accendLine.length > 3) {
        isWin = true
        winnerCoins = accendLine
    }
    if(descendLine.length > 3) {
        isWin = true
        winnerCoins = descendLine
    }
    if (isWin) {
        isOver.value = true
        setTimeout(() => {
            props.playerWin(coin.player)
            winnerCoinsMain.value = winnerCoins
        }, 1400);
    }
}
function getCoinPosition (x:number,y:number){
    return `top: ${yPosition.value[y]}%; left: ${xPosition.value[x]}%;`
}
function userCoinClick (coin:coin) {
    if (props.isCpuMatch && props.player != 1) return
    coinClick(coin)
}
function getRndInteger(min:number, max:number):number {
    return Math.floor(Math.random() * (max - min) ) + min;
}
function hitboxHover (x:number) {
    const element = document.getElementById('hover-id-' + x)
    if (element) element.style.display = 'block'
}
function hitboxleave (x:number) {
    const element = document.getElementById('hover-id-' + x)
    if (element) element.style.display = 'none'
}
onBeforeMount(() => {
    let x = 0
    let y = 0
    for (let index = 0; index < 42; index++) {
        coins.value.push({
            id: index,
            player: undefined,
            position: {x:x,y:y}
        })
        if (x == 6){
            x=0
            y++
        } else x++
    }
})
onMounted(()=>{
    if (props.isCpuMatch && props.player != 1) setTimeout(cpuCoinClick, 500);
})
</script>

<style scoped>
.board-container{
    width: 632px;
    height: 594px;
    position: relative;
}
.board-img1{
    position: absolute;
    z-index: 1;
    width: 632px;
    height: 594px;
}
.board-img2{
    position: absolute;
    z-index: 3;
    height: 584px;
    width: 632px;
}
.board-coin{
    position: absolute;
    z-index: 2;
    transition: top 1.5s;
    display: none;
}
.coin-hitbox{
    width: 65px;
    height: 65px;
    border-radius: 50%;
    position: absolute;
    z-index: 4;
    cursor: pointer;
    top: 3%;
    left: 3%;
}
.math-hover-icon{
    position: absolute;
    z-index: 8;
    margin-top: -7%;
    margin-left: 2%;
    display: none;
}
.coin-win-icon{
    border: 5px solid white;
    border-radius: 50%;
    width: 34px;
    height: 34px;
    position: absolute;
    z-index: 8;
    margin-top: 2%;
    margin-left: 2%;
}

@media screen and (max-width: 1050px) and (orientation: Portrait){
    .math-hover-icon{
        visibility: hidden;
    }
}

@media screen and (max-width: 550px) and (orientation: Portrait) {
    .board-container{
        height: 310px;
        width: 335px;
    }
    .board-img1{
        height: 310px;
        width: 335px;
    }
    .board-img2{
        height: 310px;
        width: 335px;
    }
    .board-coin{
        width: 38px;
        height: 38px;
        margin-top: 1%;
    }
    .coin-hitbox{
        width: 38px;
        height: 38px;
        margin-top: 1%;
    }
    .coin-win-icon{
        width: 15px;
        height: 15px;
        margin-top: 2.5%;
    }
}
</style>