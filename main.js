cc.game.onStart = function(){
    cc.view.setDesignResolutionSize(413, 320, cc.ResolutionPolicy.SHOW_ALL);                                                          // là set kích thước canvas
    cc.LoaderScene.preload(["assets/background.png", "assets/bird.png"], function () {
        cc.director.runScene(new gameScene());
        }, this);
};
cc.game.run();
console.log("hello");
var background;
var gameLayer;
var scrollSpeed = 1;
var ship;
var gameGravity = -0.05;
var gameThrust = 0.1;


