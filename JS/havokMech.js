
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


//to be implemented later on
// function onScreenDetection(worldObjects){
//     for(var i = 0; i < worldObjects.length; i++){
//         if(worldObjects[i], worldBoundries){
//             onScreen[onScreen.length] = worldObjects[i]
//         }
//     }
// }
