// $(document).ready(function () {
//     $("#submit").click(search);
//     request("data/anime-titles.xml", titles);
// });
//
// function query() {
//     var xmlList = $.parseXML(this.responseText);
//     var $xml = $(xmlList);
//
// }
//
// function request(url, fn) {
//     var ajax = new XMLHttpRequest();
//     ajax.onload = fn;
//     ajax.onerror = ajaxFailure;
//     ajax.open("GET", url, true);
//     ajax.send();
// }
//
// function ajaxFailure() {
//     $("#errors").html("Error making Ajax request:" +
//         "\n\nServer status:\n" + this.status + " " + this.statusText + "\n\nServer response text:\n" + this.responseText);
// }

var animeApp = angular.module('AnimeSearchApp', ['autocomplete']);

animeApp.factory('AnimeRetriever', function ($http, $timeout) {
    var AnimeRetriever = new Object();

    AnimeRetriever.updateAnime = function (typed) {
        var anime;
        var animeTitles;

        console.log("Typed: " + typed);
        if (typed.length > 3) {
            console.log("HTTP request to AnimeNewsNetwork");
            //HTTP Request delay
            $timeout(function () {
                //HTTP GET request to animenewsnetwork
                $http({
                    method: 'GET',
                    url: 'https://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=~' + typed
                }).then(function successCallback(response) {
                    console.log("HTTP GET request successful.");
                    anime = response.data;
//                    console.log(anime);

                    console.log("Posting data to Python script...");
                    $timeout(function () {
                        $http({
                            method: 'GET',
                            url: 'titleParse.py',
                            data: anime
                        }).then(function successCallback(response) {
                            console.log("POST request successful.");
                            animeTitles = response.data;
                            console.log(animeTitles);
                            return animeTitles;
                        }, function errorCallback(response) {
                            alert('Failed: ' + response.statusText);
                            return;
                        }, 1000);
                    });

                }, function errorCallback(response) {
                    alert('Failed: ' + response.statusText);
                    return;
                });
            }, 1000);

//            if (anime) {
//             console.log("Posting data to Python script...");
//             $timeout(function () {
//                 $http({
//                     method: 'POST',
//                     url: 'titleParse.py',
//                     data: anime
//                 }).then(function successCallback(response) {
//                     console.log("POST request successful.");
//                     animeTitles = response.data;
//                     return animeTitles;
//                 }, function errorCallback(response) {
//                     alert('Failed: ' + response.statusText);
//                     return;
//                 }, 1000);
//             });

            //           }
        }
    };

    return AnimeRetriever;
});

animeApp.controller('AnimeCtrl', function ($scope, AnimeRetriever) {
    // $scope.anime = AnimeRetriever.updateAnime("...");
    // $scope.anime.then(function(data) {
    //     $scope.anime = data;
    // });

    $scope.getAnime = function () {
        return $scope.animeTitles;
    }

    //Update autocomplete search
    $scope.updateAutocomplete = function (typed) {
        $scope.newanime = AnimeRetriever.updateAnime(typed);
        $scope.newanime.then(function (data) {
            $scope.animeTitles = data;
        });
    }

    $scope.searchAnime = function (suggestion) {
        //query the suggestion
    }
});
