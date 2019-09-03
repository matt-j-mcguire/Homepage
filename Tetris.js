/*jshint esversion: 6 */

class shape {
    constructor() {
        this.shapetype = Math.floor(Math.random() * 7); //random shape 0 to 6 
        this.rotation = 0;
        //this.pt = new point(Math.floor((PLAYWIDTH - 4) / 2), PLAYHEIGHT);//bottom left of cluster, based on tilesize
        this.block = [new block(), new block(), new block(), new block()];


        var c = 'black';
        switch (this.shapetype) {
            case 0://square
                c = 'rgb(244,242,1)';//yellow
                break;
            case 1://line
                c = 'rgb(1,241,240)';//light blue
                break;
            case 2://s-left
                c = 'rgb(6,239,7)';//Lime
                break;
            case 3://s-right
                c = 'rgb(228,0,1)';//red
                break;
            case 4://L
                c = 'rgb(240,160,3)';//orange
                break;
            case 5://backwards L
                c = 'rgb(2,0,233)';//blue
                break;
            case 6://T
                c = 'rgb(159,0,240)';//purple
                break;
        }
        for (i = 0; i < 4; i++) {
            this.block[i].color = c;
        }

        this.setlocation(Math.floor((PLAYWIDTH - 4) / 2), PLAYHEIGHT);
    }

    //causes a rotation of the blocks
    rotate() {
        this.rotation = (this.rotation + 1) % (LAYOUTS[this.shapetype].length);

        this.setlocation(this.leftest() - 1, this.lowest());
    }

    setlocation(x = 0, y = 0) {
        let p = LAYOUTS[this.shapetype][this.rotation];

        for (let i = 0, j = 0; i < 16; i++) {
            if ((1 << i) & p) {
                this.block[j].pt = new point(x + (i % 4), y + (Math.floor(i / 4)));
                j++;
            }
        }
    }

    size() {
        var t = 100;
        var b = 0;
        var l = 100;
        var r = 0;

        for (i = 0; i < 4; i++) {
            var p = this.block[i].pt;
            if (p.x < l) l = p.x;
            if (p.x > r) r = p.x;
            if (p.y < t) t = p.y;
            if (p.y > b) b = p.y;
        }
        return new size(r - l + 1, b - t + 1);

    }

    //returns int of lowest block
    lowest() {
        var l = PLAYHEIGHT;
        for (i = 0; i < 4; i++) {
            if (this.block[i].pt.y < l) l = this.block[i].pt.y;
        }
        return l;
    }

    //returns the left most block
    leftest() {
        var l = PLAYWIDTH;
        for (i = 0; i < 4; i++) {
            if (this.block[i].pt.x < l) l = this.block[i].pt.x;
        }
        return l;
    }

    rightest() {
        var l = 0;
        for (i = 0; i < 4; i++) {
            if (this.block[i].pt.x > l) l = this.block[i].pt.x;
        }
        return l;

    }

    move(x = 0, y = 0) {
        for (i = 0; i < 4; i++) {
            this.block[i].pt.x += x;
            this.block[i].pt.y += y;
        }
    }
}


class block {
    constructor(color = 'red', pt = new point(0, 0)) {
        this.color = color;
        this.pt = pt;
    }
}

class point {
    constructor(x = -1, y = -1) {
        this.x = x;
        this.y = y;
    }

    clear() {
        this.x = -1;
        this.y = -1;
    }

    isvalid() {
        return this.x > -1 || this.y > -1;
    }

}

class size {
    constructor(w = 0, h = 0) {
        this.w = w;
        this.h = h;
    }
}


class button {
    /**
     * creates a enw rectangle
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} w 
     * @param {Number} h 
     * @param {number} row
     */
    constructor(x, y, w, h, row, callback) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.row = row;
        this.isMouseOver = false;
        this.isMouseDown = false;
        this.callback = callback;
    }

    /**
     * returns true if the point is with in the rec
     * @param {point} pt 
     */
    contains(pt) {
        return pt.x >= this.x && pt.x <= this.x + this.w && pt.y >= this.y && pt.y <= this.y + this.h;
    }



}

const PLAYWIDTH = 10;
const PLAYHEIGHT = 20;
const TITLESIZEPX = 20;
const LAYOUTS = [
    [51],//square
    [240, 8738],//line
    [99, 306],//s-left
    [54, 561],//s-right
    [116, 1570, 368, 547],//L
    [1604, 1136, 550, 1808],//backwards L
    [114, 610, 624, 562]//T
];

var _blocks = [[block.prototype]]; //back buffer
_blocks.pop();
for (i = 0; i < PLAYHEIGHT + 4; i++) {
    var sb = [null];
    for (j = 0; j < PLAYWIDTH - 1; j++) {
        sb.push(null);
    }
    _blocks.push(sb);
}

var _mycanvas = HTMLCanvasElement.prototype;    //html canvas control
var _crc = CanvasRenderingContext2D.prototype;  //2d rendering context interface
var _mypreview = HTMLCanvasElement.prototype;   //html canvas control
var _crp = CanvasRenderingContext2D.prototype;  //2d rendering context interface
var _mybuttons = HTMLCanvasElement.prototype;   //html canvas control
var _crb = CanvasRenderingContext2D.prototype;  //2d rendering context interface
var _running = false;                           //state of the timer
var _shape = shape.prototype;                  //current shape on the screen
var _nxtshape = shape.prototype;               //next shape comming up
var _ticker;
var _score = 0;
var _gamestate = true;
var _speed = 500;


var _btnNew = new button(2, 10, 32, 32, 0, new_game);
var _btnplay = new button(40, 10, 32, 32, 1, playpause);
var _btnup = new button(20, 60, 32, 32, 2, rotate);
var _btnleft = new button(2, 100, 32, 32, 3, moveleft);
var _btnright = new button(40, 100, 32, 32, 4, moveright);
var _btndown = new button(20, 140, 32, 32, 5, movedown);
var _btnaudio = new button(60, 240, 16, 16, -1, startstopaudio);//special
var _btns = [_btnNew, _btnplay, _btnup, _btnleft, _btnright, _btndown, _btnaudio];
var _btnsimg;

var mouse = function (e) {                        //convert the mouse coords to current scale and location
    var rect = _mybuttons.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var sclx = _mybuttons.width / _mybuttons.clientWidth; //get a ratio
    var scly = _mybuttons.height / _mybuttons.clientHeight;
    return new point(x * sclx, y * scly);
};

function setupPanel(id = '', preview = '') {
    _mycanvas = document.getElementById(id);
    _crc = _mycanvas.getContext("2d");
    _mypreview = document.getElementById(preview);
    _crp = _mypreview.getContext("2d");
    _mybuttons = document.getElementById('buttons');
    _crb = _mybuttons.getContext("2d");
    _btnsimg = document.getElementById('allbuttons');

    _mypreview.width = TITLESIZEPX * 4;
    _mypreview.height = TITLESIZEPX * 4;
    _mycanvas.width = PLAYWIDTH * TITLESIZEPX;
    _mycanvas.height = PLAYHEIGHT * TITLESIZEPX;
    _shape = new shape();
    _nxtshape = new shape();
    Timer(true, _speed);

    document.onkeydown = function (event) {
        switch (event.keyCode) {
            case 37: //left
                moveleft();
                break;
            case 38: //up
                rotate();
                break;
            case 39: //right
                moveright();
                break;
            case 40: //down
                movedown();
                break;
            case 32: //space
                playpause();
                break;
            case 113:
                new_game();
                break;
        }
    };




    _mybuttons.onmousemove = function (event) {
        _crb.clearRect(0, 0, _mybuttons.width, _mybuttons.height);
        var pt = mouse(event);
        for (let i = 0; i < _btns.length; i++) {
            _btns[i].isMouseOver = _btns[i].contains(pt);
            drawbutton(_btns[i]);
        }
    };

    _mybuttons.onmousedown = function (event) {
        _crb.clearRect(0, 0, _mybuttons.width, _mybuttons.height);
        var pt = mouse(event);
        for (let i = 0; i < _btns.length; i++) {
            _btns[i].isMouseDown = _btns[i].contains(pt);
            drawbutton(_btns[i]);
        }
    };

    _mybuttons.onmouseup = function (event) {
        _crb.clearRect(0, 0, _mybuttons.width, _mybuttons.height);
        for (let i = 0; i < _btns.length; i++) {
            if (_btns[i].isMouseDown) {
                _btns[i].callback();
                _btns[i].isMouseDown = false;
            }
            drawbutton(_btns[i]);
        }

    };

    //needed a slight delay to get the images on the screen
    setInterval(function () {
         _crb.clearRect(0, 0, _mybuttons.width, _mybuttons.height);
        for (let i = 0; i < _btns.length; i++) {
            drawbutton(_btns[i]);
        }
    }, 250);



}

function rotate() {
    if (_shape != null && _running) {
        _shape.rotate();

        while (_shape.leftest() < 0) {
            _shape.move(1, 0);
        }
        while (_shape.rightest() > PLAYWIDTH - 1) {
            _shape.move(-1, 0);
        }

    }
}

function playpause() {
    Timer(!_running);
}

//check for left wall or blocks
function moveleft() {
    if (can_move_to(-1, 0) && _running) {
        _shape.move(-1, 0);
        animate();
    }
}

//check for right wall or blocks
function moveright() {
    if (can_move_to(1, 0) && _running) {
        _shape.move(1, 0);
        animate();
    }
}

//push to the bottom until we hit floor or another block
function movedown() {
    while (can_move_to(0, -1) && _running) {
        _shape.move(0, -1);
        animate();
    }
}

//used with timer, returns true if bottom or block was hit
function oneDown() {
    if (can_move_to(0, -1)) {
        _shape.move(0, -1);
    }
}

//returns true if the spot it still open
//returns false if not, and if it hits an
//existing block, it is over with and copies
//this block to the buffer. x,y are offsets 
//from the current block 
function can_move_to(x = 0, y = 0) {
    if (_shape != null) {
        for (i = 0; i < 4; i++) {
            var p = new point(_shape.block[i].pt.x + x, _shape.block[i].pt.y + y);

            if (p.x < 0) return false;
            if (p.x == PLAYWIDTH) return false;
            if (y == 0 && _blocks[p.y][p.x] != null) return false;

            if (p.y < 0 || _blocks[p.y][p.x] != null) {
                //copy the blocks to the buffer
                for (j = 0; j < 4; j++) {
                    _blocks[_shape.block[j].pt.y][_shape.block[j].pt.x] = _shape.block[j];
                }
                check_for_full_row();
                check_for_game_over();
                _shape = _nxtshape;
                _nxtshape = new shape();
                return false;
            }
        }
        return true;
    }
    return false;
}

function check_for_full_row() {
    for (i = 0; i < PLAYHEIGHT; i++) {
        var fnd = true;
        for (j = 0; j < PLAYWIDTH; j++) {
            if (_blocks[i][j] == null) {
                fnd = false;
                break;
            }
        }
        if (fnd) {
            _score++;
            for (j = 0; j < PLAYWIDTH; j++) {
                _blocks[i][j] = null;
            }
            for (k = i + 1; k < PLAYHEIGHT; k++) {
                var sw = _blocks[k - 1];//empty row
                _blocks[k - 1] = _blocks[k];
                for (j = 0; j < PLAYWIDTH; j++) {
                    if (_blocks[k - 1][j] != null) _blocks[k - 1][j].pt.y--;
                }
                _blocks[k] = sw;
            }

        }
    }
}

function check_for_game_over() {
    if (_shape.lowest() >= PLAYHEIGHT) {
        _gamestate = false;
        Timer(false);
    }
}

function new_game() {
    for (i = 0; i < PLAYHEIGHT; i++) {
        for (j = 0; j < PLAYWIDTH; j++) {
            _blocks[i][j] = null;
        }
    }
    _score = 0;
    _shape = new shape();
    _nxtshape = new shape();
    _gamestate = true;
    _speed = 500;
    Timer(true, _speed);


}


//updates the logic
function Timer(run = true, interval = 500) {
    clearInterval(_ticker);
    _running = run;
    if (run) {
        _ticker = setInterval(function () {
            oneDown();
            animate();
            draw_preview();

            document.getElementById('score').innerHTML = 'Score:' + _score;
        }, interval);
    }
    else {
        animate("Paused"); //forces the paused title on the screen
    }

}

function getbackimage() {
    var index = Math.floor(_score / 10);
    index = index % 5;

    //also adjust timer for ever 10 lines
    var n = Math.floor(_score / 10);
    n = 500 - n * 25;
    if (n < 50) n = 50;
    if (_speed != n) {
        Timer(_running, n);
        _speed = n;
    }

    return 'backpng' + index;
}

//draws all the graphics on the screen
function animate(message = '') {
    var img = document.getElementById(getbackimage());
    var pt = _crc.createPattern(img, "repeat");
    _crc.fillStyle = pt;
    _crc.fillRect(0, 0, _mycanvas.width, _mycanvas.height);

    if (_shape != null) {
        for (i = 0; i < 4; i++) {
            draw_block(_shape.block[i], _crc);
        }
    }

    for (i = 0; i < PLAYHEIGHT; i++) {
        for (j = 0; j < PLAYWIDTH; j++) {
            if (_blocks[i][j] != null) {
                draw_block(_blocks[i][j], _crc);
            }
        }
    }

    if (message.length > 0 || !_gamestate) {
        if (!_gamestate) message = "Game Over";
        _crc.font = "30px Arial ";
        var xx = _crc.measureText(message);
        var x = (PLAYWIDTH * TITLESIZEPX - xx.width) / 2;
        var y = (PLAYHEIGHT * TITLESIZEPX - 30) / 2;
        _crc.fillStyle = 'rgba(0,0,0,0.4)';
        _crc.fillRect(0, 0, PLAYWIDTH * TITLESIZEPX, PLAYHEIGHT * TITLESIZEPX);
        _crc.fillStyle = '#ffffff';
        _crc.fillText(message, x, y);
    }


}

function drawbutton(btn) {
    if (btn.row > -1) {
        if (btn.isMouseDown) {
            _crb.drawImage(_btnsimg, 64, btn.row * 32, 32, 32, btn.x, btn.y, btn.w, btn.h);
        }
        else if (btn.isMouseOver) {
            _crb.drawImage(_btnsimg, 32, btn.row * 32, 32, 32, btn.x, btn.y, btn.w, btn.h);
        }
        else {
            _crb.drawImage(_btnsimg, 0, btn.row * 32, 32, 32, btn.x, btn.y, btn.w, btn.h);
        }
    }
    else {
        var img = document.getElementById('audiobtn');
        _crb.fillStyle = 'rgba(100,100,100,0.5)';
        if (btn.isMouseOver) _crb.fillRect(btn.x, btn.y, btn.w, btn.h);
        _crb.drawImage(img, btn.x, btn.y, btn.w, btn.h);
    }

}

function draw_block(b = block.prototype, cp = CanvasRenderingContext2D.prototype, zero = false) {
    cp.fillStyle = b.color;
    var p = point_to_pixels(b.pt);
    if (zero) p = point_to_pixels(new point(b.pt.x - 3, b.pt.y - 3));
    cp.fillRect(p.x + 1, p.y + 1, TITLESIZEPX - 1, TITLESIZEPX - 1);

    cp.strokeStyle = 'white';
    cp.beginPath();
    cp.moveTo(p.x + TITLESIZEPX, p.y);
    cp.lineTo(p.x, p.y);
    cp.lineTo(p.x, p.y + TITLESIZEPX);
    cp.stroke();

    cp.strokeStyle = 'black';
    cp.beginPath();
    cp.moveTo(p.x + TITLESIZEPX - 1, p.y);
    cp.lineTo(p.x + TITLESIZEPX - 1, p.y + TITLESIZEPX - 1);
    cp.lineTo(p.x, p.y + TITLESIZEPX - 1);
    cp.stroke();
}

function draw_preview() {
    var img = document.getElementById(getbackimage());
    var pt = _crp.createPattern(img, "repeat");
    _crp.fillStyle = pt;
    _crp.fillRect(0, 0, _mypreview.width, _mypreview.height);
    var sz = _nxtshape.size();
    sz = new size(sz.w * TITLESIZEPX, sz.h * TITLESIZEPX);
    _crp.translate((_mypreview.width - sz.w) / 2, (_mypreview.height - sz.h) / 2);

    if (_nxtshape != null) {
        for (i = 0; i < 4; i++) {
            draw_block(_nxtshape.block[i], _crp, true);
        }
    }
    _crp.setTransform(1, 0, 0, 1, 0, 0);
}

/* #region coord converters */
//converts game coords to screen pixels
function point_to_pixels(pt = new point(0, 0)) {
    return new point(pt.x * TITLESIZEPX, (PLAYHEIGHT - 1 - pt.y) * TITLESIZEPX);
}

//converts screen pixels to game coords
function pixels_to_point(pt = new point(0, 0)) {
    return new point(Math.floor(pt.x / TITLESIZEPX), PLAYHEIGHT - 1 - Math.floor(pt.y / TITLESIZEPX));
}
/* #endregion */


function dim(id) {
    id.style.opacity = 0.5;
}

function full(id) {
    id.style.opacity = 1;
}

function startstopaudio() {
    var player = document.getElementById("msc");
    var btn = document.getElementById("audiobtn");
    if (player.paused == false) {
        player.pause();
        btn.src = "source/noaudio.png";
    } else {
        player.play();
        btn.src = "source/audio.png";
    }
}



////////////////////////////////////////////////////
const QUADWIDTH = 4;
const QUADHEIGHT = 4;
const QUADSIZEPX = 20;
var currvalue = 0;
var mycanvas;
var ctx;
var lbloutput;


function clearquad() {
    currvalue = 0;
    lbloutput.value = '0';
    redraw();
}

function setvalue(){
    try{
        currvalue = Number(lbloutput.value);
    }catch(ex){
        currvalue = 0;
        lbloutput.value = 0;
    }
    redraw();
}

function setupQuad(id = 'mycanvas', lbl = 'lblval') {
    var movelast = -1;
    mycanvas = document.getElementById(id);
    lbloutput = document.getElementById(lbl);

    ctx = mycanvas.getContext("2d");
    mycanvas.width = QUADWIDTH * QUADSIZEPX;
    mycanvas.height = QUADHEIGHT * QUADSIZEPX;
    redraw();

    mycanvas.onmousedown = function (event) {
        if (event.buttons == 1) {
            var pos = getsqr(event.offsetX, event.offsetY);
            currvalue = currvalue ^ (1 << pos);
            lbloutput.value = currvalue;
            movelast = pos;
            redraw();
        }
    };

    mycanvas.onmousemove = function (event) {
        if (event.buttons == 1) {
            var pos = getsqr(event.offsetX, event.offsetY);
            if (pos != movelast) {
                currvalue = currvalue ^ (1 << pos);
                lbloutput.value = currvalue;
                movelast = pos;
                redraw();
            }
        }
        else {
            movelast = -1;
        }
    };

}

function redraw() {
    ctx.fillStyle = 'rgba(200,200,200,1)';
    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);
    for (i = 0; i < 16; i++) {
        if (currvalue & (1 << i)) {
            var x = (i % 4) * QUADSIZEPX;
            var y = Math.floor(i / 4) * QUADSIZEPX;
            ctx.fillRect(x, y, QUADSIZEPX, QUADSIZEPX);
        }

    }

    ctx.strokeStyle = 'rgba(0,0,0,1';
    ctx.lineWidth = 0.2;
    ctx.beginPath();
    for (i = 1; i < 4; i++) {
        ctx.moveTo(QUADSIZEPX * i, 0);
        ctx.lineTo(QUADSIZEPX * i, 400);
        ctx.moveTo(0, QUADSIZEPX * i);
        ctx.lineTo(400, QUADSIZEPX * i);
    }
    //ctx.closePath();
    ctx.stroke();

}

function getsqr(x = 0, y = 0) {
    var c = Math.floor(x / QUADSIZEPX);
    var r = Math.floor(y / QUADSIZEPX) * 4;
    return c + r;
}

