


function ArrayList(draw, initialCapacity){

    var _slotWidth = 25;
    var _slotHeight = 20;
    var _slotSpacing = _slotWidth + 20;
    var _paddingY = 15;
    var _paddingX = 15;

    var _slotSpacingV = 30;

    var _slotWaitPos = _slotSpacingV;
    var _slotInsidePos = _slotSpacingV*2;
    var _slotCopyPos = _slotSpacingV*4;

    var _marginX = 10; 
    var _marginY = 10;


    var slots = []; // Free slots
    var items = []; // Filled Slots

    var _this = this;

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

            Animator.sequencial(items.slice(index).reverse(), function(el){
                el.attr({x:  pos-- * _slotSpacing});
            }, function(){
                Animator.animate(box).move(index*_slotSpacing, _slotInsidePos);   
                SingleAction.finished();
            });

            items.splice(index, 0, box);
        }

        Animator.animate(box).move(index*_slotSpacing, _slotWaitPos).after(function(){
            if(items.length == slots.length){
                _setCapacity(slots.length*2, _insert);
            }else{
                _insert();
            }
        });
    }


    this.removeItemEnd = function(){
        if(items.length == 0){
            SingleAction.finished();
            return;
        }
        var box = items.pop();
        Animator.animate(box).attr({opacity: 0}).after(function(){
            box.element.remove();
            SingleAction.finished();
        });
    }


    this.removeIndex = function(index){
        if(items.length == 0){
            SingleAction.finished();
            return;
        }

        var box = items[index];
        function _remove(){ 
            var pos = index+1;
            Animator.sequencial(items.slice(pos), function(el){
                el.attr({x:  (pos-1) * _slotSpacing});
                pos++;
            }, function(){
                SingleAction.finished();
            });
            items.splice(index, 1);
        }

        Animator.animate(box).attr({y: _slotWaitPos, opacity:0}).after(function(){
            box.element.remove();
            _remove();
        });

    }


    this.getIndex = function(index){
        if(items.length == 0){
            SingleAction.finished();
            return;
        }
        slots[index].highlight(true);
        setTimeout(function(){
            SingleAction.finished();
            slots[index].highlight(false);
        }, 500);
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
        var new_slots = []

        var initialY = _slotCopyPos;
        if (items.length == 0)
            initialY = _slotInsidePos;


        for(var i=0; i < cap; i++){
            var slot = _createSlot();
            slot.element.move(new_slots.length*_slotSpacing, initialY);
            new_slots.push(slot);
        }

        if (items.length == 0){
            slots = new_slots;
            return;
        }



        Animator.sequencial(items, function(it){
            it.attr({y:_slotCopyPos});
        }, function(){

            Animator.all(slots, function(el){
                el.attr({x: -(_slotSpacing) - _paddingX});

            }, function(){

                slots = new_slots;
                Animator.all(items, function(it){
                    it.attr({y: _slotInsidePos});
                });
                Animator.all(slots, function(it){
                    it.attr({y: _slotInsidePos});
                }, callback);
            });
        });
    }



    _setCapacity(initialCapacity || 4);
}

