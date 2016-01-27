


function FilledSlotLinked(draw){

    FilledSlot.call(this, draw);

    var _this = this;

    this.matchColor = "#d28d0d";

    this.highlightFound = function(is_highlighted){

        if(is_highlighted){
            _this.element.stroke({
                color: _this.matchColor,
                width: 10});
        }else{
            _this.element.stroke({
                color: _this.strokeColor,
                width: 0});
        }
    }

}


function LinkedList(draw){

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


    var items = [];

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

            Animator.all(items.slice(index).reverse(), function(el){
                el.attr({x:  pos-- * _slotSpacing});
            }, function(){
                Animator.animate(box).move(index*_slotSpacing, _slotInsidePos).after(function(){
                    SingleAction.finished(); 
                });   
                
            });

            items.splice(index, 0, box);
        }

        Animator.animate(box).move(index*_slotSpacing, _slotWaitPos).after(function(){
            _insert();
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
            Animator.all(items.slice(pos), function(el){
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

    this.getIndex = function(index, after, highlight){

        if(highlight === undefined)
            highlight = true;

        function _findIndex(i){
            if(i > 0)
                items[i-1].highlight(false);
            if(index == i){
                if(highlight){
                    items[index].highlightFound(true);
                    setTimeout(function(){
                        items[index].highlightFound(false);
                        SingleAction.finished(); 
                    }, 1000);
                }else{
                    items[index].highlight(true);
                    setTimeout(function(){
                        items[index].highlight(false);
                        if (after != undefined){
                            after(); 
                        }
                    }, 300);
                }
                return;
            }else{
                items[i].highlight(true);
            }

            setTimeout(function(){
                if(i < index){
                    _findIndex(i+1);
                }else{
                    items[index].highlight(false);
                }
            }, 300);

        }
        
        if(items.length != 0)
            _findIndex(0);
        else{
            if(highlight)
                SingleAction.finished(); 
            if(after !== undefined)
                after();
        }
    }

    this.getFirst = function(){

        if(items.length == 0){
            SingleAction.finished(); 
            return;
        }


        items[0].highlightFound(true);
        setTimeout(function(){
            items[0].highlightFound(false);
            SingleAction.finished(); 
        }, 1000);

    }

    this.getLast = function(){

        if(items.length == 0){
            SingleAction.finished(); 
            return;
        }

        items[items.length-1].highlightFound(true);
        setTimeout(function(){
            items[items.length-1].highlightFound(false);
            SingleAction.finished(); 
        }, 1000);

    }


    function _createItem(){
        var item = new FilledSlotLinked(draw);
        item.element.size(_slotWidth,_slotHeight)
            .move(-_slotWidth, _slotWaitPos);
        item.element.translate(_marginX, _marginY);
        return item;

    }

}




