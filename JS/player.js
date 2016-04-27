//this will handle everything dealing with the player
var player = new character("./res/chars/alfred.png", mage);
function character(img, classType){
    this.totalHp = 100 + classType.hp * classType.rank;
    this.hp = this.totalHp;
    this.hpLow = 0;
    this.mana = 100;
    this.totalMana = 100;
    this.manaLow = 0;
    this.lvl = 1;
    this.image = new imageData(400-32,300-32,64,64,img);
    this.manaRegenTicker = new ticker(this.manaLow, 60 * 2.5, 3000);
    this.hpRegenTicker = new ticker(this.hpLow, 60 * 2.5, 3000);
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
    };
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
          // console.log(rangeCheck(this.image.x,this.enemies[i].image.x,this.enemies[i].range));
            if(rangeCheck(this.enemies[i].image.x, this.image.x, this.enemies[i].range) &&
               rangeCheck(this.enemies[i].image.y, this.image.y, this.enemies[i].range)){
                  // this.enemies[i].inBattle = true;
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
                // console.log(targetClick)
                if(collisionCheck(targetClick,activeArea)){
                    // targetClick.x = null;
                    // targetClick.y = null;
                    this.enemies[i].statDisplay();
                }
            }
        }

        
        // console.log(targetClick);
    }

}
