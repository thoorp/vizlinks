var downloadComponent = Vue.component("download", {
    
    template : '<button class="btn btn-default" v-on:click="downloadSVG"><span class="glyphicon glyphicon-download-alt"></span></button>',
    
    props : ['params', 'getEndpointForSearch', 'searchNodes'],
    
    methods : {
        downloadSVG: function () {
            $.ajax({
                url: this.getEndpointForSearch(this.searchNodes[0].value),
                type: "get",
                headers: {
                    Accept: "application/svg+xml"
                },                  
                data: this.params,
                success: function (result) {
                    var blob = new Blob([result], {
                        type: "application/svg+xml;charset=utf-8"
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
