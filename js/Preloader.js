Clouds.Preloader = function(game) {

};

Clouds.Preloader.prototype = {

    preload: function() {
        this.load.spritesheet('cloud1', 'assets/image/cloud1.png', 190, 96);
        this.load.spritesheet('cloud2', 'assets/image/cloud2.png', 423, 222);
        this.load.spritesheet('cloud3', 'assets/image/cloud3.png', 307, 162);
        this.load.spritesheet('cloud4', 'assets/image/cloud4.png', 385, 88);
        this.load.spritesheet('cloud5', 'assets/image/cloud5.png', 450, 226);
        this.load.spritesheet('cursor', 'assets/image/cursor.png', 30, 120);
        this.load.audio('music', 'assets/sound/music2.ogg');
    },

    create: function() {
        this.state.start('Game');
    }
};
