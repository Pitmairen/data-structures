

var Animator = new function(){

    this.speed = 150;
    this.easing = '=';

    var _this = this;

    this.sequencial = function(items, modifier, after){

        var its = items.slice(0);
        function _next(i){
            if(i < its.length){
                var ani = _this.animate(its[i]);
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
        if(its.length == 0 && after !== undefined){
            after();
            return;
        }
        for(var i in its){
            var ani = _this.animate(its[i]);
            modifier(ani);
            if(i == (its.length-1) && after !== undefined){
                ani.after(after);
            }
        }
    }


    this.animate = function(el){
        return el.element.animate(this.speed);
    }

    this.animateEl = function(el){
        return el.animate(this.speed);
    }

}



// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}



// http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {

  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



// Create navigation menu
(function($){

    function create_menu(){
        var f = $('<form>');
        var m = $('<select name="menu-select">');
        m.append(create_entry('Data Structure:', ''));
        f.append(m);
        $('.menu').append(f);
            m.change(function(){
                if($(this).val().length > 0)
                    document.location = $(this).val();
        });
        return m;
    }

    function create_entry(name, link){
        var li = $('<option>');
        li.text(name);
        li.attr('value', link);
        return li;
    }
    function create_animation_speed_menu(){
        var f = $('<form>');
        var m = $('<select name="speed-select">');
        m.append(create_entry('Animation Speed:', 150));
        f.append(m);
        $('.menu').append(f);
            m.change(function(){
                if($(this).val().length > 0)
                    Animator.speed = parseInt($(this).val());
        });
        
        for(var i=0; i <= 1000; i += 50){
            m.append(create_entry(i, i));
        }

        return m;
    }


    var m = create_menu();

    m.append(create_entry('ArrayList', 'arraylist.html'));
    m.append(create_entry('LinkedList', 'linked-list.html'));
    m.append(create_entry('Stack: LinkedList', 'stack_linked.html'));
    m.append(create_entry('Stack: DynamicArray', 'stack_array.html'));
    m.append(create_entry('Queue: LinkedList', 'queue_linked.html'));
    m.append(create_entry('Queue: DynamicArray', 'queue_array.html'));
    m.append(create_entry('ArrayDeque', 'arraydeque.html'));
    m.append(create_entry('HashMap: Separate Chaining', 'hashmap_chaining.html'));
    m.append(create_entry('HashMap: Open Addressing', 'hashmap_open_addr.html'));
    m.append(create_entry('BST', 'bst.html'));
    m.append(create_entry('Red Black Tree', 'llrbbst.html'));


    create_animation_speed_menu();

})($);



// Used to prevent multiple actions to be preformed at the same time
// which causes some bugs because of animations. This will prevent 
// the user from clicking a new action link until the current animation 
// is done.
var SingleAction = new function(){

    var _running = false;
    var _globalLock = false;

    this.start = function(){
        _running = true;
    }
    this.finished = function(){
        _running = false;
    }
    this.isRunning = function(){
        return _running || _globalLock;
    }
    this.setGlobalLock = function(isOn){
       _globalLock = isOn; 
    }
}

$('a').on('click', function(e){
    if($(this).data('external')){
        return;
    }

    if(!SingleAction.isRunning()){
        SingleAction.start();
    }
    else{
        e.stopImmediatePropagation();
    }
    return false;
});


