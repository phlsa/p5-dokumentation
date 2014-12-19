

$.ajax({
  url: "./content/test.txt", 
  success: function(res) {
    console.log(String.split(res, "\n"));
    _.each( String.split(res, "\n"), function(item) {
      $('body').append( $('<canvas data-processing-sources="content/'+ item +'"></canvas>') );
    });
  },
  dataType: "text"
});

