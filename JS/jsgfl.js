/*
	Author Silas Rex
	didnt keep track of versions :P
*/
function rangeCheck(test, target, range){
    if(test == target){
        return true;
    }else if(Math.abs(test - target) < range){
        return true;
    }else{
       return false;
    }
}
function ticker(counter, frequency, maxTicks){
    this.frame = counter;
    this.freq = frequency;
    this.maxTicks = maxTicks;
    this.tick = false;
}
function run(tickCounter){
    tickCounter.frame += 1;
    if(tickCounter.frame % tickCounter.freq == 0){
        tickCounter.tick = true;
    }else{
        tickCounter.tick = false;
    }
    if(tickCounter.frame >= tickCounter.maxTicks){
        tickCounter.frame -= tickCounter.maxTicks;
    }
}
function drawString(string,font,x,y,color){
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(string,x,y);
}
function point(x, y){
    this.x = x;
    this.y = y;
    this.width = 0;
    this.height = 0;
}
function line(initX,initY,finalX,finalY){
    this.xi = initX;
    this.xf = finalX;
    this.yi = initY;
    this.yf = finalY;
    this.xDelta = this.xf - this.xi;
    this.yDelta = this.yf - this.yi;
    this.lineLength = Math.sqrt(Math.pow(this.xDelta,2) + Math.pow(this.yDelta,2));
    this.linePoints = [];
    for(var i = 0; i < Math.floor(this.lineLength); i++){
        this.linePoints[i] = new point((this.xi + (this.xDelta / this.lineLength * i)),(this.yi + (this.yDelta / this.lineLength * i)));
    }
}
function drawLine(line,width,color){
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(line.xi,line.yi);
    ctx.lineTo(line.xf,line.yf);
    ctx.stroke();
}
function circleMngr(x,y,radius,fill,stroke,draw,id){
    this.type = "circle";
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = radius * 2;
    this.height = radius * 2;
    this.radius = radius;
    this.fill = fill;
    this.stroke = stroke;
    this.visible = true;
    this.draw = draw;
    this.deg = 0;
}
function rectMngr(x,y,width,height,color,id){
    this.type = "rect";
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.visible = true;
    this.left = false;
    this.down = false;
    this.right = false;
    this.up = false;
    this.deg = 0;
}
function imageData(x,y,width,height,src,id){
    this.type = "image";
    this.id = id;
    this.src = src;
    this.sprite = new Image();
    this.sprite.src = this.src;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.visible = true;
    this.left = false;
    this.down = false;
    this.right = false;
    this.up = false;
    this.deg = 0;
}
function animationData(x,y,width,height,IW,IH,src,id){
    this.type = "animation";
    this.id = id;
    this.src = src;
    this.sprite = new Image();
    this.sprite.src = this.src;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.clipStartX = 0;
    this.clipStartY = 0;
    this.clipToX = IW;
    this.clipToY = IH;
    this.visible = true;
    this.left = false;
    this.down = false;
    this.right = false;
    this.up = false;
    this.deg = 0;
}
function drawCircle(data){
    ctx.fillStyle = data.fill;
    ctx.strokeStyle = data.stroke;
    ctx.beginPath();
    ctx.arc(data.x,
        data.y,
        data.radius,
        0,
        2 * Math.PI);
    if(data.draw == 1){
        ctx.stroke();
    }
    else if(data.draw == 2){
        ctx.fill();
    }
    else if(data.draw == 3){
      ctx.fill();
      ctx.stroke();
    }
}
function drawNormalImage(data){
    ctx.drawImage(data.sprite,
        data.x,
        data.y,
        data.width,
        data.height);
}
function drawNormalRect(data){
    ctx.fillStyle = data.color;
    ctx.fillRect(data.x,data.y,data.width,data.height);
}
function drawAnimatedImage(data){
    ctx.drawImage(data.sprite,
        data.clipStartX,
        data.clipStartY,
        data.clipToX,
        data.clipToY,
        data.x,
        data.y,
        data.width,
        data.height);
}
function colorChange(image,tR,tG,tB,range,nR,nG,nB){
    var info = ctx.getImageData(0,0,c.width,c.height);
    var pixAr = info.data;
    var cR, cG, cB;
    for(var i = 0; i < pixAr.length; i += 4){
        cR = pixAr[i];
        cG = pixAr[i + 1];
        cB = pixAr[i + 2];
        if(rangeCheck(cR,tR,range) &&
           rangeCheck(cG,tG,range) &&
           rangeCheck(cB,tB,range)){
             pixAr[i] = nR;
             pixAr[i + 1] = nG;
             pixAr[i + 2] = nB;
        }
    }
    ctx.putImageData(info,0,0);
}
function imageCenterRotate(rect,deg,drawFun){
    var rad = deg * Math.PI / 180;
    var deltaX = rect.x + rect.width/2,
        deltaY = rect.y + rect.height/2;
    rect.tempX = rect.x;
    rect.tempY = rect.y;
    rect.x = -rect.width/2;
    rect.y = -rect.height/2;
    ctx.save();
    ctx.translate(deltaX,deltaY);
    ctx.rotate(rad);

    drawFun(rect);

    ctx.translate(-deltaX,-deltaY);
    ctx.restore();
    if(rect.tempX != rect.x){
        rect.x = rect.tempX;
    }
    if(rect.tempY != rect.y){
        rect.y = rect.tempY;
    }
}
//function imageCustomRotate(){}
function imageShow(data){
    if(data.visible){
        if(data.type === "image"){
            imageCenterRotate(data,data.deg,drawNormalImage);
        }
        else if(data.type === "animation"){
            imageCenterRotate(data,data.deg,drawAnimatedImage);
        }
        else if(data.type === "rect"){
            imageCenterRotate(data,data.deg,drawNormalRect);
        }
        else if (data.type === "circle"){
            imageCenterRotate(data,data.deg,drawCircle);
        }
    }
}
function itemsShow(items){
    for (var i = 0; i < items.length; i++) {
    	imageShow(items[i]);
    };
}
function collisionCheck(r1, r2){
    if(r1.x + r1.width >= r2.x && r1.x <= r2.x + r2.width &&
        r1.y <= r2.y + r2.height && r1.y + r1.height >= r2.y){
        return true;
    }
    else{
        return false;
    }
}
function collisionUp(r1, r2){
    if(collisionCheck(r1,r2)){
        if(r1.y <= r2.y + r2.height && r1.y > r2.y + r2.height / 4 * 3){
            return true;
        }else{
            return false;
        }
    }
}
function collisionDown(r1, r2){
    if(collisionCheck(r1,r2)){
        if(r1.y + r1.height >= r2.y && r1.y + r1.height <= r2.y + r2.height / 4){
            return true;
        }else{
            return false;
        }
    }
}
function collisionLeft(r1, r2){
    if (collisionCheck(r1,r2)){
        if(r1.x <= r2.x + r2.width && r1.x >= r2.x + r2.height / 4 * 3){
            return true;
        }else{
            return false;
        }
    }
}
function collisionRight(r1, r2){
    if(collisionCheck(r1,r2)){
        if(r1.x + r1.width >= r2.x && r1.x + r1.width <= r2.x + r2.width / 4){
            return true;
        }else{
            false;
        }
    }
}
function linearCollisionCheck(line,rect){
    for(var i = 0; i < line.linePoints.length; i++){
        if(collisionCheck(line.linePoints[i],rect)){
            return true;
        }
    }
}
function worldCol(rect,type){
    if(type === "loop"){
        if(rect.x + rect.width <= 0){
            rect.x = c.width - 1;
        }
        if(rect.x >= c.width){
            rect.x = 0 - rect.width;
        }
        if(rect.y + rect.height <= 0){
            rect.y = c.height - 1;
        }
        if(rect.y >= c.height){
            rect.y = 0 - rect.height;
        }
    }
    if(type === "wall"){
        if(rect.x <= 0){
            rect.x = 0;
        }
        if(rect.y <= 0){
            rect.y = 0;
        }
        if(rect.y + rect.height >= c.height){
            rect.y = c.height - rect.height;
        }
        if(rect.x + rect.width >= c.width){
            rect.x = c.width - rect.width;
        }
    }
}
function game(player,map,objects,lvl){
    this.player = player;
    this.map = map;
    this.objects = objects;
    this.lvl = lvl;
}
function map(textures,indexArray,mW,mH,tW,tH){
    this.mapWidth = mW;
    this.mapHeight = mH;
    this.tileWidth = tW;
    this.tileHeight = tH;
    this.map = [];
    for (var i = 0; i < indexArray.length / this.mapWidth; i++) {
        var y = i % this.mapHeight;
        for (var j = 0; j < this.mapWidth; j++) {
            var index = j + i * this.mapWidth;
            this.map[index] = new imageData(j * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight, textures[indexArray[index]],indexArray[index]);
        }
    }
}
function mapShow(map,lvl){
    var arrayL = map.mapWidth * map.mapHeight;
    for (var i = arrayL * (lvl - 1); i < arrayL * lvl; i++) {
        imageShow(map.map[i]);
    }
}
//needs to be modified oct 28, 2015
function mapScroller(game,lS,dS,rS,uS){
    var arrayL = game.map.mapWidth * game.map.mapHeight;
    if(game.player.up){
        game.player.y -= uS;
    }
    if(game.player.left){
        game.player.x -=  lS;
    }
    if(game.player.down){
        game.player.y += dS;
    }
    if(game.player.right){
        game.player.x += rS;
    }
    if (game.player.x >= c.width/4*3) {
        if(game.player.right){
            game.player.x -= rS;
        }
        if (game.player.right){
            if(game.map.map[arrayL * game.lvl - 1].x + game.map.map[arrayL * game.lvl - 1].width > c.width){
                for (var i = arrayL * (game.lvl - 1); i < arrayL * game.lvl; i++) {
                    game.map.map[i].x -= rS;
                }
                for (var i = 0; i < game.objects.length; i++) {
                    game.objects[i].x -= rS;
                };
            }else{
            game.player.x += rS;
            }
        }
    }
    if (game.player.x <= c.width/4) {
        if(game.player.left){
            game.player.x +=  lS;
        }
        if (game.player.left){
            if(game.map.map[arrayL * (game.lvl - 1)].x < 0){
                for (var i = arrayL * (game.lvl - 1); i < arrayL * game.lvl; i++) {
                    game.map.map[i].x -= -lS;
                }
                for (var i = 0; i < game.objects.length; i++) {
                    game.objects[i].x -= -lS;
                };
            }else{
                game.player.x -=  lS;
            }
        }
    }
    if (game.player.y <= c.height / 4) {
        if(game.player.up){
            game.player.y += uS;
        }
        if (game.player.up){
            if(game.map.map[arrayL * (game.lvl - 1)].y < 0){
                for (var i = arrayL * (game.lvl - 1); i < arrayL * game.lvl; i++) {
                    game.map.map[i].y -= -uS;
                }
                for (var i = 0; i < game.objects.length; i++) {
                    game.objects[i].y -= -uS;
                };
            }else{
            game.player.y -= uS;
            }
        }
    }
    if (game.player.y >= c.height / 4 * 3) {
        if(game.player.down){
            game.player.y -= dS;
        }
        if (game.player.down){
            if(game.map.map[arrayL * game.lvl - 1].y + game.map.map[arrayL * game.lvl - 1].height > c.height){
                for (var i = arrayL * (game.lvl - 1); i < arrayL * game.lvl; i++) {
                    game.map.map[i].y -= dS;
                }
                for (var i = 0; i < game.objects.length; i++) {
                    game.objects[i].y -= dS;
                };
            }else{
                game.player.y += dS;
            }
        }
    }
}
function autoRunner(game,xScrollSpeed,yScrollSpeed){
    var arrayL = game.map.mapWidth * game.map.mapHeight;
    itemMoveV = false;
    if(xScrollSpeed > 0){
        if(game.map.map[arrayL * game.lvl - 1].x + game.map.map[arrayL * game.lvl - 1].width - xScrollSpeed > c.width){
            for (var i = arrayL * (game.lvl - 1); i < arrayL * game.lvl; i++) {
                game.map.map[i].x -= xScrollSpeed;
            }
            for (var i = 0; i < game.objects.length; i++) {
                    game.objects[i].x -= xScrollSpeed;
            }
        }
    }
    if(xScrollSpeed < 0){
        if(game.map.map[arrayL * (game.lvl - 1)].x - xScrollSpeed < 0){
            for (var i = arrayL * (game.lvl - 1); i < arrayL * game.lvl; i++) {
                game.map.map[i].x -= xScrollSpeed;
            }
            for (var i = 0; i < game.objects.length; i++) {
                game.objects[i].x -= xScrollSpeed;
            }
        }
    }
    if(yScrollSpeed < 0){
        if(game.map.map[arrayL * (game.lvl - 1)].y - yScrollSpeed < 0){
            for (var i = arrayL * (game.lvl - 1); i < arrayL * game.lvl; i++) {
                game.map.map[i].y -= yScrollSpeed;
            }
            for (var i = 0; i < game.objects.length; i++) {
                game.objects[i].y -= yScrollSpeed;
            }
        }
    }
    if(yScrollSpeed > 0){
        if(game.map.map[arrayL * game.lvl - 1].y + game.map.map[arrayL * game.lvl - 1].height - yScrollSpeed > c.height){
            for (var i = arrayL * (game.lvl - 1); i < arrayL * game.lvl; i++) {
                game.map.map[i].y -= yScrollSpeed;
            }
            for (var i = 0; i < game.objects.length; i++) {
                game.objects[i].y -= yScrollSpeed;
            }
        }
    }
}
