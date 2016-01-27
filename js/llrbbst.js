 

var RED = true;
var BLACK = false;

function Node(draw, key, value, color){

    BaseNode.call(this, draw, key, value);
    this.color = color;

    var _this = this;

    this.getLineColor = function(){
        return _this.color ? "#f00" : "#333";
    }
}


function BST(draw){

    BaseBST.call(this, draw);

    var root = null;

    var _x = 500;
    var _y = 50;
    var _this = this;

    this.insert = function(value, after){
        var newNode = new Node(draw, value, value, RED);
        _insert(newNode, root, value, value, 0, 0, root, function(r){
            root = r
            _this._repositionNodes(root, _x, _y);
            if(after !== undefined)
                after();
            SingleAction.finished();
        });
    }

    function _insert(newNode, p, key, value, level, indent, parentNode, callback){

        if(p == null){
            if(parentNode !== null){
                newNode.moveAnimate(parentNode.x + indent*30, parentNode.y + 40, function(){
                    newNode.parentNode = parentNode;
                    callback(newNode);
                });
            }else{
                newNode.parentNode = parentNode;
                callback(newNode);
            }
            return;
        }

        p.highlight(true);
        setTimeout(function(){
            p.highlight(false);

            var cmp = compare(key, p.key);
            if(cmp == 0){
                p.value = cmp;
                p = _redCode(p);
                newNode.moveAnimate(p.x, p.y, function(){
                    newNode.remove();   
                });
                callback(p);
            }else if(cmp < 0){
                _insert(newNode, p.left, key, value, level+1, -1, p, function(r){
                    p.left = r    
                    p = _redCode(p);
                    callback(p);
                });
            }else{
                _insert(newNode, p.right, key, value, level+1, +1, p, function(r){
                    p.right = r    
                    p = _redCode(p);
                    callback(p);
                });
            }

        }, Animator.speed); // Use the animation speed as the Search speed

    }

    function _redCode(n){
        if(_isRed(n.right) && !_isRed(n.left)){
            n = _rotateLeft(n);
        }else if(_isRed(n.left) && _isRed(n.left.left)){
            n = _rotateRight(n);
        }
        if(_isRed(n.left) && _isRed(n.right)){
            _colorFlip(n);
        }
        return n
    }


    function _isRed(p){
        if(p === null){
            return false;
        }
        return p.color == RED;
    }

    function _rotateLeft(p){
        var x = p.right;
        p.right = x.left;
        x.left = p;
        x.color = x.left.color;
        x.left.color = RED;

        x.parentNode = p.parentNode
        p.parentNode = x;

        if(p.right !== null)
            p.right.parentNode = p;

        return x;
    }

    function _rotateRight(p){

        var x = p.left;
        p.left = x.right;
        x.right = p;
        x.color = x.right.color;
        x.right.color = RED;

        x.parentNode = p.parentNode
        p.parentNode = x;

        if(p.left !== null)
            p.left.parentNode = p;


        return x;
    }

    function _colorFlip(p){

        p.color = !p.color;
        p.left.color = !p.left.color;
        p.right.color = !p.right.color;
        return p;
    }

}

