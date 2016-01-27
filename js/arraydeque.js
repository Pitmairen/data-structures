

function Position(draw, color){
    var triangle = draw.polygon('0,0 25,0 12,25').fill(color).stroke({ width: 1 });
    this.element = triangle;
}


function ArrayDeque(draw, initialCapacity){

    var _slotWidth = 25;
    var _slotHeight = 20;

    var _slotSpacing = _slotWidth + 20;

    var _paddingY = 15;
    var _paddingX = 15;
    var _size = 0;

    var _slotSpacingV = 30;

    var _slotWaitPos = _slotSpacingV;
    var _slotInsidePos = _slotSpacingV*2;
    var _slotCopyPos = _slotSpacingV*4;
    var _marginX = 10;
    var _marginY = 10;

    var _headPos = new Position(draw, "#0CF55E");
    var _tailPos = new Position(draw, "#F57F18");

    _headPos.element.translate(_marginX, _marginY);
    _tailPos.element.translate(_marginX, _marginY);
    _tailPos.element.rotate(180);


    var slots = [];
    var items = [];

    var _this = this;

    var _head = 0;
    var _tail = 0;


    this.addFirst = function(){
        _head = (_head - 1) & (slots.length - 1);
        _insertItem(_head);
    }

    this.addLast = function(){
        _insertItem(_tail);
        _tail = (_tail + 1) % slots.length;
    }

    this.removeFirst = function(){
        if(_size == 0){
            SingleAction.finished(); 
            return;
        }
        _removeItem(_head);
        _head = (_head + 1) & (slots.length - 1);
    }

    this.removeLast = function(){
        if(_size == 0){
            SingleAction.finished(); 
            return;
        }
        _tail = (_tail - 1) & (slots.length - 1);
        _removeItem(_tail);
    }

    this.size = function(){
        return items.length;
    }

    function _insertItem(index){

        var box = _createItem();
        Animator.animate(box).move(index*_slotSpacing, _slotWaitPos).after(function(){
            _updateMarkers(50, 150);
            Animator.animate(box).move(index*_slotSpacing, _slotInsidePos).after(function(){
                items[index] = box;
                _size++;
                if(_size == slots.length){
                    _setCapacity(slots.length*2);
                }else{
                    SingleAction.finished(); 
                }
            });   
        });

    }

    function _removeItem(index){
        var box = items[index];
        Animator.animate(box).move(index*_slotSpacing, _slotWaitPos).after(function(){
            items[index] = null;
            _size--;
            _updateMarkers(50);
            Animator.animate(box).attr({opacity: 0}).after(function(){
                box.element.remove();
                SingleAction.finished(); 
            });

        });
    }


    function _updateMarkers(yPos, speed){
        _updateHeadMarker(yPos, speed);
        _updateTailMarker(yPos, speed);
    }

    function _updateHeadMarker(yPos, speed){
        yPos = yPos || 50
        speed = speed || 150
        yPos -= 20;

        Animator.animate(_headPos).move((_head)*_slotSpacing, yPos);  
    }

    function _updateTailMarker(yPos, speed){
        yPos = yPos || 50
        speed = speed || 150
        yPos += 35;
        Animator.animate(_tailPos).move(-1*((_tail) & (slots.length-1))*_slotSpacing, -yPos);   
    }


    function _createSlot(){
        var slot = new EmptySlot(draw);
        slot.element.size(_slotWidth, _slotHeight).back();
        slot.element.translate(_marginX, _marginY);
        return slot;

    }
    function _createItem(){
        var item = new FilledSlot(draw);
        item.element.size(_slotWidth,_slotHeight)
            .move(-_slotWidth, _slotWaitPos);
        item.element.translate(_marginX, _marginY);
        return item;

    }
    
    function _setCapacity(cap, callback){

        var new_slots = [];
        var new_items = [];

        var initialY = _slotCopyPos;
        if (items.length == 0)
            initialY = _slotInsidePos;


        for(var i=0; i < cap; i++){
            var slot = _createSlot();
            slot.element.move(new_slots.length*_slotSpacing, initialY);
            new_slots.push(slot);
            new_items.push(null);
        }

        if (_size == 0){
            slots = new_slots;
            _updateMarkers(50)
            return;
        }


        var p = _head;
        var n = items.length;
        var r = n - p;
        var its = items.slice(p, p + r);
        its = its.concat(items.slice(0, p));
        _head = 0;
        _tail = n;
        _updateHeadMarker(110, 500);
        var i = 0;
        Animator.sequencial(its, function(it){
            it.attr({x: _slotSpacing*i, y:_slotCopyPos});
            new_items[i] = its[i];
            i++;
        }, function(){

            Animator.all(slots, function(el){
                el.attr({x: -(_slotSpacing) - _paddingX});

            }, function(){

                slots = new_slots;
                _updateMarkers(50, 500);
                Animator.all(items, function(it){
                    it.attr({y: _slotInsidePos});
                });
                Animator.all(slots, function(it){
                    it.attr({y: _slotInsidePos});
                }, function(){
                    if(callback !== undefined)
                        callback();
                    SingleAction.finished(); 
                });
                items = new_items;
            });
        });
    }


    _setCapacity(initialCapacity || 8);

}





