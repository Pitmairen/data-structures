
function HashMap(draw, letters) {

    var slots = [];
    var items = [];

    var _slotWidth = 55;

    var _x = 20;
    var _y = 50;


    var hasher = new HashFunction(draw, letters);

    hasher.element.move(225, 100).front();

    for(var i=0; i < 15; i++){
        var slot = new EmptySlot(draw, i.toString());
        slot.element.move(_x + i*_slotWidth, _y + 200);
        slots.push(slot);
        items.push([]);
    }


    this.put = function(key, value, done){

        var k = new Key(draw, key);
        k.element.move(300, -50);


        hasher.element.front();

        Animator.animate(k).move(300, 100).after(function(){

            var hs = hasher.hash(key) % slots.length;
            k.setHash(hs.toString());
            
            Animator.animate(k).move(300, 190).after(function(){
                Animator.animate(k).move(_x + hs*_slotWidth,190).after(function(){
                    items[hs].push(k)
                    Animator.animate(k).move(_x + hs*_slotWidth,250 + 50*items[hs].length).after(function(){
                        SingleAction.finished();
                    });
                });
            });
            
        });

    }

    this.get = function(key, done){

        var k = new SearchKey(draw, key);
        k.element.move(300, -50);

        hasher.element.front();

        Animator.animate(k).move(300, 100).after(function(){

            var hs = hasher.hash(key) % slots.length;
            k.setHash(hs.toString());
            
            Animator.animate(k).move(300, 190).after(function(){

                Animator.animate(k).move(_x + hs*_slotWidth,190).after(function(){


                    function _checkNext(i){
                        Animator.animate(k).move(_x + hs*_slotWidth, 250 + 50*(i+1)).after(function(){
                            if(items[hs].length == i){
                                k.highlightMiss()
                                Animator.animate(k).attr({opacity: 0}).after(function(){
                                    k.remove();
                                    SingleAction.finished();
                                });
                            }else if(items[hs][i].key == key){
                                k.highlightMatch()
                                Animator.animate(k).attr({opacity: 0}).after(function(){
                                    k.remove();
                                    SingleAction.finished();
                                });
                            }else{
                                _checkNext(i+1);
                            }
                        });
                    }

                    _checkNext(0);

                });

                
            });
            
        });

    }


}

