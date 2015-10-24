(function () {

    var width, height, canvas, ctx, circles, animateHeader = true;

    // Main
    initHeader();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;

        canvas = document.getElementById('smooth_animation');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create particles
        circles = [];
        for (var x = 0; x < height * 0.25; x++) {
            var c = new Circle();
            circles.push(c);
        }
        animate();
    }

    // Event handling
    function addListeners() {
        window.addEventListener('scroll',scroll);
        window.addEventListener('resize', resize);
    }
    
    function scroll() {
        if (document.body.scrollTop > height)
            animateHeader = false;
        else
            animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function animate() {
        if (animateHeader) {
            ctx.clearRect(0, 0, width, height);
            for (var i in circles) {
                circles[i].draw();
            }
        }
        requestAnimationFrame(animate);
    }

    // Canvas manipulation
    function Circle() {
        var _this = this;

        // constructor
        (function () {
            _this.pos = {};
            _this.dest = {};
            _this.velocity = {};
            init();
        })();

        function init() {
            _this.pos.x = width;
            _this.pos.y = Math.random() * height;

            _this.velocity.x = -Math.random();
            _this.alpha = 0.1 + Math.random() * 0.3;
            _this.scale = 0.1 + Math.random() * 0.3;

        }

//        function newDest() {
//            _this.dest.x = Math.random() * width;
//            _this.dest.y = Math.random() * height;
//
//
//            var stepFactor = (Math.random() + 1) * 3;
//            _this.velocity.x = (_this.pos.x - _this.dest.x) / (Math.abs(_this.pos.x - _this.dest.x) * stepFactor);
//            _this.velocity.y = (_this.pos.y - _this.dest.y) / (Math.abs(_this.pos.y - _this.dest.y) * stepFactor);
//        }


        this.draw = function () {
            if (_this.alpha <= 0) {
                init();
            }

            _this.pos.x += _this.velocity.x;
//            _this.pos.y += _this.velocity.y;

            _this.alpha -= 0.0005;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.scale * 10, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(255,255,255,' + _this.alpha + ')';
            ctx.fill();
        };

    }

})();