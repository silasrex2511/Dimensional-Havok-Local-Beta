var c = document.getElementById('theCanvas');
var ctx = c.getContext('2d');

var frame = 0;

var lvl = 1;



var copy = new imageData(0,0,64,64,"./res/chars/alfred.png");
var enemy = new enemy(copy,500,200,5,2,.7,8);
var enemies = [enemy];
player.enemies = enemies;
var speed = 4;

var textures = [
    "./res/textures/normal/grass.png",
    "./res/textures/normal/grass1.png",
    "./res/textures/normal/grass2.png",
    "./res/textures/normal/grass3.png",
    "./res/textures/normal/grass4l.png",
    "./res/textures/normal/grass4r.png",
    "./res/textures/normal/grass4t.png",
    "./res/textures/normal/grass4b.png"
];

var world = new map(textures,introMap,50,30,64,64);
var objects = [player.enemies[0].image,targetClick];

var havok = new game(player.image,world,objects,lvl);

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
    player.statDisplay();
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
