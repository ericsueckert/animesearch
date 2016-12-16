/*
 Eric Eckert

 Dec 15, 2016

 */

var animeApp = angular.module('AnimeSearchApp', ['autocomplete', 'ngSanitize']);

animeApp.factory('AnimeRetriever', function ($http, $timeout) {
    var AnimeRetriever = new Object();

    AnimeRetriever.updateAnime = function (typed) {
        var anime;
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

    };

    //Query an anime title
    AnimeRetriever.query = function (text) {
        //console.log(text);
        searchTitle = text.split('\t')[0];
        //console.log(searchTitle);
        return $timeout(function () {
            return $http({
                method: 'GET',
                url: 'https://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=~' + searchTitle
            });
        }, 1000);
    };

    AnimeRetriever.queryID = function (ID) {
        console.log(ID);
        return $timeout(function () {
            return $http({
                method: 'GET',
                url: 'https://cdn.animenewsnetwork.com/encyclopedia/api.xml?title=' + ID
            });
        }, 1000);
    };

    AnimeRetriever.batchQueryID = function (ID) {
        console.log(ID);
        return $timeout(function () {
            return $http({
                method: 'GET',
                url: 'https://cdn.animenewsnetwork.com/encyclopedia/api.xml?title=' + ID
            });
        }, 1000);
    };

    return AnimeRetriever;
});

//Controller
animeApp.controller('AnimeCtrl', ['$scope', '$sce', 'AnimeRetriever', function ($scope, $sce, AnimeRetriever) {

    //Helper functions for accessing HTML
    function clear(elementID) {
        document.getElementById(elementID).innerHTML = "";
    }

    function set(elementID, content) {
        document.getElementById(elementID).innerHTML = content;
    }

    function get(elementID) {
        return document.getElementById(elementID).innerHTML;
    }

    function add(elementID, content) {
        set(elementID, get(elementID).concat(content));
    }

    function getAnnObject(obj) {
        if (obj.anime) {
            return obj.anime;
        }
        else if (obj.manga) {
            return obj.manga;
        }
    }

    function relatedWorksSuccessUpdate(response) {
        var x2js = new X2JS();
        var animeSubResponse = response.data;
        var jsonSubAnime = x2js.xml_str2json(animeSubResponse);
        var subWork;
        subWork = getAnnObject(jsonSubAnime.ann);

        console.log(subWork);
        if (angular.isArray(subWork)) {
            for (var i = 0; i < subWork.length; i++) {
                add("relatedList", "<li>" + subWork[i]._name + " (" + subWork[i]._precision + ")</li>");
            }
        }
        else {
            add("relatedList", "<li>" + subWork._name + " (" + subWork._precision + ")</li>");
        }
    }

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
            var anime = response.data;
            //Convert to JSON format
            var x2js = new X2JS();
            var jsonAnime = x2js.xml_str2json(anime);
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
            //Update $scope variable with titles
            $scope.animeTitles = titleList;

        }, function (response) {
            //Failure response
            alert('Failed: ' + response.statusText);
        });

    };

    //Execute actual query
    $scope.searchAnime = function (suggestion) {
        //console.log("Querying anime: " + suggestion);
        //Submit query
        $scope.queryResult = AnimeRetriever.query(suggestion);
        splitSuggestion = suggestion.split('\t');
        splitSuggestion[1] = splitSuggestion[1].replace('(', '').replace(')', '');

        $scope.queryResult.then(function (response) {
            //Successful query
            console.log("Query successful");
            animeResponse = response.data;
            //Convert to json
            var x2js = new X2JS();
            var jsonAnime = x2js.xml_str2json(animeResponse);
            //console.log(jsonAnime);
            var anime = jsonAnime.ann.anime;
            //If it's a list, look through to find the correct title
            if (angular.isArray(anime)) {
                for (var i = 0; i < anime.length; i++) {
                    if (anime[i]._name == splitSuggestion[0] && anime[i]._precision == splitSuggestion[1]) {
                        console.log("correctly identified");
                        anime = anime[i];
                        break;
                    }
                }
            }

            //Clear all html things
            clear("responseHead");
            clear("rating");
            clear("subInfo");
            clear("picture");
            clear("synopsisHead");
            clear("summary");
            clear("creditHead");
            clear("credList");
            clear("castHead");
            clear("castList");
            clear("newsHead");
            clear("newsList");
            clear("relatedHead");
            clear("relatedList");


            console.log(anime);

            //console.log("binding header");

            //Bind header
            var header = "<h3>" + anime._name + "</h3>" +
                "<h5>" + anime._precision + "</h5>";
            set("responseHead", header);

            //Bind rating
            if (anime.ratings) {
                set("rating", "<b>Weighted score:</b> " + anime.ratings._weighted_score + "/10");
            }

            //Bind everything in Info fields
            var type;
            var eps = -1;
            var runtime = -1;
            var genres = [];
            var themes = [];
            var websites = [];
            for (var i = 0; i < anime.info.length; i++) {
                type = anime.info[i]._type;
                //Set image
                if (type == "Picture") {
                    console.log("binding image");
                    set("picture", "<img src=" + anime.info[i]._src + ">");
                }
                //Set synopsis
                else if (type == "Plot Summary") {
                    set("summary", anime.info[i].__text);
                    set("synopsisHead", "Synopsis");
                }
                //Log episode count, runtime, genres, themes
                else if (type == "Number of episodes") {
                    var eps = anime.info[i].__text;
                }
                else if (type == "Running time") {
                    var runtime = anime.info[i].__text;
                }
                else if (type == "Genres") {
                    genres.push(anime.info[i].__text);
                }
                else if (type == "Themes") {
                    themes.push(anime.info[i].__text);
                }
                else if (type == "Official website") {
                    websites.push("<li><a href=" + anime.info[i]._href + ">" + anime.info[i].__text + "</a></li>");
                }

            }

            //bind subInfo
            var subInfo = "<span>";
            if (eps != -1) {
                subInfo = subInfo.concat("<b>Episodes: </b>" + eps + " ");
            }
            if (runtime != -1) {
                subInfo = subInfo.concat("<b>Runtime: </b>" + runtime);
            }
            if (genres.length > 0) {
                subInfo = subInfo.concat("<br><br><strong>Genres</strong><br><span>" + genres.join(" | ") + "</span>");
            }
            if (themes.length > 0) {
                subInfo = subInfo.concat("<br><strong>Themes</strong><br><span>" + themes.join(" | ") + "</span>");
            }

            set("subInfo", subInfo);

            //Query related anime
            if (anime['related-next']) {
                if (anime['related-next'].length > 1) {

                    //Bind heading
                    set("relatedHead", "Related Works");
                    //Query for each element in list
                    var idList = [];
                    for (var i = 0; i < anime['related-next'].length; i++) {
                        idList.push(anime['related-next'][i]._id);
                    }
                    ids = idList.join('\/');

                    //Submit query
                    AnimeRetriever.queryID(ids).then(function (response) {
                        //Successful subquery
                        console.log("SubQuery successful");
                        relatedWorksSuccessUpdate(response);
                    });
                }
                else if (!anime['related-next'].isArray) {
                    set("relatedHead", "Related Works");
                    console.log(anime['related-next']._id);
                    AnimeRetriever.queryID(anime['related-next']._id).then(function (response) {
                        console.log("SubQuery successful");
                        relatedWorksSuccessUpdate(response);
                    });
                }
            }

            if (anime['related-prev']) {
                if (anime['related-prev'].length > 1) {
                    set("relatedHead", "Related Works");
                    for (var i = 0; i < anime['related-prev'].length; i++) {
                        AnimeRetriever.queryID(anime['related-prev'][i]._id).then(function (response) {
                            console.log("SubQuery successful");
                            relatedWorksSuccessUpdate(response);
                        });
                    }
                }
                else if (!anime['related-prev'].isArray) {
                    set("relatedHead", "Related Works");
                    console.log(anime['related-prev']._id);
                    AnimeRetriever.queryID(anime['related-prev']._id).then(function (response) {
                        console.log("SubQuery successful");
                        relatedWorksSuccessUpdate(response);
                    });
                }
            }

            //Bind credit
            if (anime.credit.length > 0) {
                var credList = "<ul>";
                for (var i = 0; i < anime.credit.length; i++) {
                    credList = credList.concat("<li><b>" + anime.credit[i].task + ":</b> " + anime.credit[i].company.__text + "</li>");
                }
                credList = credList.concat("</ul>");
                set("creditHead", "Production");
                set("credList", credList);
            }

            //Bind cast
            if (anime.cast.length > 0) {
                var castList = "<ul>";
                for (var i = 0; i < anime.cast.length; i++) {
                    if (anime.cast[i]._lang == "JA") {
                        castList = castList.concat("<li><b>" + anime.cast[i].role + ":</b> " + anime.cast[i].person.__text + "</li>");

                    }
                }
                castList = castList.concat("</ul>");
                set("castHead", "Cast");
                set("castList", castList);
            }

            //Bind websites
            if (websites.length > 0) {
                set("siteHead", "Official Websites");
                set("siteList", "<ul>" + websites.join("") + "</ul>");
            }


            //Display anime news
            if (anime.news.length >= 6) {
                var newsList = "<ul>";
                for (var i = 0; i < 6; i++) {
                    newsList = newsList.concat("<li><a href=\"" + anime.news[i]._href + "\">" + anime.news[i].__text + "</a></li>");
                }
                newsList = newsList.concat("</ul>");
                set("newsHead", "News");
                document.getElementById("newsList").innerHTML = newsList;
            }
            else if (anime.news.length == 1) {
                newsList = "<ul><li><a href=\"" + anime.news._href + "\">" + anime.news.__text + "</a></li></ul>";
                set("newsList", newsList);
            }
            else if (anime.news.length > 1) {
                var newsList = "<ul>";
                for (var i = 0; i < anime.news.length; i++) {
                    newsList = newsList.concat("<li><a href=\"" + anime.news[i]._href + "\">" + anime.news[i].__text + "</a></li>");
                }
                newsList = newsList.concat("</ul>");
                set("newsHead", "News");
                set("newsList", newsList);
            }

            if (anime.staff.length > 0) {
                var staffList = "<ul>";
                for (var i = 0; i < anime.staff.length; i++) {
                    staffList = staffList.concat("<li><b>" + anime.staff[i].task + ":</b> " + anime.staff[i].person.__text + "</li>");
                }
                staffList = staffList.concat("</ul>");
                set("staffHead", "Staff");
                set("staffList", staffList);
            }
        })
    };
}]);
