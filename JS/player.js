
//this will handle everything dealing with the player
var path = new line(0,0,0,0);
var player = new character("./res/chars/alfred.png", mage);
var playerRightClick = new point();
var targetClick = new point();
var pathEnd = new point();
//gets x and y of mouse click
c.addEventListener('contextmenu', function(evt) {
    evt.preventDefault();
    var rect = c.getBoundingClientRect();
    playerRightClick.y = evt.clientY - rect.top;
    playerRightClick.x = evt.clientX - rect.left;
    pathEnd.x = playerRightClick.x;
    pathEnd.y = playerRightClick.y;
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
    this.totalHp = 100;
    this.hp = this.totalHp;
    this.hpRegen = 1;
    this.hpLow = 0;
    this.totalMana = 100;
    this.mana = this.totalMana;
    this.manaRegen = 1;
    this.manaLow = 0;
    this.lvl = 1;
    this.xp = 0;
    this.atkDmg = 60;
    this.atkSpeed = .65;
    this.range = 300;
    this.target;
    this.inBattle = false;
    this.a0 = 0;
    this.image = new imageData(400-32,300-32,64,64,img);
    this.manaRegenTicker = new ticker(this.manaLow, 30, 3000);
    this.hpRegenTicker = new ticker(this.hpLow, 30, 3000);
    this.autoAtkTicker = new ticker(this.a0, Math.round(60/this.atkSpeed), 3000);
    this.enemies = [];
    this.nullTarget = new enemy(new rectMngr(0,0,0,0,"transparent"),0,0,0,0,0,0,0)
//Shows Status
    this.statDisplay = function(){
        var underlay = new rectMngr(5,5,300,100,"rgba(50,50,50,.7)","underlay");
        var hpBarMask = new rectMngr(100,10,200,15,"black","hpMask");
        var hpBar = new rectMngr(100,10,200 * (this.hp / this.totalHp),15,"red","hpBar");
        var mpBarMask = new rectMngr(100,30,200,15,"black","mpMask");
        var mpBar = new rectMngr(100,30,200 * (this.mana / this.totalMana),15,"blue","mpBar");
        var xpBarMask = new rectMngr(c.width/2 - 70 * 4 / 2 , 590, 70 * 4, 10, "gray");
        var xpBar = new rectMngr(260,590,280 * (this.xp / (20 * Math.pow(1.25, this.lvl))),8,"green","xpBar");
        var bars = [underlay, hpBarMask, hpBar, mpBarMask, mpBar, xpBarMask, xpBar];
        itemsShow(bars);
        drawString(Math.round(this.hp), "12px Tahoma", 100, 22, "white");
        drawString(Math.round(this.mana), "12px Tahoma", 100, 42, "white");
        drawString("XP: " + player.xp + "/" + Math.round(20 * Math.pow(1.25, this.lvl)), "12px Tahoma", 100, 57, "white");
    }
//Runs Necessary functions in game.js in update()
    this.regulate = function(){
        if(this.mana < 0){
            this.mana = 0;
        }
        if(this.mana > this.totalMana){
            this.mana = this.totalMana;
        }
        if(this.hp < 0){
          this.hp = 0;
        }
        if(this.hp > this.totalHp){
            this.hp = this.totalHp;
        }
        this.provoke();
        this.regen();
        this.targetSelect();
        this.displayMiniMap();
        this.rightClick();
        if(this.inBattle){
            this.autoAttack();
        }
        this.lootCollect();
        this.lvlMngr();
    };
//manages what the right click does
//auto attack, movement, selects target
    this.rightClick = function(){
        var moving = moveTo(player.image,pathEnd.x,pathEnd.y,speed,path,havok);
        for(var i = 0; i < this.enemies.length; i++){
            if(collisionCheck(this.enemies[i].image,playerRightClick)
              && this.enemies[i].image.visible){
                this.target = this.enemies[i];
                if(path.lineLength < this.range){
                    this.inBattle = true;
                    pathEnd.x = c.width/2;
                    pathEnd.y = c.height/2;
                    playerRightClick.x = this.target.image.x+this.target.image.width/2;
                    playerRightClick.y = this.target.image.y+this.target.image.height/2;
                }else{
                    playerRightClick.x = this.target.image.x+this.target.image.width/2;
                    playerRightClick.y = this.target.image.y+this.target.image.height/2;
                    pathEnd.x = playerRightClick.x;
                    pathEnd.y = playerRightClick.y;
                }
            }else if(collisionCheck(this.enemies[i].image,playerRightClick) == false){
                this.inBattle = false;
                pathEnd.x = moving.lineXF;
                pathEnd.y = moving.lineYF;
            }
        }
    }
//regeneration function for mana and hp
    this.regen = function(){
        if(this.mana < this.totalMana){
            run(this.manaRegenTicker);
            if(this.manaRegenTicker.tick){
                this.mana += this.manaRegen;
            }
        }
        if(this.hp < this.totalHp){
            run(this.hpRegenTicker)
            if(this.hpRegenTicker.tick){
                this.hp += this.hpRegen;
            }
        }
    }
//reads if enemy near by then causes it to chase player
//puts nearby enemies in a provoked state
    this.provoke = function(){
        for(var i = 0; i < this.enemies.length; i++){
            if(rangeCheck(this.enemies[i].image.x, this.image.x, this.enemies[i].range) &&
               rangeCheck(this.enemies[i].image.y, this.image.y, this.enemies[i].range)){
                  if(this.enemies[i].image.visible){
                    this.enemies[i].target = this;
                    this.enemies[i].active();
                  }
            }
        }
    }
//selects tartget with left click
//selected target will display its stats
    this.targetSelect = function(){
        for(var i = 0; i < this.enemies.length; i++){
            if(this.enemies[i].image.visible){
                if(collisionCheck(targetClick,this.enemies[i].image)){
                  targetClick.x = this.enemies[i].image.x + this.enemies[i].image.width/2;
                  targetClick.y = this.enemies[i].image.y + this.enemies[i].image.height/2;
                  if(collisionCheck(targetClick,activeArea)){
                    this.enemies[i].statDisplay();
                    this.target = this.enemies[i];
                  }
                }
                else if(!collisionCheck(targetClick,this.enemies[i].image)){
                  targetClick.x = -300;
                  targetClick.y = -300;
                }
            }
        }
    }
//shows a minified version of aproximation of enemies
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
            if(nme.visible){
                miniMapDisplay[miniMapDisplay.length - 1].visible = false;
            }
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
//should run the auto attack ticker
//every tick is a hit on the enemy targets hp
//needs a reset
    this.autoAttack = function(){
        run(this.autoAtkTicker);
        if(this.autoAtkTicker.tick){
            this.target.hp -= this.atkDmg;
            if(this.target.hp <= 0){
                this.inBattle = false;
            }
        }
    }
//updates totalHp, totalMana, basic atkDmg, and xp gained
    this.lvlMngr = function(){
        if(this.xp >= 20 * Math.pow(1.25, this.lvl)){
            this.xp -= 20 * Math.pow(1.25, this.lvl);
            this.lvl++;
        }
        this.totalHp = 100 + (10 * this.lvl);
        this.totalMana = 100 + (25 * (this.lvl - 1));
        this.atkDmg = 60 + this.lvl;
        this.atkSpeed = 0.65 + (this.lvl * 0.01);
        this.hpRegen = 1 + (this.lvl * 0.2);
        this.manaRegen = 1 + (this.lvl * 0.3);
    }
//collects
    this.lootCollect = function(){
        if(this.target == null){
            this.target = this.nullTarget;
        }
        if(this.target.hp <= 0){
            this.xp += this.target.xpReward;
            this.target.xpReward = 0;
            this.gold += this.target.goldReward;
            this.target.goldReward = 0;
        }
    }
}
