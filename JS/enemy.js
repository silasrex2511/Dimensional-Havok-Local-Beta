function enemy(img,health,range,atkDmg,speed,atkSpd,xp,gold){
    this.totalHp = health
    this.hp = this.totalHp;
    this.image = img;
    this.range = range;
    this.atkDmg = atkDmg;
    this.speed = speed;
    this.atkSpeed = atkSpd
    this.xpDefault = xp;
    this.xpReward = xp;
    this.goldDefault = gold;
    this.goldReward = gold;
    this.inBattle = false;
    this.atRest = false;
    this.provoked = false;
    this.a0 = 0;
    this.r0 = 0;
    this.attackTicker = new ticker(this.a0, Math.round(60 / this.atkSpeed), 3000);
    this.reviveTimer = new ticker(this.r0, 60 * 5, 300);
    this.target;
    this.xi;
    this.xf;
    this.xDelta;
    this.yi;
    this.yf;
    this.yDelta;
    this.regulate = function(){
        if(this.hp > 0){
            if(this.provoked){
                this.chase();
            }
            if(this.inBattle){
                this.autoAttack();
            }
        }
        this.aliveOrDead();
    }
    this.active = function(){
        this.provoked = true;
    }
    this.chase = function(){
        this.xi = this.image.x + this.image.width / 2;
        this.yi = this.image.y + this.image.height / 2;
        this.xf = this.target.image.x + this.target.image.width / 2;
        this.yf = this.target.image.y + this.target.image.height / 2
        this.xDelta = this.xf - this.xi;
        this.yDelta = this.yf - this.yi
        var distFromTarget = Math.sqrt(Math.pow(this.xDelta,2) + Math.pow(this.yDelta,2));
        if(distFromTarget > this.range/2){
            this.image.x += this.xDelta / distFromTarget * this.speed;
            this.image.y += this.yDelta / distFromTarget * this.speed;
        }
        if(distFromTarget < this.range){
            this.inBattle = true;
        }else{
            this.inBattle = false;
            this.provoked = false;
        }
    }
    this.autoAttack = function(){
        run(this.attackTicker);
        if(this.attackTicker.tick){
            this.target.hp -= this.atkDmg;
        }
    }
    this.statDisplay = function(){
        var underlay = new rectMngr(c.width-485,5,300,100,"rgba(50,50,50,.7)","underlay");
        var hpBarMask = new rectMngr(c.width-480,10,200,15,"black","hpMask");
        var hpBar = new rectMngr(c.width-480,10,200 * (this.hp / this.totalHp),15,"red","hpBar");
        var bars = [underlay, hpBarMask, hpBar];
        itemsShow(bars);
        drawString(this.hp, "12px Tahoma", c.width-480, 22, "white");
    }
    this.aliveOrDead = function(){
        if(this.hp <= 0){
            this.image.visible = false;
            this.hp = 0;
            run(this.reviveTimer);
            if(this.reviveTimer.tick){
                this.image.visible = true;
                this.hp = this.totalHp;
                this.inBattle = false;
                this.xpReward = this.xpDefault;
                this.goldReward = this.goldDefault;
            }
        }
    }
}
