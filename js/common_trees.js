

function BaseNode(draw, key, value){

    var group = draw.group();

    this.element = group;

    this.circ = draw.circle(30, 30).attr({ fill: '#f06' });
    this.label = draw.text(value.toString()).move(15, 15);

    group.add(this.circ);
    group.add(this.label);

    this.line = draw.line(0, 0, 1, 1).stroke({fill: "#333", width:3}).back();
    this.lineColor = '#333';

    this.label.font({
              family: 'sans-serif'
            , size: 12
            , anchor: 'middle'
            , leading: 1
            });

    this.key = key
    this.value = value;
    this.left = null;
    this.right = null;
    this.parentNode = null;
    this.x = 0;
    this.y = 0;


    var _this = this;

    this.getLineColor = function(){
        return _this.lineColor;
    }

    this.remove = function(){
        group.remove();
        _this.line.remove();
    }

    this.move = function(x, y){
        _this.x = x;
        _this.y = y;
        _this.element.center(x, y);
        if(_this.parentNode !== null){
            var col = _this.getLineColor();
            _this.line.attr({stroke: col, x1: x, y1: y, x2: _this.parentNode.element.cx(),
            y2: _this.parentNode.element.cy()});
        }else{
            _this.line.attr({stroke: 'none'});
        }

    }

    this.moveAnimate = function(x, y, after){
        _this.x = x;
        _this.y = y;
        Animator.animateEl(this.element).center(x, y).after(function(){
            if(after !== undefined)
                after(); 
        });

        if(_this.parentNode !== null){
            var col = _this.getLineColor();
            Animator.animateEl(_this.line).during(function(pos){
                _this.line.attr({stroke: col,x1: _this.element.cx(), y1: _this.element.cy(), x2: _this.parentNode.element.cx(),
                y2: _this.parentNode.element.cy()});
            });
        }else{
            Animator.animateEl(_this.line).during(function(pos){
                _this.line.attr({x1: _this.element.cx(), y1: _this.element.cy(),
                    x2: _this.element.cx(), y2: _this.element.cy()});
            });
        }

    }


    this.highlight = function(high){

        if(high)
            Animator.animateEl(_this.circ).stroke({color: "#19C1EB", width: 6});
        else
            Animator.animateEl(_this.circ).stroke({color: "none", width: 0});


    }
}




function BaseBST(){

    this.root = null;
    var _this = this;

    this._repositionNodes = function(n, startingX, startingY){
        _repositionNodes(n, startingX, startingY);
    }



    function _resize(p){
        if (p == null) {
            return 0;
        }
        p.leftWidth = Math.max(_resize(p.left), 30);
        p.rightWidth = Math.max(_resize(p.right), 30);
        return p.leftWidth + p.rightWidth;
    }


    // The repositioning code is adapted from https://www.cs.usfca.edu/~galles/visualization/BST.html
    function _repositionNodes(root, startingX, startingY){

        _resize(root);

        if(root != null){

            if(root.leftWidth > startingX){
                startingX = root.leftWidth;
            }else if(root.rightWidth > startingX){
                startingX = Math.max(root.leftWidth,
                        2 * startingX - root.rightWidth);
            }
            _updatePositions(root, startingX, startingY, 0);

        }
    }


    function _updatePositions(p, xPos, yPos, side){

        if (p != null)
        {
            if (side == -1)
            {
                xPos = xPos - p.rightWidth;
            }
            else if (side == 1)
            {
                xPos = xPos + p.leftWidth;
            }

            p.moveAnimate(xPos, yPos);

            _updatePositions(p.left, xPos, yPos + 40, -1)
            _updatePositions(p.right, xPos, yPos + 40, 1)
        }


    }

}



function compare(a, b){
    if ( a < b )
      return -1;
    if ( a > b )
      return 1;
    return 0;
}



function insertRandom(bst, i){
    SingleAction.setGlobalLock(true);
    bst.insert(getRandomInt(0, 500), function(){
        if(i < 30){
            insertRandom(bst, i+1);
        }else{
            SingleAction.setGlobalLock(false);
        }
    });
}

function insertOrdered(bst, i){
    SingleAction.setGlobalLock(true);
    bst.insert(i, function(){
        if(i < 30){
            insertOrdered(bst, i+1);
        }else{
            SingleAction.setGlobalLock(false);
        }
    });
}

