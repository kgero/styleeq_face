
function transfer_fromgenre(genre) {
  var text_in = $('.text-in').val();
  console.log('text_in', text_in);
  $('.original').empty().append(text_in);

  // get pivots
  var endpoint = 'http://0.0.0.0:5000/styleeq/api/v1.0/getpivots';
  var data = {'sources': [text_in], 'genre': genre, 'num_pivots': 2};
  $('.pivot').empty();
  $('.transfer').empty();
  $('.pivot-loader').show();
  $('.transfer-loader').show();
  $.ajax({
    url:endpoint,
    type:"POST",
    data: JSON.stringify(data),
    contentType:"application/json",
    dataType:"json",
    success: function(resp1){
      $('.pivot-loader').hide();
      
      console.log('getpivots response:', resp1);
      var pivot = resp1.pivots[0][0].original;
      console.log("pivot", pivot);
      $('.pivot').append(pivot);
      
      $.ajax({
        url:'http://0.0.0.0:5000/styleeq/api/v1.0/frompivots',
        type:"POST",
        data:JSON.stringify(resp1),
        contentType:"application/json",
        dataType:"json",
        success: function(resp2){
          $('.transfer-loader').hide();
          console.log('frompivots response:', resp2);
          var transfer = resp2.outputs[0].transfers[0].transfer;
          $('.transfer').append(transfer);
        },
        error: function(err) {
          $('.transfer-loader').hide();
          $('.transfer').append("Error.");
          console.log('frompivots error:', err);
        }
      });
    },
    error: function(err) {
      $('.pivot-loader').hide();
      $('.transfer-loader').hide();
      $('.pivot').append("Error.");
      $('.transfer').append("Pivot error.");
      console.log('getpivots error:', err);
    }
  });
}


$(document).ready( function() {

  console.log('booting up...');
  $('.pivot-loader').hide();
  $('.transfer-loader').hide();
  $('.pivot-shown').hide();

  $('.make-gothic').click( function() {
    console.log('hit button');
    transfer_fromgenre('gothic'); 
  });

  $('.make-scifi').click( function() {
    console.log('hit button');
    transfer_fromgenre('scifi'); 
  });

  $('.make-phil').click( function() {
    console.log('hit button');
    transfer_fromgenre('philosophy'); 
  });

  $('.show-pivot').click( function() {
    console.log("hit button");
    $('.pivot-hidden').hide();
    $('.pivot-shown').show();
  });

  $('.hide-pivot').click( function() {
    console.log("hit button");
    $('.pivot-hidden').show();
    $('.pivot-shown').hide();
  });

});
