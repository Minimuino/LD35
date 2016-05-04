Clouds.Game = function(game)
{
    this.cloudTypes = ['cloud1', 'cloud2', 'cloud3', 'cloud4', 'cloud5'];
    this.nTypes = 4;
    this.clouds = [];
    this.cursor;
    this.moveKeys;
};

Clouds.Game.prototype = {

    create: function()
    {
        this.stage.backgroundColor = "#9ce3f7";

        for (var i = 0; i<11; i++)
        {
            this.clouds.push(new Clouds.Cloud(this, Clouds.getX(Math.random()*100)-100,
                Clouds.getY(Math.random()*100), this.cloudTypes[Clouds.rand(0, this.nTypes)],
                Clouds.rand(1, 16), 0));
        }

        this.cursor = this.add.sprite(100, 100, 'cursor', 0);
        this.cursor.anchor.setTo(0.5, 1);
        this.moveKeys = {
            up: this.input.keyboard.addKey(Phaser.KeyCode.W),
            down: this.input.keyboard.addKey(Phaser.KeyCode.S),
            right: this.input.keyboard.addKey(Phaser.KeyCode.D),
            left: this.input.keyboard.addKey(Phaser.KeyCode.A)
        };
        this.input.mouse.mouseDownCallback = this.clickCallback;

        var music = this.add.audio('music', 1, true);
        music.play();

        // Random cloud generation
        this.timer = this.time.events.loop(Phaser.Timer.SECOND*5, this.cloudCallback, this);
    },



    update: function()
    {
        // Controls
        var angle = this.physics.arcade.angleToPointer(this.cursor);
        this.cursor.rotation = 1.5 + angle;

        if (this.moveKeys.up.isDown)
        {
            this.cursor.y -= 5;
        }
        else if (this.moveKeys.down.isDown)
        {
            this.cursor.y += 5;
        }
        if (this.moveKeys.left.isDown)
        {
            this.cursor.x -= 5;
        }
        else if (this.moveKeys.right.isDown)
        {
            this.cursor.x += 5;
        }

        for (c in this.clouds)
        {
            var cl = this.clouds[c];

            // Wind
            if (this.input.activePointer.leftButton.isDown)
            {
                if (cl.sprite.overlap(this.cursor))
                {
                    cl.blow(angle);
                }
                else
                {
                    cl.unblow();
                }

            }
            else
            {
                cl.unblow();
            }

            cl.sprite.mask.x = cl.sprite.x;
            cl.sprite.mask.y = cl.sprite.y;

            // Kill old clouds
            if ((cl.sprite.x > 970) || (cl.sprite.x < -550)
                || (cl.sprite.y < -300) || (cl.sprite.y > 550))
            {
                cl.sprite.mask.destroy();
                cl.sprite.destroy();
                this.clouds.splice(c, 1);
            }

        }
    },
/*
    render: function()
    {
        this.game.debug.text("Clouds: " + this.physics.arcade.angleToPointer(this.cursor), 300, 132);
    },
*/

    cloudCallback: function()
    {
        this.clouds.push(new Clouds.Cloud(this, -520,
            Clouds.getY(Math.random()*100), this.cloudTypes[Clouds.rand(0, this.nTypes)],
            Clouds.rand(1, 16), 0));
    }
};

Clouds.Cloud = function(context, x, y, name, v0, resistence)
{
    this.context = context;
    this.sprite = context.add.sprite(x, y, name, 0);
    this.sprite.alpha = Clouds.rand(0, 100);
    this.reductionFactor = {xl: 0, xr:0, yu:0, yd: 0};
    this.sprite.mask = this.generateMask(this.sprite, this.reductionFactor);

    this.v0 = v0;
    context.physics.arcade.enable(this.sprite);
    this.sprite.body.velocity.x = v0;
    this.resistence = Clouds.rand(0, 15);
};

Clouds.Cloud.prototype.blow = function(angle)
{
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    this.sprite.body.acceleration.x = 20*cos-this.resistence;
    this.sprite.body.acceleration.y = 20*sin-this.resistence;
    if (Math.random() > 0.98)
    {
        this.sprite.alpha += 1;
    }
    if (cos < 0)
    {
        this.reductionFactor.xr += -(cos)/2;
    }
    else
    {
        this.reductionFactor.xl += cos/2;
    }
    if (sin < 0)
    {
        this.reductionFactor.yu += -(sin)/2;
    }
    else
    {
        this.reductionFactor.yd += sin/2;
    }

    this.sprite.mask.destroy();
    this.sprite.mask = this.generateMask(this.sprite, this.reductionFactor);
};

Clouds.Cloud.prototype.unblow = function()
{
    this.sprite.body.acceleration.setTo(0, 0);
    if (this.sprite.body.velocity.x > this.v0+2)
    {
        this.sprite.body.velocity.x -= 1;
    }
    if (this.sprite.body.velocity.x < this.v0-2)
    {
        this.sprite.body.velocity.x += 1;
    }
    if (this.sprite.body.velocity.y > 2)
    {
        this.sprite.body.velocity.y -= 1;
    }
    if (this.sprite.body.velocity.y < -2)
    {
        this.sprite.body.velocity.y += 1;
    }
};

Clouds.Cloud.prototype.generateMask_new = function(sprite, r)
{
    var mask = this.context.add.graphics(sprite.x, sprite.y);
    mask.height = sprite.height;
    mask.width = sprite.width;
    mask.beginFill(0xffffff);
    return mask;
}

Clouds.Cloud.prototype.generateMask = function(sprite, r)
{
    var mask = this.context.add.graphics(sprite.x, sprite.y);
    mask.height = sprite.height;
    mask.width = sprite.width;
    mask.beginFill(0xffffff);
    //mask.arc(sprite.width/2, sprite.height, 1.4*sprite.height-r, 3.1416, 0);
    mask.drawCircle(sprite.width/2, sprite.height/3, 0.75*sprite.height-r.yd);
    mask.drawCircle(sprite.width/2, 2*sprite.height/3, 0.75*sprite.height-r.yu);
    mask.drawCircle(sprite.width/3, sprite.height/2, 0.85*sprite.width-r.xl);
    mask.drawCircle(2*sprite.width/3, sprite.height/2, 0.85*sprite.width-r.xr);
    return mask;
}