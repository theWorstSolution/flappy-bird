var WelcomeLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        // Hiển thị nền màu trắng
        var background = new cc.LayerColor(cc.color(255, 255, 255));
        this.addChild(background);

        // Hiển thị dòng chữ chào mừng
        var label = new cc.LabelTTF("Welcome to Flappy Bird", "Arial", 36);
        label.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        label.setColor(cc.color(0, 0, 0)); // Màu chữ
        this.addChild(label);

        return true;
    },
    onEnter: function () {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                cc.director.runScene(new GameScene());
                return true;
            }
        }, this);
    }
});

var PauseLayer = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new WelcomeLayer();
        this.addChild(layer);

    }
});