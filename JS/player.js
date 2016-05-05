//this will handle everything dealing with the player

var player = new character("./res/chars/alfred.png", mage);
var playerRightClick = new point();
var targetClick = new point();
//gets x and y of mouse click
c.addEventListener('contextmenu', function(evt) {
    evt.preventDefault();
    var rect = c.getBoundingClientRect();
    playerRightClick.y = evt.clientY - rect.top;
    playerRightClick.x = evt.clientX - rect.left;
    // return false;
});
c.addEventListener('click', function(evt) {
    evt.preventDefault();
    var rect = c.getBoundingClientRect();
    var y = evt.clientY - rect.top;
    var x = evt.clientX - rect.left;
    // return false;
    targetClick.x = x;
    targetClick.y = y;
});
function character(img, classType){
    this.totalHp = 100 + classType.hp * classType.rank;
    this.hp = this.totalHp;
    this.hpLow = 0;
    this.mana = 100;
    this.totalMana = 100;
    this.manaLow = 0;
    this.lvl = 1;
    atkDmg = 60;
    atkSpeed = .65;
    this.target;
    this.a0 = 0;
    this.image = new imageData(400-32,300-32,64,64,img);
    this.manaRegenTicker = new ticker(this.manaLow, 60 * 2.5, 3000);
    this.hpRegenTicker = new ticker(this.hpLow, 60 * 2.5, 3000);
    this.autoAtkTicker = new ticker(this.a0, 60 * atkSpeed, 3000);
    this.enemies = [];

    this.statDisplay = function(){
        var underlay = new rectMngr(5,5,300,100,"rgba(50,50,50,.7)","underlay");
        var hpBarMask = new rectMngr(100,10,200,15,"black","hpMask");
        var hpBar = new rectMngr(100,10,200 * (this.hp / this.totalHp),15,"red","hpBar");
        var mpBarMask = new rectMngr(100,30,200,15,"black","mpMask");
        var mpBar = new rectMngr(100,30,200 * (this.mana / this.totalMana),15,"blue","mpBar");
        var bars = [underlay, hpBarMask, hpBar, mpBarMask, mpBar];
        itemsShow(bars);
        drawString(this.hp, "12px Tahoma", 100, 22, "white");
        drawString(this.mana, "12px Tahoma", 100, 42, "white");
        // drawString(player.lvl);
    }
    this.regulate = function(){
        if(this.mana < 0){
            this.mana = 0;
        }
        if(this.hp < 0){
          this.hp = 0;
        }
        this.provoke();
        this.regen();
        this.targetSelect();
        this.displayMiniMap();
        this.rightClick();
    };
    this.rightClick = function(){
        var moving = moveTo(player.image,playerRightClick.x,playerRightClick.y,speed,path,havok);
        for(var i = 0; i < this.enemies.length; i++){
            if(collisionCheck(this.enemies[i],playerRightClick)){
                if(path.lineLength < this.range){
                    
                    playerRightClick.x = this.x;
                    playerRightClick.y = this.y;
                }else{
                    playerRightClick.x = moving.lineXF;
                    playerRightClick.y = moving.lineYF;
                }
            }else{
                playerRightClick.x = moving.lineXF;
                playerRightClick.y = moving.lineYF;
            }
        }
    }
    this.regen = function(){
        if(this.mana < this.totalMana){
            run(this.manaRegenTicker);
            if(this.manaRegenTicker.tick){
                this.mana += 5;
            }
        }
        if(this.hp < this.totalHp){
            run(this.hpRegenTicker)
            if(this.hpRegenTicker.tick){
                this.hp += 5;
            }
        }
    }
    //goes with the enemy chasing ai function in the enemy.js file
    this.updateEnemy = function(enemy){
        enemy.x = enemy.x;
    }
    this.provoke = function(){
        for(var i = 0; i < this.enemies.length; i++){
            if(rangeCheck(this.enemies[i].image.x, this.image.x, this.enemies[i].range) &&
               rangeCheck(this.enemies[i].image.y, this.image.y, this.enemies[i].range)){
                  this.enemies[i].target = this;
                  this.enemies[i].chase();
                  console.log("provoked");
            }
        }
    }
    this.targetSelect = function(){
        for(var i = 0; i < this.enemies.length; i++){
            if(collisionCheck(targetClick,this.enemies[i].image)){
                targetClick.x = this.enemies[i].image.x + this.enemies[i].image.width/2;
                targetClick.y = this.enemies[i].image.y + this.enemies[i].image.height/2;
                if(collisionCheck(targetClick,activeArea)){
                    this.enemies[i].statDisplay();
                }
            }
            else if(!collisionCheck(targetClick,this.enemies[i].image)){
                targetClick.x = -300;
                targetClick.y = -300;
            }
        }
    }
    this.displayMiniMap = function(){
        var miniMapDisplay;
        var underlay = new rectMngr(c.width-150,0,150,150,"rgba(40,40,40,.5)","map");
        var playerIndicator = new circleMngr(c.width-75,75,2,"rgba(0,255,0,.5)","rgba(0,255,0,.5)",2,"playerDot");
        miniMapDisplay = [underlay,playerIndicator]
        for(var i = 0; i < this.enemies.length; i++){
            var nme = this.enemies[i].image;
            var x = (nme.x - this.image.x) / 10 + playerIndicator.x;
            var y = (nme.y - this.image.y) / 10 + playerIndicator.y;
            miniMapDisplay[miniMapDisplay.length] = new rectMngr(x,y,4,4,"rgba(255,0,0,.6)","enemy");
        }
        for(var i = 0; i < miniMapDisplay.length; i++){
            if(collisionCheck(miniMapDisplay[i],underlay)){
                miniMapDisplay[i].visible = true;
            }else{
                miniMapDisplay[i].visible = false;
            }
        }
        itemsShow(miniMapDisplay);
    }
    this.autoAttack = function(){
        run(autoAtkTicker);
        if(autoAtkTicker){
            this.target.hp -= this.atkDmg;
        }
    }
}
