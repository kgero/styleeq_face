
var examples = [
  "It was a dark and stormy night; the rain fell in torrents—except at occasional intervals, when it was checked by a violent gust of wind.",
  "The sky above the port was the color of television, tuned to a dead channel.",
  "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife."
  ];

var control_types = [
  ['length', 'total # words'],
  ['conjunction', '# conjunctions'],
  ['punctuation', '# punctuation'],
  ['allPreposition', '# prepositions'],
  ['anyPerson', '# pronouns'],
  ['determiner', '# determiners'],
  ['negation', '# negations']
  ];

var pivot_obj;


function transfer_fromgenre(genre) {
  var text_in = $('.text-in').val();
  console.log('text_in', text_in);
  $('.original').empty().append(text_in);

  // get pivots
  var endpoint = 'http://0.0.0.0:5000/styleeq/api/v1.0/getpivots';
  var data = {'sources': [text_in], 'genre': genre, 'num_pivots': 3};
  $('.pivots-div').empty();
  $('.transfers-div').empty();
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
      pivot_obj = resp1;

      for (var i = 0; i < resp1.pivots[0].length; i++) {
        var pivot = resp1.pivots[0][i].original;
        add_pivot(pivot);
        add_pivot_controls(resp1, i);
      }
      
      transfer_frompivots(resp1);
      
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

function transfer_frompivots(pivot_obj) {
  $('.transfers-div').empty();
  $('.transfer-loader').show();

  $.ajax({
    url:'http://0.0.0.0:5000/styleeq/api/v1.0/frompivots',
    type:"POST",
    data:JSON.stringify(pivot_obj),
    contentType:"application/json",
    dataType:"json",
    success: function(resp2){
      $('.transfer-loader').hide();
      console.log('frompivots response:', resp2);

      for (var i = 0; i < resp2.outputs[0].transfers.length; i++) {
        var transfer = resp2.outputs[0].transfers[i].transfer;
        add_transfer(transfer);
      }
      
    },
    error: function(err) {
      $('.transfer-loader').hide();
      $('.transfer').append("Error.");
      console.log('frompivots error:', err);
    }
  });

}

function add_pivot(text) {
  var pivot_div = $("<div />").addClass('alert').addClass('alert-secondary');
  pivot_div.text(text);
  $(".pivots-div").append(pivot_div);
}

function add_pivot_controls(pivot_obj, index) {
  
  var rowDiv = $("<div />").addClass('form-row');
  for (var i = 0; i < 4; i++) {
    var label = control_types[i][1];
    var feature = control_types[i][0];
    var thisDiv = $("<div />").addClass('col-md-3 mb-3');
    var lab = $("<label />").addClass('col-form-label-sm').text(label);
    var input = $("<input>")
      .addClass('form-control form-control-sm p' + index.toString())
      .attr('id', feature)
      .val(pivot_obj.pivots[0][index].controls[feature]);
    thisDiv.append(lab).append(input);
    rowDiv.append(thisDiv);
  }
  $(".pivots-div").append(rowDiv);

  var rowDiv = $("<div />").addClass('form-row');
  for (var i = 4; i < 7; i++) {
    var label = control_types[i][1];
    var feature = control_types[i][0];
    var thisDiv = $("<div />").addClass('col-md-3 mb-3');
    var lab = $("<label />").addClass('col-form-label-sm').text(label);
    var input = $("<input>")
      .addClass('form-control form-control-sm p' + index.toString())
      .attr('id', feature)
      .val(pivot_obj.pivots[0][index].controls[feature]);
    thisDiv.append(lab).append(input);
    rowDiv.append(thisDiv);
  }
  var thisDiv = $("<div />").addClass('col-md-3 mb-3');
  var lab = $("<label />").addClass('col-form-label-sm').text("");
  var btn = $("<button />")
    .addClass('btn btn-sm btn-primary regenerate')
    .attr('id', index)
    .text('regenerate')
    .click( function() {
      var pivot_indx = $(this).attr('id');
      console.log('pivot_indx', pivot_indx);
      var pclass = '.p' + pivot_indx;
      $(pclass).each( function (i, obj) {
        var feat = $(this).attr('id');
        var val = parseInt($(this).val(), 10);
        pivot_obj.pivots[0][pivot_indx].controls[feat] = val;
      });
      console.log('new pivot_obj', pivot_obj);
      transfer_frompivots(pivot_obj);
    });
  thisDiv.append(lab).append(btn);
  rowDiv.append(thisDiv);
  $(".pivots-div").append(rowDiv);
}

function add_transfer(text) {
  var transfer_div = $("<div />").addClass('alert').addClass('alert-success');
  transfer_div.text(text);
  $(".transfers-div").append(transfer_div);
}


$(document).ready( function() {

    $.each(examples, function (i, val) {
        var text = $("<small/>").text(val);
        var ex = $("<a/>")
            .addClass('dropdown-item')
            .attr('id', i)
            .append(text);
        $('.dropdown-menu').append(ex);
    });

    $(".dropdown-item").click(function() {
        var id = $(this).attr('id');
        var text = examples[id];
        $('.text-in').val(text);
    });

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
