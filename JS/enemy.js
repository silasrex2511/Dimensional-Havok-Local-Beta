function enemy(img,range,atkDmg,speed){
    this.image = img;
    this.range = range;
    this.xi = this.image.x + this.image.width / 2;
    this.yi = this.image.y + this.image.height / 2;
    this.atkDmg = atkDmg;
    this.speed = speed;
    this.inBattle = false;
    this.target;
    this.xf;
    this.yf;
    this.chase = function(){
      this.xf = this.target.image.x + this.target.image.width / 2;
      this.yf = this.target.image.y + this.target.image.height / 2
        //still needs the x,y comparing and changing
        //something isnt updating with the enemy x and y
        var xDelta = this.xf - this.xi;
        // var yDelta =
        console.log(this.yf - this.yi);
              // console.log(yDelta);
        // var distFromTarget = Math.sqrt(Math.pow(xDelta,2) + Math.pow(yDelta,2));
        if(Math.abs(xDelta) > this.range/2){
          // console.log(xDelta / distFromTarget * this.speed);
            // this.image.x += xDelta / distFromTarget * this.speed;
        }
        // console.log("step two");
        // if(Math.abs(yDelta) > this.range/2){
        //   console.log(yDelta / distFromTarget * this.speed);
        //     // this.image.y += yDelta / distFromTarget * this.speed;
        // }
    }
}
