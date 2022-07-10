$(document).ready(function(){

  initSliders();

  //NOTE: To append in different container
  var appendToContainer = function(htmlele, record){
    console.log(record)
  };

//This function counts how many items remain after filtering
  var afterFilter = function(result, jQ){
    $('#total_movies').text(result.length);

    var checkboxes  = $("#outline_criteria :input:gt(0)");
    checkboxes.each(function(){
      var c = $(this), count = 0

      if(result.length > 0){
        count = jQ.where({ '#outline_criteria': c.val() }).count;
      }
      c.next().text(c.val() + '(' + count + ')')
    });


    // var checkboxes_IS  = $("#certificate_criteria :input:gt(0)");

    // checkboxes_IS.each(function(){
    //   var c = $(this), count = 0

    //   if(result.length > 0){
    //     count = jQ.where({ '#certificate_criteria': c.val() }).count;
    //   }
    //   c.next().text(c.val() + '(' + count + ')')
    // });

    // var director  = $("#director :input:gt(0)");

    // director.each(function(){
    //   var c = $(this), count = 0

    //   if(result.length > 0){
    //     count = jQ.where({ '#director': c.val() }).count;
    //   }
    //   c.next().text(c.val() + '(' + count + ')')
    // });
  }



  // =========================================================== 

  var FJS = FilterJS(movies, '#movies', {
    template: '#movie-template',
    search: { ele: '#searchbox' },
    // search: {ele: '#searchbox', fields: ['runtime']}, // With specific fields
    callbacks: {
      afterFilter: afterFilter 
    },
    
  });

  // var FJS = FilterJS(movies, '#movies', {
  //   template: '#movie-template',
  //   search: {ele: '#searchbox'},
  //   //search: {ele: '#searchbox', fields: ['runtime']}, // With specific fields
  //   callbacks: {
  //     afterFilter: function(result){
  //       $('#total_movies').text(result.length);
  //     }
  //   }
    //appendToContainer: appendToContainer
    //filter_on_init: true
  // });

  FJS.addCallback('beforeAddRecords', function(){
    if(this.recordsCount >= 450){
      this.stopStreaming();
    }
  });

  FJS.addCallback('afterAddRecords', function(){
    var percent = (this.recordsCount - 250)*100/250;

    $('#stream_progress').text(percent + '%').attr('style', 'width: '+ percent +'%;');

    if (percent == 100){
      $('#stream_progress').parent().fadeOut(1000);
    }
  });

  FJS.setStreaming({
    data_url: 'data/stream_movies.json',
    stream_after: 1,
    batch_size: 50
  });

  // FJS.addCriteria({field: 'year', ele: '#year_filter', type: 'range', all: 'all'});
  // FJS.addCriteria({field: 'rating', ele: '#rating_filter', type: 'range'});
  // FJS.addCriteria({field: 'runtime', ele: '#runtime_filter', type: 'range'});
  FJS.addCriteria({field: 'outline', ele: '#outline_criteria input:checkbox'});
  FJS.addCriteria({field: 'certificate', ele: '#certificate_criteria input:checkbox'});
  FJS.addCriteria({field: 'director', ele: '#director input:checkbox'});
  FJS.addCriteria({field: 'genre', ele: '#genre input:checkbox'});

  /*
   * Add multiple criterial.
    FJS.addCriteria([
      {field: 'genre', ele: '#outline_criteria input:checkbox'},
      {field: 'year', ele: '#year_filter', type: 'range'}
    ])
  */

  window.FJS = FJS;
});

function initSliders(){
  $("#rating_slider").slider({
    min: 8,
    max: 10,
    values:[8, 10],
    step: 0.1,
    range:true,
    slide: function( event, ui ) {
      $("#rating_range_label" ).html(ui.values[ 0 ] + ' - ' + ui.values[ 1 ]);
      $('#rating_filter').val(ui.values[0] + '-' + ui.values[1]).trigger('change');
    }
  });

  $("#runtime_slider").slider({
    min: 50,
    max: 250,
    values:[0, 250],
    step: 10,
    range:true,
    slide: function( event, ui ) {
      $("#runtime_range_label" ).html(ui.values[ 0 ] + ' mins. - ' + ui.values[ 1 ] + ' mins.');
      $('#runtime_filter').val(ui.values[0] + '-' + ui.values[1]).trigger('change');
    }
  });

  $('#outline_criteria :checkbox').prop('checked', true);
  $('#all_models').on('click', function(){
    $('#outline_criteria :checkbox').prop('checked', $(this).is(':checked'));
  });

//Inter. Style
  $('#certificate_criteria :checkbox').prop('checked', true);
  $('#all_IS').on('click', function(){
    $('#certificate_criteria :checkbox').prop('checked', $(this).is(':checked'));
  });


  //director
  $('#director :checkbox').prop('checked', true);
  $('#all_director').on('click', function(){
    $('#director :checkbox').prop('checked', $(this).is(':checked'));
  });

  // all interaction type
  $('#genre :checkbox').prop('checked', true);
  $('#all_genres').on('click', function(){
    $('#genre :checkbox').prop('checked', $(this).is(':checked'));
  });

 
}
