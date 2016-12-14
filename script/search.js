

$(document).ready(function(){
	$("#submit").click(search);
    request("data/anime-titles.xml", titles);
});

function query() {
    var xmlList = $.parseXML(this.responseText);
    var $xml = $(xmlList);
    
}

function request(url, fn) {
    var ajax = new XMLHttpRequest();
    ajax.onload = fn;
    ajax.onerror = ajaxFailure;
    ajax.open("GET", url, true);
    ajax.send();
}

function ajaxFailure() {
    $("#errors").html("Error making Ajax request:" +
        "\n\nServer status:\n" + this.status + " " + this.statusText + "\n\nServer response text:\n" + this.responseText);
}

var animeApp = angular.module('AnimeSearchApp', ['autocomplete']);

animeApp.controller('AnimeCtrl', function($scope, AnimeRetriever){
    $scope.anime = [];

$scope.updateAnime = function(typed){
$scope.newanime = AnimeRetriever.getanime(typed);
$scope.newanime.then(function(data){
$scope.anime = data;
});
}
});
