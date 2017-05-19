var pencilComponent = Vue.component("pencil", {
    template : '<button class="btn btn-default" v-on:click="toggleNotes"><span class="glyphicon glyphicon-blackboard"></span></button>'+
               '<span class="tools">'+
               '<a href="#notes_sketch" data-tool="marker" style="color: #333;"><button class="btn btn-default"><span class="glyphicon glyphicon-pencil"></span></button></a>'+
               '<a href="#notes_sketch" data-tool="eraser" style="color: #333;"><button class="btn btn-default"><span class="glyphicon glyphicon-erase"></span></button></a>'+
               '</span>',
    methods : {
        toggleNotes : function(){
            if($('#notes_sketch').css('zIndex') === '3') {
                $('#notes_sketch').css('zIndex', '-1');
            }else{
                $('#notes_sketch').css('zIndex', '3');
            }   
        }
    }
});