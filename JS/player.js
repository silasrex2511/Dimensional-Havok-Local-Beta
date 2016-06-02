//***************************************************************//
//******************|||||||||||||||||||||||**********************//
//------------------NEEDS A LITTLE CLEAN UP----------------------//
//******************|||||||||||||||||||||||**********************//
//***************************************************************//
//this will handle everything dealing with the player
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
    this.speed = 4;
    this.range = 300;
    this.target;
    this.inBattle = false;
    this.lvlUpBonus = false;
    this.gameStateStandby = false;
    this.a0 = 0;
    this.image = new imageData(400-32,300-32,64,64,img);
    this.manaRegenTicker = new ticker(this.manaLow, 30, 3000);
    this.hpRegenTicker = new ticker(this.hpLow, 30, 3000);
    this.autoAtkTicker = new ticker(this.a0, Math.round(60/this.atkSpeed), 3000);
    this.enemies = [];
    this.nullTarget = new enemy(new rectMngr(0,0,0,0,"transparent"),0,0,0,0,0,0,0)
//Shows Status
    this.playerInterface = function(){
        hpBar.width = 200 * (player.hp / player.totalHp);
        mpBar.width = 200 * (player.mana / player.totalMana);
        xpBar.width = 280 * (player.xp / Math.round(20 * Math.pow(1.25, player.lvl)));
        itemsShow(bars);
        drawString(Math.round(this.hp), "12px Tahoma", 100, 22, "white");
        drawString(Math.round(this.mana), "12px Tahoma", 100, 42, "white");
        drawString("XP: " + this.xp + "/" + Math.round(20 * Math.pow(1.25, this.lvl)), "12px Tahoma", 100, 57, "white");
        this.displayMiniMap();
        this.menuDisplay();

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
        if(!this.gameStateStandby){
            this.targetSelect();
            this.rightClick();
        }
        if(this.inBattle){
            this.autoAttack();
            this.lootCollect();
        }

        this.lvlMngr();
    };
//manages what the right click does
//auto attack, movement, selects target
    this.rightClick = function(){
        var moving = this.moveTo(pathEnd.x,pathEnd.y,player.speed,path,havok);
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
        for(var i = 0; i < this.enemies.length; i++){
            var nme = this.enemies[i].image;
            var x = (nme.x - this.image.x) / 10 + playerIndicator.x;
            var y = (nme.y - this.image.y) / 10 + playerIndicator.y;
            miniMapDisplay[2 + i].x = x;
            miniMapDisplay[2 + i].y = y;
            if(!this.enemies[i].image.visible){
                miniMapDisplay[2 + i].visible = false;
            }
        }
        for(var i = 2; i < miniMapDisplay.length; i++){
            if(collisionCheck(miniMapDisplay[i],miniMapUnderlay)){
                if(this.enemies[i-2].image.visible){
                    miniMapDisplay[i].visible = true;
                }
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
        }
    }
//updates totalHp, totalMana, basic atkDmg, and xp gained
    this.lvlMngr = function(){
        if(this.xp >= Math.round(20 * Math.pow(1.25, this.lvl))){
            this.xp -= Math.round(20 * Math.pow(1.25, this.lvl));
            this.lvl++;
            this.lvlUpBonus = true;
        }
        this.totalHp = 100 + (10 * this.lvl);
        this.totalMana = 100 + (25 * (this.lvl - 1));
        this.atkDmg = 60 + this.lvl;
        this.atkSpeed = 0.65 + (this.lvl * 0.01);
        this.hpRegen = 1 + (this.lvl * 0.2);
        this.manaRegen = 1 + (this.lvl * 0.3);
        if(this.lvlUpBonus){
            if(this.hp < this.totalHp){
                this.hp += Math.round(0.25 * this.totalHp);
                if(this.hp > this.totalHp){
                    this.hp = this.totalHp;
                }
            }
            if(this.mana < this.totalMana){
                this.mana += Math.round(0.25 * this.totalMana);
                if(this.mana > this.totalMana){
                    this.mana = this.totalMana;
                }
            }
            this.lvlUpBonus = false;
        }
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
            this.inBattle = false;
            this.target = this.nullTarget;
        }
    }
    //will display other menues of the game
    // these menues are accessible at all times
    this.menuDisplay = function(){
        itemsShow(menuButtons);
        // if(collisionCheck(targetClick,inventory)){
        //
        // }
    }
    //adds class stats to your player stats
    this.classEquipped = function(){
    }
    this.moveTo = function(newX, newY, speed, line, game){
        var arrayL = game.map.mapWidth * game.map.mapHeight;

        line.xi = c.width/2;
        line.yi = c.height/2;
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
}
