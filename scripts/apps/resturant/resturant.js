(function () {

    var moduleName = "mainApp",
        controllerName = "resturantController",
        API_URL = "https://api.yelp.com/v2/search/?category_filter=restaurants",
        factoryName = "resturantAPI";

    angular.module(moduleName)

    //angular factory for performing all data mnipulation and API calls.
    .factory(factoryName, ['$http', function ($http) {
            return {
                //getting data from the YELP API
                getData: getData,
                //Sorting the data for different filters
                getSortedData: getSortedData,
            }

            //Not implemented TODO
            function getGoogleMapData(data) {}

            //Sorting the data for different filters
            function getSortedData(data, bckupdata, key) {
                if (key === "ft_location") {
                    return bckupdata;
                } else {
                    data.sort(function (a, b) {
                        //Sorting the data for different filters
                        if (key === "ft_review") {
                            return (a.review_count) - (b.review_count);
                        } else if (key === "ft_rate") {
                            return (a.rating) - (b.rating);
                        }
                    });
                    return data.reverse();
                }
                //send data in decending order - so reversing the object list
            }

            function getData(rlocation, rfood) {
                //setting YELP parameters for OAuth handshake //not suppossed to expose//
                var auth = {
                    consumerKey: 'cr3zoqk2J8TN7AmbGv9qWA',
                    consumerSecret: '0z-Ik6haW9_vmj4jmqbpNBVSMvo',
                    accessToken: 'rilgq0-LI20SNRPeCNK-sWRfZYokIqG3',
                    accessTokenSecret: 'aXEIXw1sljxt5c5U3GYXwWUMZDw',
                    serviceProvider: {
                        signatureMethod: "HMAC-SHA1"
                    }
                };
                //setting terms to the food type entered into panel
                var terms = rfood;
                //setting near to the location entered into the panel
                var near = rlocation;
                var accessor = {
                    consumerSecret: auth.consumerSecret,
                    tokenSecret: auth.accessTokenSecret
                };

                //setting all parameters for the API call - 3rd party approch
                var parameters = [];
                parameters.push(['term', terms]);
                parameters.push(['location', near]);
                parameters.push(['sort', 1]);
                parameters.push(['limit', 40]);
                parameters.push(['category_filter', "restaurants"]);
                parameters.push(['callback', 'cb']);
                parameters.push(['oauth_consumer_key', auth.consumerKey]);
                parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
                parameters.push(['oauth_token', auth.accessToken]);
                parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
                //forming the request block
                var message = {
                    'action': 'https://api.yelp.com/v2/search',
                    'method': 'GET',
                    'parameters': parameters
                };
                //setting oAuth signature
                OAuth.setTimestampAndNonce(message);
                OAuth.SignatureMethod.sign(message, accessor);

                var parameterMap = OAuth.getParameterMap(message.parameters);
                var jsonData;
                //wrong approch need to replace it with $http --> need to do hack to update scope variables
                //jquery ajax call made here - it is not advisable to do a jquery ajax call in angular app as the anguar scope is not notified when a new data arrives
                return $.ajax({
                        'url': message.action,
                        'data': parameterMap,
                        'dataType': 'jsonp',
                        'jsonpCallback': 'cb',
                        'cache': true
                    })
                    .done(function (data, textStatus, jqXHR) {
                        return data;
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        console.log('error[' + errorThrown + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');
                    });
            }
        }])
        .controller(controllerName, ['$scope', '$window', 'resturantAPI', function ($scope, $window, rAPI) {
            //Setting initial values
            //focus on inputfield
            setTimeout(function () {
                $(".rlocation").focus();
            });

            //results div is hidden as we are implementing a single page app [no routing for results page]
            $scope.results = false;
            //lading page AKA search page is turned visible
            $scope.search = true;
            $scope.showfilter = function () {
                    $('.dropdown').toggleClass("show");
                }
                //based on filter select we want to rearrange the search result cards on the page
            $scope.filterSelector = function (selector, event) {
                //if having the class just return - prevent double click
                if ($('#' + selector).hasClass('activeradioholder')) {
                    event.preventDefault();
                    return;
                }
                //remove all other active clases when a new selection is made
                $('.radioholder').removeClass('activeradioholder');
                //adding the class to mark the new selection - simislar to a check box
                $("#" + selector).addClass("activeradioholder");
                //call data sorting based on the selection - Not doing a new call.
                $scope.rData = rAPI.getSortedData($scope.rData, $scope.rbckupData, selector);
            }

            function resetPanel() {
                $(".rlocation").focus();
                $(".rlocation").val("");
                $(".rfood").val("");
            }
            //Routing to the base page
            $scope.goBack = function () {
                    $window.location.href = "/";
                }
                //called on the "find my food" click. This is a promise and the code after .then gets executed after data is successful
            $scope.findFood = function () {
                rAPI.getData($('.rlocation').val(), $('.rfood').val()).then(function (data) {
                    //if the data retured do not have any redults we need to show an error message to user
                    if (data.businesses.length == 0) {
                        //scope.apply because jquery ajax is used and this hack is needed to manually apply the scope changes.
                        $scope.$apply(function () {
                            $scope.showNoBusiness = true;
                            $scope.showError = false;
                            //resetting the panel - so user can enter again right away.
                            resetPanel();
                        });
                    } else {
                        //if data is present lets go and load the results page.
                        //scope.apply because jquery ajax is used and this hack is needed to manually apply the scope chnages.
                        $scope.$apply(function () {
                            $scope.results = true;
                            $scope.search = false;
                            $scope.rbckupData = JSON.parse(JSON.stringify(data.businesses));
                            $scope.rData = data.businesses;
                            $scope.total = data.total;
                        });
                    }
                    //if there is an error we catch it and show a user friendly message to user. This is very generic as of now, can be enhanced.
                }).catch(function (e) {
                    //scope.apply because jquery ajax is used and this hack is needed to manually apply the scope chnages.
                    $scope.$apply(function () {
                        $scope.showError = true;
                        $scope.showNoBusiness = false;
                        //resetting the panel - so user can enter again right away.
                        resetPanel();
                    });
                });
            }
        }])
    module.exports = controllerName;
})()