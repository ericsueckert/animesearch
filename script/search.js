var animeApp = angular.module('AnimeSearchApp', ['autocomplete', 'ngSanitize']);

animeApp.factory('AnimeRetriever', function ($http, $timeout) {
    var AnimeRetriever = new Object();

    AnimeRetriever.updateAnime = function (typed) {
        var anime;

        // console.log("Typed: " + typed);
        // console.log("HTTP request to AnimeNewsNetwork");

        //HTTP GET request to animenewsnetwork with delay
        //return promise
        return $timeout(function () {
            return $http({
                method: 'GET',
                url: 'https://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=~' + typed
            });
        }, 1000);

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
        console.log(text);
        searchTitle = text.split('\t')[0];
        console.log(searchTitle);
        return $timeout(function () {
            return $http({
                method: 'GET',
                url: 'https://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=~' + searchTitle
            });
        }, 1000);
    };

    return AnimeRetriever;
});

//Controller
animeApp.controller('AnimeCtrl', ['$scope', '$sce', 'AnimeRetriever', function ($scope, $sce, AnimeRetriever) {

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

        // console.log($scope.newanime);

        //Handle request result
        $scope.newanime.then(function (response) {
            //Successful response
            // console.log("HTTP GET request successful.");
            var anime = response.data;
//                    console.log(anime);
            //Convert to JSON format
            var x2js = new X2JS();
            var jsonAnime = x2js.xml_str2json(anime);
            // console.log(jsonAnime.ann.anime);
            $scope.animeData = jsonAnime.ann.anime;

            var titleList = [];

            //Push titles into an array
            for (var i = 0; i < jsonAnime.ann.anime.length; i++) {

                anime = jsonAnime.ann.anime[i];
                //console.log(anime);
                var searchLine = anime._name + "\t(" + anime._precision + ")";
                // console.log(searchLine);
                titleList.push(searchLine);
            }
            // console.log("return anime");
            // console.log(titleList);
            //$scope.animeTitles = ["Shingeki no Kyojin Kōhen: Jiyū no Tsubasa (movie)", "Shingeki no Kyojin Zenpen: Guren no Yumiya (movie)"];

            //Update $scope variable with titles
            $scope.animeTitles = titleList;

        }, function (response) {
            //Failure response
            alert('Failed: ' + response.statusText);
        });

    };

    $scope.searchAnime = function (suggestion) {
        console.log("Querying anime: " + suggestion);
        $scope.queryResult = AnimeRetriever.query(suggestion);
        splitSuggestion = suggestion.split('\t');
        splitSuggestion[1] = splitSuggestion[1].replace('(','').replace(')','');
        console.log(splitSuggestion[1]);

        $scope.queryResult.then(function (response) {
            console.log("Query successful");
            animeResponse = response.data;
            var x2js = new X2JS();
            var jsonAnime = x2js.xml_str2json(animeResponse);
            console.log(jsonAnime);
            var anime = jsonAnime.ann.anime;
            if (angular.isArray(anime)) {
                for (var i = 0; i < anime.length; i++) {
                    if (anime[i]._name == splitSuggestion[0] && anime[i]._precision == splitSuggestion[1]) {
                        console.log("correctly identified");
                        anime = anime[i];
                        break;
                    }
                }
            }
            console.log(anime);

            delete $scope.header;
            delete $scope.picture;
            delete $scope.summary;

            console.log("binding header");
            // $scope.header = $sce.trustAsHtml("<h3>" + anime._name + "</h3>" +
            //     "<h4>" + anime._type + "</h4>");
            $scope.header = $sce.trustAsHtml("Header");
            console.log($scope.header);
            var type;
            for (var i = 0; i < anime.length; i++) {
                type = anime[i].type;
                if (type == "Picture") {
                    console.log("binding image");
                    $scope.picture = $sce.trustAsHtml(anime[i].src);
                }
                else if (type == "Plot Summary") {
                    $scope.summary = $sce.trustAsHtml(anime[i]);
                }
            }


        })
    };
}]);
