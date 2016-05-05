function enemy(img,health,range,atkDmg,speed,atkSpd){
    this.totalHp = health
    this.hp = this.totalHp;
    this.image = img;
    this.range = range;
    this.atkDmg = atkDmg;
    this.speed = speed;
    this.inBattle = false;
    this.a0 = 0;
    this.attackTicker = new ticker(this.a0, 60 * atkSpd, 3000);
    this.target;
    this.xi;
    this.xf;
    this.xDelta;
    this.yi;
    this.yf;
    this.yDelta;
    this.chase = function(){
        this.xi = this.image.x + this.image.width / 2;
        this.yi = this.image.y + this.image.height / 2;
        this.xf = this.target.image.x + this.target.image.width / 2;
        this.yf = this.target.image.y + this.target.image.height / 2
        //still needs the x,y comparing and changing
        //something isnt updating with the enemy x and y
        this.xDelta = this.xf - this.xi;
        this.yDelta = this.yf - this.yi
        var distFromTarget = Math.sqrt(Math.pow(this.xDelta,2) + Math.pow(this.yDelta,2));
        if(Math.abs(this.xDelta) > this.range/2){
            this.image.x += this.xDelta / distFromTarget * this.speed;
        }
        if(Math.abs(this.yDelta) > this.range/2){
            this.image.y += this.yDelta / distFromTarget * this.speed;
        }
        if(distFromTarget < this.range){
            run(this.attackTicker)
            if(this.attackTicker.tick){
                this.target.hp -= this.atkDmg;
            }
        }
    }
    this.statDisplay = function(){
        var underlay = new rectMngr(c.width-485,5,300,100,"rgba(50,50,50,.7)","underlay");
        var hpBarMask = new rectMngr(c.width-480,10,200,15,"black","hpMask");
        var hpBar = new rectMngr(c.width-480,10,200 * (this.hp / this.totalHp),15,"red","hpBar");
        var bars = [underlay, hpBarMask, hpBar];
        itemsShow(bars);
        drawString(this.hp, "12px Tahoma", c.width-300, 22, "white");
    }
}
