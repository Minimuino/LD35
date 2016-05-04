var Clouds = {

    // Global variables
    WIDTH: 900,
    HEIGHT: 540,

    // Receives an x position in % and returns the absolute value.
    getX: function(percent)
    {
        return this.WIDTH * (percent/100);
    },
    // Receives an y position in % and returns the absolute value.
    getY: function(percent)
    {
        return this.HEIGHT * (percent/100);
    },
    rand: function(low, high)
    {
        return Math.floor(Math.random()*(high-low+1)+low);
    }
};

Clouds.Boot = function(game) {};

Clouds.Boot.prototype = {

    preload: function()
    {

    },

    create: function()
    {
        this.input.maxPointers = 1;
        // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        // this.scale.setScreenSize(true);
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.state.start('Preloader');
    }
};
