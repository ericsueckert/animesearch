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
//        var deferred = $q.defer();
        var anime;
        var animeTitles;

        console.log("Typed: " + typed);
//        if (typed.length > 3) {
            console.log("HTTP request to AnimeNewsNetwork");
            //HTTP Request delay
//            $timeout(function () {
                    //HTTP GET request to animenewsnetwork
                    var promise = $timeout(function () {
                        return $http({
                            method: 'GET',
                            url: 'https://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=~' + typed
                        });
                    }, 1000);
                    return promise;
//                     .then(function successCallback(response) {
//                     console.log("HTTP GET request successful.");
//                     anime = response.data;
// //                    console.log(anime);
//                     var x2js = new X2JS();
//                     var jsonAnime = x2js.xml_str2json(anime);
//                     console.log(jsonAnime.ann.anime);
//
//                     var titleList = [];
//
//                     for(var i=0; i < jsonAnime.ann.anime.length; i++){
//
//                         //anime = jsonAnime.ann.anime[i];
//                         //console.log(anime);
//                         var searchLine = anime._name + " (" + anime._type + ")";
//                         //console.log(searchLine);
//                         titleList.push(searchLine);
//                     }
//                     console.log("return anime");
//                     //$scope.animeTitles = titleList;
//                     deferred.resolve(titleList);
//
//
//                     // console.log("Posting data to Python script...");
//                     // $timeout(function () {
//                     //     $http({
//                     //         method: 'GET',
//                     //         url: 'http://localhost:8080/',
//                     //         data: anime
//                     //     }).then(function successCallback(response) {
//                     //         console.log("POST request successful.");
//                     //         animeTitles = response.data;
//                     //         console.log(animeTitles);
//                     //         return animeTitles;
//                     //     }, function errorCallback(response) {
//                     //         alert('Failed: ' + response.statusText);
//                     //         return;
//                     //     }, 1000);
//                     // });
//
//                 }, function errorCallback(response) {
//                     alert('Failed: ' + response.statusText);
//                     deferred.reject(response);
//                 });
//                }
//                , 1000);

//            return deferred;

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
//        }
    };

    AnimeRetriever.query = function (text) {
        searchTitle = string.split('(')[0];
        var promise = $timeout(function () {
            return $http({
                method: 'GET',
                url: 'https://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=~' + searchTitle
            });
        }, 1000);
        return promise;
    }

    return AnimeRetriever;
});

// animeApp.factory('AnimeRetriever', function ($http, $timeout) {
//     return {
//         updateAnime: function(typed) {
//             if (typed.length > 3) {
//                 return $http.get('https://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=~' + typed)
//             }
//         }
//     }
// });

animeApp.controller('AnimeCtrl', ['$scope', 'AnimeRetriever', function ($scope, AnimeRetriever) {
    // $scope.anime = AnimeRetriever.updateAnime("...");
    // $scope.anime.then(function(data) {
    //     $scope.anime = data;
    // });

    $scope.getAnime = function () {
        return $scope.animeTitles;
    };

    //Update autocomplete search
    $scope.updateAutocomplete = function (typed) {
        if (typed.length <= 3) {
            return;
        }
        $scope.newanime = AnimeRetriever.updateAnime(typed);
        console.log("hi");
        console.log($scope.newanime);
        // $scope.newanime.then(function (data) {
        //     $scope.animeTitles = data;
        // });

        $scope.newanime.then(function (response) {
            console.log("HTTP GET request successful.");
            var anime = response.data;
//                    console.log(anime);
            var x2js = new X2JS();
            var jsonAnime = x2js.xml_str2json(anime);
            console.log(jsonAnime.ann.anime);
            $scope.animeData = jsonAnime.ann.anime;

            var titleList = [];

            for (var i = 0; i < jsonAnime.ann.anime.length; i++) {

                anime = jsonAnime.ann.anime[i];
                //console.log(anime);
                var searchLine = anime._name + " (" + anime._type + ")";
                console.log(searchLine);
                titleList.push(searchLine);
            }
            console.log("return anime");
            //$scope.animeTitles = titleList;
            console.log(titleList);
            $scope.animeTitles = ["Shingeki no Kyojin Kōhen: Jiyū no Tsubasa (movie)", "Shingeki no Kyojin Zenpen: Guren no Yumiya (movie)"];


            // console.log("Posting data to Python script...");
            // $timeout(function () {
            //     $http({
            //         method: 'GET',
            //         url: 'http://localhost:8080/',
            //         data: anime
            //     }).then(function successCallback(response) {
            //         console.log("POST request successful.");
            //         animeTitles = response.data;
            //         console.log(animeTitles);
            //         return animeTitles;
            //     }, function errorCallback(response) {
            //         alert('Failed: ' + response.statusText);
            //         return;
            //     }, 1000);
            // });

        }, function (response) {
            alert('Failed: ' + response.statusText);
            return;
        });

    };

    $scope.searchAnime = function (suggestion) {
        $scope.queryResult = AnimeRetriever.query(suggestion);
        $scope.queryResult.then(function (response) {
            console.log("Query successful");
            anime = response.data;
            var x2js = new X2JS();
            var jsonAnime = x2js.xml_str2json(anime);
            var anime = jsonAnime.ann.anime[0];
        })
    };
}]);
