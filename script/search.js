var animeApp = angular.module('AnimeSearchApp', ['autocomplete']);

animeApp.factory('AnimeRetriever', function ($http, $timeout) {
    var AnimeRetriever = new Object();

    AnimeRetriever.updateAnime = function (typed) {
        var anime;

        console.log("Typed: " + typed);
        console.log("HTTP request to AnimeNewsNetwork");

        //HTTP GET request to animenewsnetwork with delay
        var promise = $timeout(function () {
            return $http({
                method: 'GET',
                url: 'https://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=~' + typed
            });
        }, 1000);

        //return promise
        return promise;

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

    };

    //Query an anime title
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

//Controller
animeApp.controller('AnimeCtrl', ['$scope', 'AnimeRetriever', function ($scope, AnimeRetriever) {

    $scope.getAnime = function () {
        return $scope.animeTitles;
    };

    //Update autocomplete lookahead
    $scope.updateAutocomplete = function (typed) {
        //Only query if more than 3 characters
        if (typed.length <= 3) {
            return;
        }
        //Submit request
        $scope.newanime = AnimeRetriever.updateAnime(typed);

        console.log($scope.newanime);

        //Handle request result
        $scope.newanime.then(function (response) {
            //Successful response
            console.log("HTTP GET request successful.");
            var anime = response.data;
//                    console.log(anime);
            //Convert to JSON format
            var x2js = new X2JS();
            var jsonAnime = x2js.xml_str2json(anime);
            console.log(jsonAnime.ann.anime);
            $scope.animeData = jsonAnime.ann.anime;

            var titleList = [];

            //Push titles into an array
            for (var i = 0; i < jsonAnime.ann.anime.length; i++) {

                anime = jsonAnime.ann.anime[i];
                //console.log(anime);
                var searchLine = anime._name + " (" + anime._type + ")";
                console.log(searchLine);
                titleList.push(searchLine);
            }
            console.log("return anime");
            console.log(titleList);
            //$scope.animeTitles = ["Shingeki no Kyojin Kōhen: Jiyū no Tsubasa (movie)", "Shingeki no Kyojin Zenpen: Guren no Yumiya (movie)"];

            //Update $scope variable with titles
            $scope.animeTitles = titleList;

        }, function (response) {
            //Failure response
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
