var v;
var gravity = -0.35;
var thrust;
var score = 0;
var scoreLabel;
var pipeSpeed = 2;
var gameOverLabel = new cc.LabelTTF("Game Over\nScore: " + score, "Arial", 36);
var touchDisabled = false; // Biến để kiểm tra xem sự kiện touch có bị vô hiệu hóa không
var touchDisableDuration = 0.5; // Thời gian tạm thời vô hiệu hóa sự kiện touch (ví dụ: 3 giây)
var touchDisableTimer = 0;

var dash = false;
var dashDuration = 1;
var dashTimer = 0;
var dashCoolDown = 0;

var power = false;
var powerDuration = 5;
var powerTimer = 0;
var powerCoolDown = 0;

var pause = false;

var menu = new cc.Menu();

var medalDisplay = new cc.Sprite("assets/bronze-medal.png");
var gameScene = cc.Scene.extend({
onEnter:function () {
    this._super();
    gameLayer = new game();
    gameLayer.init();
    this.addChild(gameLayer);
}
});
var game = cc.Layer.extend({
init:function () {

    this._super();
    cc.audioEngine.playMusic("assets/marios_way.mp3", true);

    cc.eventManager.addListener({
        event: cc.EventListener.KEYBOARD,
        onKeyPressed: function (keyCode, event) {
            if (keyCode === cc.KEY.x) {
                // Xử lý sự kiện bấm phím X ở đây
                // Đây là nơi bạn có thể thực hiện hành động cụ thể khi người dùng bấm phím X
                if(powerCoolDown <=0){
                    power = true;
                    powerCoolDown = 30;
                    powerTimer = 0;
                }
            }
        }
    }, this);

    cc.eventManager.addListener({
        event: cc.EventListener.MOUSE,
        onMouseUp: function (event) {
            if (event.getButton() === cc.EventMouse.BUTTON_RIGHT) {
                console.log("dash");
                if(dashCoolDown <= 0) {
                    dash = true;
                    dashCoolDown = 10;

                }
            }
        }
    }, this);
    cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function (touch, event) {
            if(touchDisabled){
                return false;
            }
            if(ship.state == 0){
                dashCoolDown = 0;
                powerCoolDown = 0;
                power = false;
                powerTimer = 100;
                ship.state = 1;
                startLabel.setVisible(false);
                scoreLabel.setVisible(true);
                gameOverLabel.setVisible(false);
                medalDisplay.setVisible(false);
                setTimeout(() => {
                    gameLayer.addPipe()
                }, 1000);
            }
            ship.ySpeed = 6;
            cc.audioEngine.playEffect("assets/jump.wav");
            return true;
        }
        },this)

    background = new ScrollingBG();
    this.addChild(background);
    ground = new Ground();
    this.addChild(ground);
    //background.setVisible(false);
    this.scheduleUpdate();
    ship = new Ship();
    this.addChild(ship);
    //this.schedule(this.addPipe,2);

    var startLabel = new cc.LabelTTF("Click to play", "Arial", 36);
    startLabel.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
    startLabel.setColor(cc.color(0, 0, 0)); // Màu chữ
    this.addChild(startLabel);

    scoreLabel = new cc.LabelTTF("Score: " + score, "Arial", 24);
    scoreLabel.setPosition(cc.winSize.width / 2, cc.winSize.height - 30);
    this.addChild(scoreLabel, 3);

    this.addChild(gameOverLabel, 3);
    gameOverLabel.setVisible(false);

    cc.audioEngine.preloadEffect("assets/jump.wav");
    cc.audioEngine.preloadEffect("assets/hurt.wav");
    cc.audioEngine.preloadEffect("assets/explosion.wav");
    cc.audioEngine.preloadEffect("assets/score.wav");
    //cc.audioEngine.preloadMus("assets/marios_way.mp3");

    this.addChild(medalDisplay);
    medalDisplay.setVisible(false);

    var pauseButton = new cc.MenuItemImage(
        "assets/pause.png", // Hình ảnh khi trạng thái bình thường
        "assets/pause.png",
        "assets/pause.png",
        // Hình ảnh khi trạng thái được chọn
        ()=>this.pauseGame(),
        this// Hàm gọi khi nút pause được nhấn

    );
        var resumeButton = new cc.MenuItemImage(
        "assets/resume.png", // Hình ảnh khi trạng thái bình thường
        "assets/resume.png",
        "assets/resume.png",
            ()=>this.pauseGame(),
        this// Hình ảnh khi trạng thái được chọn
         // Hàm gọi khi nút pause được nhấn

    );
        this.resumeButton = resumeButton;
    pauseButton.setScale(0.05);
    resumeButton.setScale(0.05);
    // pauseButton.setPosition(cc.p(50, cc.winSize.height - 50));
    // resumeButton.setPosition(cc.p(50, cc.winSize.height - 100)); // Hoặc bạn có thể điều chỉnh vị trí của nút resume theo ý muốn
    menu = new cc.Menu(pauseButton);
    menu.setPosition(cc.p(50, cc.winSize.height - 50)); // Đặt vị trí của nút pause

    this.addChild(menu, 1);
},
update:function(dt){
    if(pause == true)
        return false;
    background.scroll();
    ship.updateY();
    if(ship.y < 10){
        cc.audioEngine.playEffect("assets/hurt.wav");
        this.restartGame();
    }
    if(touchDisabled){
        touchDisableTimer += dt;
        if (touchDisableTimer >= touchDisableDuration) {
            touchDisabled = false; // Kết thúc thời gian tạm thời vô hiệu hóa sự kiện touch
            touchDisableTimer = 0;
        }
    }
    if(dashCoolDown > 0) {
        dashCoolDown -= dt;
    }
    if(powerCoolDown > 0){
        powerCoolDown -= dt;
    }
},
    addPipe:function(event){
        if(ship.state == 0 || pause == true){
            return;
        }
            var randWait = Math.random() * 500;
            setTimeout(() => {
                var upPipe = new UpPipe();
                this.addChild(upPipe, 0);
                var downPipe = new DownPipe();
                this.addChild(downPipe, 0);
            }, randWait);


    },
    removePipe:function(pipe){
        this.removeChild(pipe);
    },
    restartGame:function () {
        ship.state = 0;
        ship.y = 160;

        gameOverLabel = new cc.LabelTTF("Game Over\nScore: " + score, "Arial", 36);
        gameOverLabel.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        gameOverLabel.setColor(cc.color(0, 0, 0));
        this.addChild(gameOverLabel, 2);
        if (score >= 10) {
            medalDisplay = new cc.Sprite("assets/gold-medal.png"); // Huy chương cho điểm từ 30 trở lên
            this.addChild(medalDisplay);
        } else if (score >= 5) {
            medalDisplay = new cc.Sprite("assets/silver-medal.png"); // Huy chương cho điểm từ 20 đến 29
            this.addChild(medalDisplay);
        }else{
            medalDisplay = new cc.Sprite("assets/bronze-medal.png"); // Huy chương cho điểm từ 20 đến 29
            this.addChild(medalDisplay);
        }
        medalDisplay.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 100);
        medalDisplay.setScale(0.2);

        medalDisplay.setVisible(true);
        score = 0;
        scoreLabel.setString("Score: " + score);
        scoreLabel.setVisible(false);
        touchDisabled = true;
    },
    increaseScore:function () {
        score += 1;
        scoreLabel.setString("Score: " + score);
    },
    pauseGame: function () {
        if(pause==true) {
            pause = false;
            cc.director.resume();
            cc.audioEngine.resumeMusic();
            cc.audioEngine.resumeAllEffects();
            touchDisabled = false;
            menu.removeAllChildren();
            var pauseButton = new cc.MenuItemImage(
                "assets/pause.png", // Hình ảnh khi trạng thái bình thường
                "assets/pause.png",
                "assets/pause.png",
                // Hình ảnh khi trạng thái được chọn
                ()=>this.pauseGame(),
                this// Hàm gọi khi nút pause được nhấn

            );
            pauseButton.setScale(0.05);
            menu.addChild(pauseButton);

        }
        else {
            pause = true;
            cc.director.pause();
            cc.audioEngine.pauseMusic();
            cc.audioEngine.pauseAllEffects();
            touchDisabled = true;
            menu.removeAllChildren();
            var resumeButton = new cc.MenuItemImage(
                "assets/resume.png", // Hình ảnh khi trạng thái bình thường
                "assets/resume.png",
                "assets/resume.png",
                ()=>this.pauseGame(),
                this// Hình ảnh khi trạng thái được chọn
                // Hàm gọi khi nút pause được nhấn

            );


            resumeButton.setScale(0.05);
            menu.addChild(resumeButton);
        }


        // menu.removeAllChildren();
        // menu.addChild(resumeButton,1);
    },
    resumeGame: function () {
        // Tiếp tục tất cả các hẹn giờ và hành động
        pause = false;
        // menu.removeAllChildren();
        // menu.addChild(pauseButton,1);
    },
    resumeButton: null
});


var ScrollingBG = cc.Sprite.extend({
    ctor:function() {
    this._super();
    this.initWithFile("assets/background.png");
},
onEnter:function() {
this.setPosition(413,144);
},
scroll:function(){
    this.setPosition(this.getPosition().
    x-scrollSpeed,this.getPosition().y);
    if(this.getPosition().x<0){
        this.setPosition(413,144);
    }
}
});

var Ground = cc.Sprite.extend({
    ctor:function() {
        this._super();
        this.initWithFile("assets/ground.png");
    },
    onEnter:function() {
        this.setPosition(0,0);
        this.setAnchorPoint(0,0);
    },
    scroll:function(){
        this.setPosition(this.getPosition().
            x-scrollSpeed,this.getPosition().y);
        if(this.getPosition().x<0){
            this.setPosition(413,144);
        }
    },
});

var Ship = cc.Sprite.extend({
ctor:function() {
    this._super();
    this.initWithFile("assets/bird.png");
    this.ySpeed = 0;
    this.state = 0;  // inactive
    this.scheduleUpdate();
},
onEnter:function() {
    this.setPosition(60,160);
},
updateY:function(dt) {
    if(ship.state == 0 || pause == true){
        return;
    }
    this.ySpeed += gravity;
    this.setPosition(this.getPosition().x,this.getPosition().y+this.ySpeed);
    this.setRotation(-this.ySpeed*4-10);

},
    update: function (dt) {

        if(powerTimer == 0 && power == true){
            this.setScale(5);
        }
        if(powerTimer < powerDuration){
            powerTimer += dt;
        }else if(powerTimer >= powerDuration){
            this.setScale(1);
            power = false;
            powerTimer = 0;
        }
    },
    getCollideBox: function () {
        return cc.rect(this.x - this.width * this.scaleX / 4, this.y - this.height * this.scaleY / 4, this.width / 4 * 3 * this.scaleX, this.height / 4 * 3 * this.scale);
    },
});

var UpPipe = cc.Sprite.extend({

    ctor:function() {
        this._super();
        this.initWithFile("assets/upPipe.png");
        this.pass = false;
        this.expire = false;
    },
    onEnter:function() {
        this._super();
        var randY = Math.random()*40-30;
        this.setPosition(600,randY);

        //var moveAction= cc.MoveTo.create(4, new cc.p(-100,randY));

        //this.runAction(moveAction);
        this.scheduleUpdate();
    },
    update:function(dt){
        if(this.getPositionX()<cc.winSize.width - 50 && this.expire == false){
            this.expire = true;
            gameLayer.addPipe();
        }
        if(this.getPosition().x<-50 || ship.state == 0){
            gameLayer.removePipe(this);
            return;
        }
        var shipBoundingBox = ship.getCollideBox();
        var asteroidBoundingBox = this.getBoundingBox();
        if(dash){
            this.setPosition(this.getPosition().
                x-pipeSpeed*5,this.getPosition().y);
            dashTimer += dt;
            if (dashTimer >= dashDuration) {
                dash = false; // Kết thúc thời gian tạm thời vô hiệu hóa sự kiện touch
                dashTimer = 0;
            }
        }else{
            this.setPosition(this.getPosition().
                x-pipeSpeed,this.getPosition().y);
        }
        if(this.getPositionX() < 10 && this.pass == false){
            cc.audioEngine.playEffect("assets/score.wav");
            gameLayer.increaseScore();
            this.pass = true;
        }

        if(cc.rectIntersectsRect(shipBoundingBox,asteroidBoundingBox)){
            if(power){
                gameLayer.removePipe(this);
                cc.audioEngine.playEffect("assets/explosion.wav");
            }else {
                gameLayer.removePipe(this);
                cc.audioEngine.playEffect("assets/explosion.wav");
                gameLayer.restartGame();
                return;
            }
        }


    }
});

var DownPipe = cc.Sprite.extend({
    ctor:function() {
        this._super();
        this.initWithFile("assets/downPipe.png");
    },
    onEnter:function() {
        this._super();
        var randY = Math.random()*40+380;
        this.setPosition(600,randY);

        //var moveAction= cc.MoveTo.create(4, new cc.p(-100,randY));

        //this.runAction(moveAction);
        this.scheduleUpdate();
    },
    update:function(dt){
        if(this.getPosition().x<-50 || ship.state == 0){
            gameLayer.removePipe(this);
            return;
        }
        if(dash){
            this.setPosition(this.getPosition().
                x-pipeSpeed*5,this.getPosition().y);
            dashTimer += dt;
            if (dashTimer >= dashDuration) {
                dash = false; // Kết thúc thời gian tạm thời vô hiệu hóa sự kiện touch
                dashTimer = 0;
            }
        }else{
            this.setPosition(this.getPosition().
                x-pipeSpeed,this.getPosition().y);
        }
        var shipBoundingBox = ship.getCollideBox();
        var asteroidBoundingBox = this.getBoundingBox();
        if(cc.rectIntersectsRect(shipBoundingBox,asteroidBoundingBox)){
            if(power){
                gameLayer.removePipe(this);
                cc.audioEngine.playEffect("assets/explosion.wav");
            }else {
                gameLayer.removePipe(this);
                cc.audioEngine.playEffect("assets/explosion.wav");
                gameLayer.restartGame();
                return;
            }
        }

    }
});
