
function BaseSlot(draw){
    this.element = draw.rect(100, 100).attr({
        fill: this.fillColor,
        stroke : this.strokeColor});

    this.highlight = function(is_highlighted){

        if(is_highlighted){
            this.element.stroke({
                color: this.highlightColor,
                width: 10});
        }else{
            this.element.stroke({
                color: this.strokeColor,
                width: 1});
        }
    }
}


function FilledSlot(draw){
    this.fillColor = '#f06';
    this.strokeColor = '#f06';
    this.highlightColor = '#389CDF';
    BaseSlot.call(this, draw);
}

function EmptySlot(draw){
    this.fillColor = 'none';
    this.strokeColor = '#aaa';
    this.highlightColor = '#389CDF';
    BaseSlot.call(this, draw);
}


