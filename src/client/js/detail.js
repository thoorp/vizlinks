var detailComponent = Vue.component("detail", {
    template : '<button class="btn btn-default" v-on:click="detailed"><span class="glyphicon glyphicon-th"></span></button>'+
                '<button class="btn btn-default" v-on:click="highlevel"><span class="glyphicon glyphicon-th-large"></span></button>',
    props : ['params', 'getSVG'],
    methods : {
        highlevel: function () {
            this.params.view = 'highlevel';
            this.getSVG();
        },
        detailed: function () {
            this.params.view = 'detailed';
            this.getSVG();
        }
    }
});