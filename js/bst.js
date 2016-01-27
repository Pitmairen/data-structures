
function Node(draw, key, value){

    BaseNode.call(this, draw, key, value);
}

function BST(draw){

    BaseBST.call(this, draw);

    var _this = this;
    var root = null;

    var _x = 500;
    var _y = 50;

    this.insert = function(value, after){

        var newNode = new Node(draw, value, value);

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

                newNode.moveAnimate(p.x, p.y, function(){
                    newNode.remove();   
                });
                callback(p);
            }else if(cmp < 0){
                _insert(newNode, p.left, key, value, level+1, -1, p, function(r){
                    p.left = r    
                    callback(p);
                });
            }else{
                _insert(newNode, p.right, key, value, level+1, +1, p, function(r){
                    p.right = r    
                    callback(p);
                });
            }

        }, Animator.speed); // Use the animation speed as the Search speed

    }

}


