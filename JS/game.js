var c = document.getElementById('theCanvas');
var ctx = c.getContext('2d');

var frame = 0;
var mouseX, mouseY;
//gets x and y of mouse click
c.addEventListener('contextmenu', function(evt) {
    evt.preventDefault();
    var rect = c.getBoundingClientRect();
    mouseY = evt.clientY - rect.top;
    mouseX = evt.clientX - rect.left;
    console.log('Mouse position: ' + mouseX + ',' + mouseY);
    // return false;
});

var lvl = 1;



var copy = new imageData(0,0,64,64,"./res/chars/alfred.png");
var enemy = new enemy(copy,200,20,2);
var enemies = [enemy];
player.enemies = enemies;
var path = new line(100,100,100,100);
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
var objects = [player.enemies[0].image];

var havok = new game(player.image,world,objects,lvl);

function gameLoop(){
    setInterval(render,1000/60);
}
gameLoop();

function render(){
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,c.width,c.height);

    mapShow(world,1);
    drawLine(path,2,"red");

    itemsShow(objects);
    imageShow(player.enemies[0].image);
    imageShow(player.image);
    imageShow(abilityLayout);
    abilityLayout();
    update();
    statusBars(player);
    // colorChange(player,0,0,0,1,255,255,255);
}

function update(){
    //>>> quick test
    player.provoke();
    //<<< quick test
    var moving = moveTo(player.image,mouseX,mouseY,speed,path,havok);
    mouseX = moving.lineXF;
    mouseY = moving.lineYF;
    worldCol(player.image,"wall");

}
//misc functions
