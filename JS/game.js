var c = document.getElementById('theCanvas');
var ctx = c.getContext('2d');

function gameLoop(){
    setInterval(render,1000/60);
}
gameLoop();

function render(){
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,c.width,c.height);

    mapShow(world,1);
    // drawLine(path,2,"red");

    itemsShow(objects);
    imageShow(player.enemies[0].image);
    imageShow(player.image);
    imageShow(abilityLayout);
    abilityLayout();
    update();
    player.playerInterface();
    // colorChange(player,0,0,0,1,255,255,255);
}

function update(){
    //>>> quick test
    player.regulate();
    enemy.regulate();
    //<<< quick test

    worldCol(player.image,"wall");

}
//misc functions
