
function HashMap(draw, letters) {

    var slots = [];
    var items = [];

    var _slotWidth = 55;

    var _x = 20;
    var _y = 50;

    var _this = this;
    var _size = 0;

    var hasher = new HashFunction(draw, letters);

    hasher.element.move(225, 100).front();

    var _resizeThreshold = 0;



    this.put = function(key, value, done, is_internal){

        var k = new Key(draw, key);
        k.element.move(300, -50);

        hasher.element.front();

        Animator.animate(k).move(300, 100).after(function(){

            var hs = hasher.hash(key) % slots.length;
            k.setHash(hs.toString());
            
            Animator.animate(k).move(300, 190).after(function(){

                function _insert(i){

                    Animator.animate(k).move(_x + i*_slotWidth, 190).after(function(){
                        
                        if(items[i] === null){
                            items[i] = k;
                            _size++;
                            Animator.animate(k).move(_x + i*_slotWidth, 250).after(function(){
                                _checkResize(function(){
                                    if(done !== undefined)
                                        done();
                                    if(is_internal === undefined)
                                        SingleAction.finished();
                                });
                            });
                        }else if(i == (slots.length-1)){

                            Animator.animate(k).move(_x + (i+1) * _slotWidth, 190).after(function(){
                                Animator.animate(k).move(_x + (i+1) * _slotWidth, 300).after(function(){
                                    Animator.animate(k).move(_x - 50, 300).after(function(){
                                        Animator.animate(k).move(_x-50, 190).after(function(){
                                            _insert((i+1) % slots.length);
                                        });
                                    });
                                });
                            });
                        }else{
                            _insert((i+1) % slots.length);
                        }
                    });

                }

                _insert(hs);
                
            });
            
        });

    }


    this.get = function(key, value, done){

        var k = new SearchKey(draw, key);
        k.element.move(300, -50);

        hasher.element.front();

        Animator.animate(k).move(300, 100).after(function(){

            var hs = hasher.hash(key) % slots.length;
            k.setHash(hs.toString());
            Animator.animate(k).move(300, 190).after(function(){


                function _checkNext(i){
                    Animator.animate(k).move(_x + i*_slotWidth, 190).after(function(){
                        
                        if(items[i] === null){
                            Animator.animate(k).move(_x + i*_slotWidth, 250).after(function(){
                                k.highlightMiss()
                                Animator.animate(k).attr({opacity: 0}).after(function(){
                                    k.remove();
                                    SingleAction.finished();
                                });
                            });
                        }
                        else if(items[i].key == key){
                            Animator.animate(k).move(_x + i*_slotWidth, 250).after(function(){
                                k.highlightMatch()
                                Animator.animate(k).attr({opacity: 0}).after(function(){
                                    k.remove();
                                    SingleAction.finished();
                                });
                            });
                        }
                        else if(i == (slots.length-1)){

                            Animator.animate(k).move(_x + (i+1) * _slotWidth, 190).after(function(){

                                Animator.animate(k).move(_x + (i+1) * _slotWidth, 300).after(function(){

                                    Animator.animate(k).move(_x - 50, 300).after(function(){

                                        Animator.animate(k).move(_x-50, 190).after(function(){
                                            _checkNext((i+1) % slots.length);
                                        });
                                    });
                                });
                            });
                        }
                        else{
                            _checkNext((i+1) % slots.length);
                        }
                    });
                }
                _checkNext(hs);
                
            });
            
        });

    }


    function _checkResize(done){
        if(_size >= _resizeThreshold){
            _resize(done);
        }else if(done !== undefined)
            done();
    }

    function _setElements(size){

        for(var i=0; i < size; i++){
            var slot = new EmptySlot(draw, i.toString());
            slot.element.move(_x + i*_slotWidth, _y + 200);
            slots.push(slot);
            items.push(null);
        }
        _resizeThreshold = Math.floor(size * 2/3);

    }


    function _resize(done){

        function _doAfter(){
            var sl = slots;
            var it = items;

            _size = 0;

            slots = [];
            items = [];

            _setElements(sl.length*2);

            function _rehashNext(i){
                if(i == it.length){
                    if(done !== undefined)
                        done();
                    for(var i=0; i < sl.length; i++){

                        sl[i].element.remove();
                        if(it[i] !== null)
                            it[i].element.remove();

                    }
                }
                else if(it[i] == null){
                    _rehashNext(i+1);
                }
                else{
                    _this.put(it[i].key, it[i].key, function(){
                        _rehashNext(i+1);
                    }, true);
                }
            }

            _rehashNext(0);

        }

        for(var i=0; i < slots.length; i++){
            if(i == (slots.length -1)){
                Animator.animate(slots[i]).move(_x + i * _slotWidth, 400).after(function(){
                    _doAfter();
                });
            }else{
                Animator.animate(slots[i]).move(_x + i * _slotWidth, 400);
            }
            if(items[i] !== null){
                Animator.animate(items[i]).move(_x + i * _slotWidth, 400);
            }
        }


    }

    _setElements(16);

}




