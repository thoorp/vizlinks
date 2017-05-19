var downloadComponent = Vue.component("download", {
    
    template : '<button class="btn btn-default" v-on:click="downloadSVG"><span class="glyphicon glyphicon-download-alt"></span></button>',
    
    props : ['params', 'getEndpointForSearch', 'searchNodes'],
    
    methods : {
        downloadSVG: function () {
            $.ajax({
                url: this.getEndpointForSearch(this.searchNodes[0].value),
                type: "get",
                headers: {
                    Accept: this.params.acceptHeader,
                },                  
                data: this.params,
                success: function (result) {
                    var blob = new Blob([result.documentElement], {
                        type: "application/xml+svg;charset=utf-8"
                    });
                    saveAs(blob, "vizdots.svg");
                },
                error: function (xhr) {
                    //Do Something to handle error
                }
            });
        }        
    }
});
