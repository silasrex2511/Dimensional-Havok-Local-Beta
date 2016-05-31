
var c = document.getElementById('theCanvas');
var activeArea = new rectMngr(0,0,c.width,c.height);
function abilityLayout(){
    var layoutMask = new rectMngr(c.width/2 - 70 * 4 / 2 , 520, 70 * 4, 70, "brown");
    abilities = [];
    selectedAbilities = [];
    var keyCoords = [];
    var x, y = 523;

        for(var i = 0; i < 4; i++){
            x = c.width/2 - 70 * (2 - i) + 3;
            abilities[abilities.length] = new imageData(x, y, 64, 64, "./res/abilities/autoAttack.png");
            switch (i) {
              case 0:
                keyCoords[0] = x + 2;
                keyCoords[1] = y + 12;
                break;
              case 1:
                keyCoords[2] = x + 2;
                keyCoords[3] = y + 12;
                break;
              case 2:
                keyCoords[4] = x + 2;
                keyCoords[5] = y + 12;
                break;
              case 3:
                keyCoords[6] = x + 2;
                keyCoords[7] = y + 12;
                break;
            }
    }
    imageShow(layoutMask);
    itemsShow(abilities);
    for(var i = 0; i < 4; i++){
        selectedAbilities[i] = new rectMngr(abilities[i].x,abilities[i].y,abilities[i].width,abilities[i].height,"rgba(50,50,50,0.6");
    }
    drawString("Q","15px Tahoma",keyCoords[0],keyCoords[1],"black");
    drawString("W","15px Tahoma",keyCoords[2],keyCoords[3],"black");
    drawString("E","15px Tahoma",keyCoords[4],keyCoords[5],"black");
    drawString("R","15px Tahoma",keyCoords[6],keyCoords[7],"black");
}
function moveTo(player, newX, newY, speed, line, game){
    var arrayL = game.map.mapWidth * game.map.mapHeight;

    line.xi = player.x + player.width/2;
    line.yi = player.y + player.height/2;
    line.yf = newY;
    line.xf = newX;

    line.xDelta = line.xf - line.xi;
    line.yDelta = line.yf - line.yi;
    line.lineLength = Math.sqrt(Math.pow(line.xDelta,2) + Math.pow(line.yDelta,2));

    //>>> will only scroll the map
    if(line.xi != line.xf){
        if(Math.abs(line.xDelta) > speed){
            for(var i = 0; i < arrayL; i++){
                game.map.map[i].x -= (line.xDelta / line.lineLength * speed);
            }
            line.xf -= (line.xDelta / line.lineLength * speed);
        }
    }
    if(line.yi != line.yf){
        if(Math.abs(line.yDelta) > speed){
            for(var i = 0; i < arrayL; i++){
                game.map.map[i].y -= (line.yDelta / line.lineLength * speed);
            }
            line.yf -= (line.yDelta / line.lineLength * speed);
        }
    }
    //>>> will move objects along with map
    var objectLength = game.objects.length;
    if(line.xi != line.xf){
        if(Math.abs(line.xDelta) > speed){
            for(var i = 0; i < objectLength; i++){
                game.objects[i].x -= (line.xDelta / line.lineLength * speed);
            }
        }
    }
    if(line.yi != line.yf){
        if(Math.abs(line.yDelta) > speed){
            for(var i = 0; i < objectLength; i++){
                game.objects[i].y -= (line.yDelta / line.lineLength * speed);
            }
        }
    }
    return{
        lineXF: line.xf,
        lineYF: line.yf
    }
}

//to be implemented later on
// function onScreenDetection(worldObjects){
//     for(var i = 0; i < worldObjects.length; i++){
//         if(worldObjects[i], worldBoundries){
//             onScreen[onScreen.length] = worldObjects[i]
//         }
//     }
// }
