var theList = $("#mylist");//lista div
var MainURL="https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=c54bd72b776060f9097f0fe1d3b1f3ac"; 
var PosterImageSize = Math.ceil(deviceWidth/2.22);


function init(){
     createDB();
     getMovandPrint();
     $('#list_button').click(function(){
            getMovandPrint();
         });
     $('#favorites_button').click(function(){
            selectDB();
         });
}

function getMovandPrint(){
    theList.empty();
     var request = $.ajax({
          url: MainURL,
          method: "GET"
        });

        request.done(function( moviesList ) {
            
            for (i=0;i<moviesList.results.length;i++){

            theList.append(
            '<li><a Onclick="javascript:isFavorite('+moviesList.results[i].id+',\'webDetail\')">'+

            '<img src="https://image.tmdb.org/t/p/w92'+moviesList.results[i].poster_path+'">'+moviesList.results[i].original_title + "</a></li>");
                }

            theList.listview("refresh");
            
            });

        request.fail(function( jqXHR, textStatus ) {
          alert( "Request failed: " + textStatus );
    });
}

function createDB(){

     db = window.sqlitePlugin.openDatabase({name: 'favorites.db', location: 'default'});

     db.sqlBatch([
    'CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY,original_title, vote_average,release_date,genres,overview,poster_path,backdrop_path)',
     ], function() {
    console.log('Created database OK');
  }, function(error) {
    console.log('SQL batch ERROR: ' + error.message);
  });

}


function selectDB(){

     db.executeSql('SELECT * FROM favorites', [], function(rs) {
         //console.log("numero de filas "+rs.rows.length);
      if (rs.rows.length == 0){
          theList.empty();
            theList.append(
                    '<li class="ui-block-solo"  style="margin-top:5%;border: none;text-align:center; font-size:16px;">'+
                        '<h3>There is nothing</h3>'+
                    '<li>'
                );
          theList.listview("refresh");
      }
    else{
        theList.empty();
        for(i=0;i<rs.rows.length;i++){
        theList.append(
                                                 '<li class="ui-body-a"  style="border: none">'+
                                                    '<ul data-role="listview" class="ui-grid-a" style="background-color: #e8e8e8;">'+
                                                    '<li class="ui-block-a">'+
                                                    '<img src="http://image.tmdb.org/t/p/w185'+rs.rows.item(i).poster_path+'" style="width:'+PosterImageSize+'px">'+
                                                    '</li>'+
                                                    '<li class="ui-block-b" >'+
                                                        '<ul data-role="listview" class="ui-grid-a">'+
                                                            '<li class="ui-block-a" style="width:80%;"><h3>'+rs.rows.item(i).original_title+'</h3></li>'+
                                                            '<li class="ui-block-b" style="width:20%;"><h3>'+rs.rows.item(i).vote_average+' <i class="fa fa-star"  aria-hidden="true"></i></h3></li>'+
                                                        '</ul>'+
                                                        '<ul data-role="listview" class="ui-grid-a">'+
                                                            '<li class="ui-block-a" style="width:25%;"><h3  style="font-weight:lighter;"><i class="fa fa-calendar" aria-hidden="true"></i> '+(rs.rows.item(i).release_date).substr(0,4)+'</h3></li>'+
                                                            '<li class="ui-block-b" style="width:75%;"><h3  style="font-weight:lighter; margin-left:2%;">'+rs.rows.item(i).genres+'</h3></li>'+
                                                        '</ul>'+
                                                        '<div><p class="description_list" >'+rs.rows.item(i).overview+'</p></div>'+


                                                        '<a onclick="javascript:deleteFav('+rs.rows.item(i).id+')">Delete From Favorites</a>'+
                                                    '</li>'+
                                                '</ul>'+
                                                '</li>');
        }
        theList.listview("refresh");
    }
  }, function(error) {
    console.log('SELECT SQL statement ERROR: ' + error.message);
  });

}
function deleteFav(id){
    db.executeSql('SELECT * FROM favorites WHERE id=?', [id], function(res) {
        var title = res.rows.item(0).original_title;
        var vote = res.rows.item(0).vote_average;
        var date = res.rows.item(0).release_date;
        var genres= res.rows.item(0).genres;
        var overview = res.rows.item(0).overview;
        var poster = res.rows.item(0).poster_path;
        var backdrop = res.rows.item(0).backdrop_path;

                db.executeSql('DELETE FROM favorites WHERE id=?', [id], function(rs) {
                console.log("Se borrara la id "+id);
                console.log('rowsDeleted: ' + rs.rowsAffected);
                $('#fav').attr("class","fa fa-star-o");
                $('#fav').css("color","red");
                console.log(title+"Borrando de favoritos , extra ");
                $('#fav').attr("onclick",'addToFavorite('+id+',"'+title+'","'+vote+'","'+date+'","'+genres+'","'+overview+'","'+poster+'","'+backdrop+'")');
                selectDB();
              }, function(error) {
                console.log('Delete SQL statement ERROR: ' + error.message);
              });
      }, function(error) {
        console.log('SELECT SQL statement ERROR: ' + error.message);
      });

}

function addToFavorite(id,title,vote,date,genres,overview,poster,backdrop){//pone favorito

    db.executeSql('INSERT INTO favorites VALUES (?,?,?,?,?,?,?,?)', [id,title,vote,date,genres,overview,poster,backdrop], function(rs) {

        $('#fav').css("color","green");
        $('#fav').attr("onclick","deleteFav("+id+")");
  }, function(error) {
    console.log('SELECT SQL statement ERROR: ' + error.message);
    alert("SELECT SQL statement ERROR: " + error.message)
  });
}

function isFavorite(id,destination){
            theList.empty();
            theList.append( '<li class="kart-loader" style="border:none;margin-top: 50%;margin-left:28%;padding:20%;"><div class="sheath"><div class="segment"></div></div><div class="sheath"><div class="segment"></div></div><div class="sheath"><div class="segment"></div></div><div class="sheath"><div class="segment"></div></div><div class="sheath"><div class="segment"></div></div><div class="sheath"><div class="segment"></div></div><div class="sheath"><div class="segment"></div></div><div class="sheath"><div class="segment"></div></div><div class="sheath"><div class="segment"></div></div><div class="sheath"><div class="segment"></div></div><div class="sheath"><div class="segment"></div></div><div class="sheath"><div class="segment"></div></div></li>'
                );
            theList.listview("refresh");

        db.executeSql('SELECT count(*) AS mycount FROM favorites WHERE id=?', [id], function(res) {
        var counter = res.rows.item(0).mycount;
        if (destination == "webDetail"){
            if (counter == 0){
                getMovAndPrintDetails(id,false);}
            else{
               getMovAndPrintDetails(id,true);}
        }
        else {
            if (counter == 0){
                detailDB(id,false);}
            else{
               detailDB(id,true);}
        }

      }, function(error) {
        console.log('SELECT SQL statement ERROR: ' + error.message);
      });
}

function getMovAndPrintDetails(id,isfav){


     var request = $.ajax({
          url: "https://api.themoviedb.org/3/movie/"+id+"?api_key=c54bd72b776060f9097f0fe1d3b1f3ac",
          method: "GET",
        });


        request.done(function( result ) {
            //return result;
            theList.empty();
            var GenreString="";
            var starType="";
            var starColor="";
            var starLink="";
            for(ig=0;ig<result.genres.length;ig++){
                if((result.genres.length - ig) == 1){
                    GenreString += result.genres[ig].name;
                }
                else{
                GenreString += result.genres[ig].name + ",";
                }
                }

                var TitleStringWithQuoteMarks = result.original_title;
                var correctTitleString = TitleStringWithQuoteMarks.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
                var OverviewStringWithQuoteMarks = result.overview;
                var correctOverviewString = OverviewStringWithQuoteMarks.replace(/'/g, "&apos;").replace(/"/g, "&quot;");


              if(isfav == 1){
                    starType="fa fa-star";
                    starColor="color:yellow;";
                    starLink="onclick='deleteFav("+result.id+")'";

                }
                else if(isfav == 0){
                    starType="fa fa-star-o";
                    starColor="color:black;";


                  starLink='onclick=\'addToFavorite("'+result.id+'","'+correctTitleString+'","'+result.vote_average+'","'+result.release_date+'","'+GenreString+'","'+correctOverviewString+'","'+result.poster_path+'","'+result.backdrop_path+'")\'';

                }
                theList.append(
                                     '<li class="ui-body-a"  style="border: none">'+
                                        '<ul data-role="listview" class="ui-grid-a" style="background-color: #e8e8e8;">'+
                                        '<li>'+
                                        '<img src="http://image.tmdb.org/t/p/w185'+result.poster_path+'" style="width:'+PosterImageSize+'px; margin-left:25%;">'+
                                        '</li>'+
                                        '<li style="padding: 0% 5% 0% 5%;">'+
                                            '<ul data-role="listview" class="ui-grid-a">'+
                                                '<li class="ui-block-solo" style="text-align:center; font-size:14px;"><h3>'+result.original_title+'</h3></li>'+
                                            '</ul>'+
                                            '<ul data-role="listview" class="ui-grid-a" style="margin-left:12.5%;">'+
                                                '<li class="ui-block-a" style="width:70%;"><h3  style="font-weight:lighter;"><i class="fa fa-calendar" aria-hidden="true"></i> Release Date: '+result.release_date+'</h3></li>'+
                                                '<li class="ui-block-b" style="width:30%;"><h3>'+result.vote_average+' <i class="fa fa-star"  aria-hidden="true"></i></h3></li>'+
                                            '</ul>'+
                                            '<ul data-role="listview" class="ui-grid-a">'+
                                                '<li class="ui-block-solo"><h3  style="font-weight:lighter;">'+GenreString+'</h3></li>'+
                                            '</ul>'+
                                            '<div><p class="description_listDetails" >'+result.overview+'</p></div>'+
                                             '<a '+starLink+' data-role="button" data-icon="star" id="fav">Add to Favorites</a>'+
                                        '</li>'+
                                    '</ul>'+
                                    '</li>');

                theList.listview("refresh");



        });

        request.fail(function( jqXHR, textStatus ) {
          alert( "Request failed: " + textStatus );
    });
}