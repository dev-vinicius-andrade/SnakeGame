import GameObjects from "../entities/gameObjects.js";
import DocumentEventHandler from "../handlers/documentEventHandler.js";
import FoodsModule from "./foodsModule.js";
export default class GameModule {
    hub;
    gameIntervalId;
    gameObjects;
    canvasModule;
    playerModule;
    foodsModule;
    divGame;
    divInfos;
    divHome;
    configurations;
    constructor(hub,canvasModule, playerModule) {
        this.hub=hub;
        this.gameIntervalId=null;
        this.gameObjects=new GameObjects();
        this.canvasModule=canvasModule;
        this.playerModule = playerModule;
        this.foodsModule = new FoodsModule(canvasModule)
        this.divGame = document.getElementById("div-game");
        this.divInfos = document.getElementById("div-infos");
        this.divHome = document.getElementById("div-home");
        this.getConfigurations(this);
    }

    getConfigurations(scope)
    {
        scope.hub.on("Configurations",  async function (configurations) {
            scope.configurations = configurations;
        });
    }

     registerKeyDownEventHandler(eventHandler, controller,player){
        document.onkeydown = function (e) {
            eventHandler(e,controller,player);
        }
        return this;
    }

    registerEvents(player){
        this.player=player;
        this.registerKeyDownEventHandler(DocumentEventHandler.keyDownEventHandler,this.playerModule.getKeyDownEventHandler(),player);
        this.registerOnGameChangedEventHandler(this);
        this.registerOnSpeedChanged(player,this);
    }

    gameStatus(player){
        this.gameIntervalId=  window.setInterval(()=>{
        this.hub.invoke('GameStatus', player.roomId, player.id)
            .then(r => {

                this.renderCanvasObjects(this);
                this.renderRoomGuid(this);
                this.renderScore(this);

            })
            .catch((error)=>{console.log("Error on game start: "+error)});
        },this.configurations.room.frameRateInterval);
    }
    registerOnSpeedChanged(player,scope)
    {
        this.hub.on("SpeedChanged",function (newSpeed) {
            clearInterval(scope.gameIntervalId);
            scope.configurations.room.frameRateInterval = newSpeed;
            scope.gameStatus(player);

        });
    }

    registerBackEndError()
    {
        this.hub.on("BackendError", function (error) {
            console.log(error);
        });
    }
    renderCanvasObjects(scope){
        scope.canvasModule.initialize(scope.configurations.room.width,scope.configurations.room.height,scope.configurations.room.backgroundColor);
        scope.playerModule.renderSnakes(scope.gameObjects.players);
        scope.foodsModule.generateFoods(scope.gameObjects.foods);

        //requestAnimationFrame(scope.renderCanvasObjects(scope));
    }
    renderRoomGuid(scope)
    {
        let labelRoomId = document.getElementById("label-roomId");
        labelRoomId.innerText = scope.gameObjects.roomGuid;
    }
    renderScore(scope){
        let divScore = document.getElementById("divScore");
        while (divScore.firstChild) {
            divScore.removeChild(divScore.firstChild);
        }
        for (let scoreObject of scope.gameObjects.score)
        {
            console.log(scoreObject);
            let divScoreRow = document.createElement("div");
            let divColor = document.createElement("div");
            let labelName = document.createElement("label");
            let labelPoints = document.createElement("label");
            labelName.innerText = scoreObject.playerName;
            labelPoints.innerText = scoreObject.points;
            divColor.style.backgroundColor = scoreObject.snakeColor;
            divScoreRow.appendChild(divColor);
            divScoreRow.appendChild(labelName);
            divScoreRow.appendChild(labelPoints);
            divScore.appendChild(divScoreRow);
        }
    }
    registerOnGameChangedEventHandler(scope)
    {
        this.hub.on("GameChanged", function (gameObjects) {
               scope.gameObjects.roomGuid = gameObjects.roomGuid;
               scope.gameObjects.players = gameObjects.players;
               scope.gameObjects.foods = gameObjects.foods;
               scope.gameObjects.score = gameObjects.score;
        });
    }
    async showGame() {
        this.divGame.style.display = 'block';
        this.divGame.style.backgroundColor = this.configurations.room.backgroundColor;
        this.divHome.style.display='none';
        this.canvasModule.display();
        await this.showInfos();
    }
    async showInfos(){
        this.divInfos.style.backgroundColor = this.configurations.room.infos.backgroundColor;
        this.divInfos.style.opacity = this.configurations.room.infos.opacity;
        this.divInfos.style.width = this.configurations.room.infos.width + "px";
        this.divInfos.style.height = this.configurations.room.infos.height+"px";
        this.divInfos.style.position ='absolute';
        this.divInfos.style.top =0;
        this.divInfos.style.right =0;
    }
    async hideGame(){
        this.divHome.style.display = 'block';
        this.divGame.style.display='none';
        this.canvasModule.hide();
    }

}