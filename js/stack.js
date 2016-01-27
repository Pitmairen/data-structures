



function BaseItem(draw){

    this.element = draw.rect(100, 100).attr({ fill: '#f06' });



}

FilledSlot.prototype = Object.create(BaseItem);

function FilledSlot(draw){

    BaseItem.call(this, draw);

    var _this = this;

    this.highlight = function(is_highlighted){

        if(is_highlighted){
            _this.element.stroke({
                color: '#389CDF',
                width: 10});
        }else{
            _this.element.stroke({
                color: 'none',
                width: 0});
        }
    }

}




function Animator(speed, easing){

    speed = speed || 150;
    easing = easing || '=';

    this.sequencial = function(items, modifier, after){
        var its = items.slice(0);
        function _next(i){
            if(i < its.length){
                var ani = its[i].element.animate(speed, easing);
                modifier(ani);
                ani.after(function(){_next(i+1)});
            }else if(after !== undefined){
                after();
            }
        }
        _next(0);
    }

    this.all = function(items, modifier, after){
        var its = items.slice(0);
        if(its.length == 0){
            after();
            return;
        }
        for(var i in its){
            var ani = its[i].element.animate(speed, easing);
            modifier(ani);

            if(i == (its.length-1) && after !== undefined){
                ani.after(after);
            }
        }
    }


}

function LinkedList(draw){

    var _slotWidth = 25;
    var _slotHeight = 20;

    var _slotSpacing = _slotWidth + 20;

    var _itemColor = '#d06';

    var _paddingY = 15;
    var _paddingX = 15;

    var _slotSpacingV = 30;

    var _slotWaitPos = _slotSpacingV;
    var _slotInsidePos = _slotSpacingV*2;
    var _slotCopyPos = _slotSpacingV*4;


    var items = [];

    var _this = this;


    function _createItem(){
        var item = new FilledSlot(draw);
        item.element.size(_slotWidth,_slotHeight)
            .move(-_slotWidth, _slotWaitPos)
            .fill(_itemColor).stroke('none');
        return item;

    }


    this.addItem = function(){

        _this.insertItem(items.length);
    }


    this.size = function(){
        return items.length;
    }

    this.insertItem = function(index){

        var box = _createItem();

        function _insert(){ 
            var pos = items.length;

            var anim = new Animator(150);

            anim.all(items.slice(index).reverse(), function(el){

                el.attr({x:  pos-- * _slotSpacing});
            }, function(){
                box.element.animate(150).move(index*_slotSpacing, _slotInsidePos);   
            });

            items.splice(index, 0, box);
        }

        box.element.animate(180).move(index*_slotSpacing, _slotWaitPos).after(function(){

                    _insert();
            });

    }


    this.removeItemEnd = function(){

        if(items.length == 0)
            return;

        var box = items.pop();

        box.element.animate(150).attr({opacity: 0}).after(function(){box.element.remove();});
    }


    this.removeIndex = function(index){

        var box = items[index];
        // .splice(index, 1)[0];

        function _remove(){ 

            var anim = new Animator(150);

            var pos = index+1;

            anim.all(items.slice(pos), function(el){

                el.attr({x:  (pos-1) * _slotSpacing});
                pos++;
            });

            items.splice(index, 1);
        }

        box.element.animate(200).attr({y: _slotWaitPos, opacity:0}).after(function(){
            box.element.remove();

            _remove();
        });

    }


    this.getIndex = function(index){

        function _findIndex(i){

            if(i > 0)
                items[i-1].highlight(false);

            items[i].highlight(true);

            setTimeout(function(){
                if(i != index){
                    _findIndex(i+1);
                }else{
                    items[index].highlight(false);
                }
            }, 500);

        }

        _findIndex(0);

    }


}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


var draw = SVG('scene');

var list = new LinkedList(draw);

$('#push').on('click', function(){
    list.insertItem(0);
});
$('#pop').on('click', function(){
    list.removeIndex(0);
});



