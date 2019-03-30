/** Results **/

function drawResults(searchResults){

    var $inputs = $('#userForm :input');

    // not sure if you wanted this, but I thought I'd add it.
    // get an associative array of just the values.
    var values = {};
    var names = [];
    var airports = [];
    var fromDate = "";
    var toDate = "";
    $inputs.each(function() {
        values[this.name] = $(this).val();


        if(this.name.includes("name")){
            names.push($(this).val());
        }
        if(this.name.includes("airport")){
            airports.push($(this).val());
        }

        if(this.name.includes("fromDate")){
            var x = new Date($(this).val());
            var day = x.getDate();
            var month = x.getMonth()+1;
            var year = x.getFullYear();
            fromDate=day+"/"+month+"/"+year;
        }

        if(this.name.includes("toDate")){
            var x = new Date($(this).val());
            var day = x.getDate();
            var month = x.getMonth()+1;
            var year = x.getFullYear();
            toDate=day+"/"+month+"/"+year;
        }
    });

    var requestURL = "http://localhost:8080/flights?dateFrom="+fromDate+"&dateTo="+toDate+"&origins="+airports;

    $.getJSON(requestURL, function( data ) {
        var items = [];
        var results = "";
        var count = 0;

        $.each( data, function( key, val ) {
            if(count < 4){
                var resultList = [];
                var resultSet = [];
                var userCount = 0;
                for(var i=0;i<val.length;i++){
                    if(!resultList.includes(val[i].cityFrom)){
                        resultList.push(val[i].cityFrom);
                        val[i].user = names[userCount++];
                        resultSet.push(val[i]);
                    }
                }

                function compare(a,b) {
                  if (a.price < b.price)
                    return -1;
                  if (a.price > b.price)
                    return 1;
                  return 0;
                }
                resultSet.sort(compare);

                console.log(resultSet);
                count++;

                var price = 0;
                for(var i=0;i<resultSet.length;i++){
                    price += resultSet[i].price;
                }
                results += '<div class="card" style="width: 22rem; margin:10px; text-align: center"><div class="card-header"><b>'+key+ ' (' + price + '€)' + '</b></div>';

                for(var i=0;i<resultSet.length;i++){
                    results += "<div class='card-body'>";
                    if( resultSet[i].user ) results += "<b>" + resultSet[i].user+"</b>: ";
                    results += resultSet[i].flyFrom+" -> "+resultSet[i].flyTo+" ("+resultSet[i].price+" €)";
                    results += '<br><a class="btn btn-primary" href="'+resultSet[i].deepLink+'" role="button">Buy</a> <a class="btn btn-outline-secondary" href="'+resultSet[i].deepLink+'" role="button">Send to Friend</a><br>';
                    results += "</div>";
                    price += resultSet[i].price;
                }
                results += '</div>';

            }
        });
        $("#resultsTable").html(results);

        if( count == 0 ) $("#resultsTable").html('<h1 style="margin-top: 15px; margin-bottom: 15px;"> NO RESULTS </h1><img src="./img/no-results.png" id="image2" style="width:100%;height:400px;">');
    });



    // var results = '<table class="table table-striped">'+
    //     '<thead>'+
    //       '<tr class="row">'+
    //         '<th scope="col" class="col-sm">Name</th>'+
    //         '<th scope="col" class="col-sm">From</th>'+
    //         '<th scope="col" class="col-sm">To</th>'+
    //         '<th scope="col" class="col-sm">Price</th>'+
    //         '<th class="col-sm"></th>'+
    //       '</tr>'+
    //     '</thead>'+
    //     '<tbody>';


    // for(var i=0;i<searchResults.length;i++) {
    //     results += '<tr class="row">'+
    //         '<th scope="row" class="col-sm">Vivian Aranha</th>'+
    //         '<td class="col-sm">BCN</td>'+
    //         '<td class="col-sm">ATL</td>'+
    //         '<td class="col-sm">$290</td>'+
    //         '<td class="col-sm">'+
    //           '<input type="button" class="btn btn-info btn-small" value="Buy" /> '+
    //           '<input type="button" class="btn btn-info btn-small" value="Send to Friend" />'+
    //         '</td>'+
    //       '</tr>';
    // }

    // results +='</tbody></table>';
    // $("#resultsTable").html(results);
}

/** Results **/


/** AddRow code **/

$(document).ready(function () {
    var counter = 0;

    $("#addrow").on("click", function () {
        var newRow = $("<tr class='row'>");
        var cols = "";

        cols += '<td class="col-md-5"><input type="text" class="form-control" name="name' + counter + '"  placeholder="Full Name"/></td>';
        cols += '<td class="col-md-5"><input type="text" class="autocomplete form-control" name="airport' + counter + '" placeholder="Airport Code" /></td>';
        cols += '<td class="col-md-2"><input type="button" class="ibtnDel btn btn-md btn-danger"  value="Delete"></td>';
        newRow.append(cols);
        $("table.order-list").append(newRow);
        counter++;
    });

    $("table.order-list").on("click", ".ibtnDel", function (event) {
        $(this).closest("tr").remove();
        counter -= 1
    });

    $("#getFlights").on("click", function () {
        drawResults(['BCN']);


    });

});

function calculateRow(row) {
    var price = +row.find('input[name^="price"]').val();

}

function calculateGrandTotal() {
    var grandTotal = 0;
    $("table.order-list").find('input[name^="price"]').each(function () {
        grandTotal += +$(this).val();
    });
    $("#grandtotal").text(grandTotal.toFixed(2));
}

$("#getFlights").on("click", function () {
    document.getElementById('image1').style.display = 'none';
});

/** AddRow code **/



/********************************/
// Autocomplete airport

var options = {
  shouldSort: true,
  threshold: 0.4,
  maxPatternLength: 32,
  keys: [{
    name: 'iata',
    weight: 0.5
  }, {
    name: 'name',
    weight: 0.3
  }, {
    name: 'city',
    weight: 0.2
  }]
};

var fuse = new Fuse(airports, options)

var ac = $('.autocomplete')
  .on('click', function(e) {
    e.stopPropagation();
  })
  .on('focus keyup', search)
  .on('keydown', onKeyDown);

var wrap = $('<div>')
  .addClass('autocomplete-wrapper')
  .insertBefore(ac)
  .append(ac);

var list = $('<div>')
  .addClass('autocomplete-results')
  .on('click', '.autocomplete-result', function(e) {
    e.preventDefault();
    e.stopPropagation();
    selectIndex($(this).data('index'));
  })
  .appendTo(wrap);

$(document)
  .on('mouseover', '.autocomplete-result', function(e) {
    var index = parseInt($(this).data('index'), 10);
    if (!isNaN(index)) {
      list.attr('data-highlight', index);
    }
  })
  .on('click', clearResults);

function clearResults() {
  results = [];
  numResults = 0;
  list.empty();
}

function selectIndex(index) {
  if (results.length >= index + 1) {
    ac.val(results[index].iata);
    clearResults();
  }
}

var results = [];
var numResults = 0;
var selectedIndex = -1;

function search(e) {
  if (e.which === 38 || e.which === 13 || e.which === 40) {
    return;
  }

  if (ac.val().length > 0) {
    results = _.take(fuse.search(ac.val()), 7);
    numResults = results.length;

    var divs = results.map(function(r, i) {
        return '<div class="autocomplete-result" data-index="'+ i +'">'
             + '<div><b>'+ r.iata +'</b> - '+ r.name +'</div>'
             + '<div class="autocomplete-location">'+ r.city +', '+ r.country +'</div>'
             + '</div>';
     });

    selectedIndex = -1;
    list.html(divs.join(''))
      .attr('data-highlight', selectedIndex);

  } else {
    numResults = 0;
    list.empty();
  }
}

function onKeyDown(e) {
  switch(e.which) {
    case 38: // up
      selectedIndex--;
      if (selectedIndex <= -1) {
        selectedIndex = -1;
      }
      list.attr('data-highlight', selectedIndex);
      break;
    case 13: // enter
      selectIndex(selectedIndex);
      break;
    case 9: // enter
      selectIndex(selectedIndex);
      e.stopPropagation();
      return;
    case 40: // down
      selectedIndex++;
      if (selectedIndex >= numResults) {
        selectedIndex = numResults-1;
      }
      list.attr('data-highlight', selectedIndex);
      break;

    default: return; // exit this handler for other keys
  }
  e.stopPropagation();
  e.preventDefault(); // prevent the default action (scroll / move caret)
}
