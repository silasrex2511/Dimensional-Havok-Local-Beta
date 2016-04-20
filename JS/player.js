//this will handle everything dealing with the player
var player = new character("./res/chars/alfred.png", mage);
function character(img, classType){
    this.totalHp = 100 + classType.hp * classType.rank;
    this.hp = this.totalHp;
    this.hpLow = 0;
    this.mana = 100;
    this.totalMana = 100;
    this.manaLow = 1;
    this.lvl = 1;
    this.image = new imageData(400-32,300-32,64,64,img);
    this.manaRegenTicker = new ticker(this.manaLow, 60 * 2.5, 3000);
    this.hpRegenTicker = new ticker(this.hpLow, 60 * 2.5, 3000);
    this.enemies = [];
    this.regulate = function(){
        if(this.mana < 0){
            this.mana = 0;
        }
        if(this.hp < 0){
          this.hp = 0;
        }
        this.provoke();
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
}
