
function Key(draw, key){

    var group = draw.group();

    this.key = key;
    this.circ = draw.circle(50, 50).fill("#fa0");
    this.label = draw.text(key).move(25, 14);

    group.add(this.circ);
    group.add(this.label);

    this.label.font({
              family: 'sans-serif'
            , size: 14
            , anchor: 'middle'
            , weight: 'bold'
            , leading: 1
            });


    this.element = group;

    var _this = this;

    this.setHash = function(h){
        _this.hash = draw.text(h).move(25, 34);
        _this.hash.font({
                  family: 'sans-serif'
                , size: 14
                , weight: 'bold'
                , anchor: 'middle'
                , leading: 1
                });
        group.add(this.hash);
    }
}


function SearchKey(draw, key){

    Key.call(this, draw, key);

    this.circ.fill('#48C1F5');

    this.remove = function(){
        this.element.remove();
    }
    this.highlightMiss = function(){
        this.circ.fill('#F52A2A');
    }
    this.highlightMatch = function(){
        this.circ.fill('#56F517');
    }

}

function EmptySlot(draw, nr){

    var group = draw.group();

    this.element = group;

    var rect = draw.rect(50, 50).fill("#aaa");
    var label = draw.text(nr).move(25, 25);

    label.font({
              family: 'sans-serif'
            , size: 14
            , anchor: 'middle'
            , weight: 'bold'
            , leading: 1
            });

    group.add(rect);
    group.add(label); 

}


function HashFunction(draw, letters){

    var group = draw.group();

    this.rect = draw.rect(200, 50).fill("#D8E0E1");

    this.label = draw.text("Hash Function").move(100, 25);

    this.label.font({
              family: 'sans-serif'
            , size: 14
            , anchor: 'middle'
            , weight: 'bold'
            , leading: 1
            });

    group.add(this.rect);
    group.add(this.label);

    this.element = group;

    var hashes = {};

    for(var i=0; i < letters.length; i++){
        hashes[letters[i]] = getRandomInt(0, 200);
    }

    this.hash = function(value){
        return hashes[value];
    }

}

