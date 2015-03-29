'use strict';

angular.module('myApp.view1', ['ngRoute', 'ngToast'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
    });
}])

.controller('View1Ctrl', ['$scope', '$modal', '$interval', 'ngToast', function($scope, $modal, $interval) {

    $scope.amount = '1';
    $scope.cashSources = [{
        order: 1,
        name: "Limonadenstand",
        cash: 1,
        price: 4,
        amount: 1,
        exp: 1.07,
        loadtime: 6,
        loaded: 0,
        ismanaged: false

    }, {
        order: 2,
        name: "Zeitungsstand",
        cash: 60,
        price: 60,
        amount: 0,
        exp: 1.15,
        loadtime: 30,
        loaded: 0,
        ismanaged: false
    }, {
        order: 3,
        name: "Autowaschanlage",
        cash: 540,
        price: 720,
        amount: 0,
        exp: 1.14,
        loadtime: 60,
        loaded: 0,
        ismanaged: false
    }, {
        order: 4,
        name: "Pizzeria",
        cash: 4320,
        price: 8640,
        amount: 0,
        exp: 1.13,
        loadtime: 120,
        loaded: 0,
        ismanaged: false
    }, {
        order: 5,
        name: "Shrimp Kutter",
        cash: 51840,
        price: 103680,
        amount: 0,
        exp: 1.12,
        loadtime: 240,
        loaded: 0,
        ismanaged: false
    }, {
        order: 6,
        name: "Schokoladenfabrik",
        cash: 622080,
        price: 1244160,
        amount: 0,
        exp: 1.11,
        loadtime: 960,
        loaded: 0,
        ismanaged: false
    }, {
        order: 7,
        name: "Fußball Team",
        cash: 7464960,
        price: 14929920,
        amount: 0,
        exp: 1.10,
        loadtime: 3840,
        loaded: 0,
        ismanaged: false
    }, {
        order: 8,
        name: "Film Studio",
        cash: 89579520,
        price: 179159040,
        amount: 0,
        exp: 1.09,
        loadtime: 15360,
        loaded: 0,
        ismanaged: false
    }, {
        order: 9,
        name: "Bank",
        cash: 2149908480,
        price: 1074954240,
        amount: 0,
        exp: 1.08,
        loadtime: 61440,
        loaded: 0,
        ismanaged: false
    }, {
        order: 10,
        name: "Öl Gesellschaft",
        cash: 29668737024,
        price: 25798901760,
        amount: 0,
        exp: 1.07,
        loadtime: 36864,
        loaded: 0,
        ismanaged: false
    }]

    $scope.manager = [{
        name: "John Lemon",
        description: "Er kümmert sich gewissenhaft um deine Limonadenstände!",
        price: "100",
        isBought: false,
        sourceID: 0
    }, {
        name: "Springer Axel",
        description: "Bringt deine Zeitungen an den Mann!",
        price: "1000",
        isBought: false,
        sourceID: 1
    }, {
        name: "Walther Weiß",
        description: "Hat viel Erfahrungen im Autowaschen!",
        price: "100000",
        isBought: false,
        sourceID: 2
    }, {
        name: "Luigi",
        description: "Wer sollte sich sonst um deine Pizza kümmern?",
        price: "500000",
        isBought: false,
        sourceID: 3
    }, {
        name: "Gubba Bump",
        description: "Er fischt nicht im Trüben, sondern hält deine Schrimp Kutter am Laufen!",
        price: "1000000",
        isBought: false,
        sourceID: 4
    }, {
        name: "Wolli Wonka",
        description: "Er und seine Umpa-Lumpas kümmern sich um deine Schokoladenfabrik.",
        price: "111111111",
        isBought: false,
        sourceID: 5
    }, {
        name: "Logi Jöw",
        description: "De beschde Träiner wo gibbd!",
        price: "555555555",
        isBought: false,
        sourceID: 6
    }, {
        name: "Stefan Spiel-Berg",
        description: "Hält das Film-Business am Laufen.",
        price: "10000000000",
        isBought: false,
        sourceID: 7
    }]

    $scope.money = 0;

    $scope.reduceMoney = function(amount) {
        $scope.money -= amount;
    }

    $scope.addMoney = function(amount) {
        $scope.money += amount;
    }

    $scope.getMoney = function() {

        return $scope.money;
    }

    $scope.activateManager = function(sourceID) {
        $scope.cashSources[sourceID].ismanaged = true;
    }

    $scope.openModal = function(size, templateUrl) {

        $scope.money
        var modalInstance = $modal.open({
            templateUrl: templateUrl,
            controller: 'ModalInstanceCtrl',
            scope: $scope,
            size: size
        });


    };

}])

.directive("columnwrapper", function() {
    return {
        restrict: "E",
        scope: {
            money: '='
        },
        link: function(scope) {

        }
    };
})

.directive('cashSource', ['$interval', function() {
        return {
            restrict: 'E',
            scope: {
                source: '=model',
                reduceMoney: '&',
                addMoney: '&',
                getMoney: '&',
                amount: '='
            },
            controller: function($scope, $interval, ngToast) {

                var tick;

                $scope.buy = function(amount) {
                    console.log(amount)
                    for (var i = 1; i <= amount; i++) {
                        if ($scope.isAffordable()) {
                            $scope.source.amount++;
                            $scope.reduceMoney()($scope.source.price);
                            $scope.source.price = $scope.source.price * $scope.source.exp

                            // half the time
                            if ([25, 50, 100].indexOf($scope.source.amount) > -1) {
                                $scope.halfTime();


                            }
                        }
                    }
                }

                $scope.halfTime = function() {
                    $scope.source.loadtime *= 0.5;
                    ngToast.create('<strong>Du hast ' + $scope.source.amount + ' x ' + $scope.source.name + ' </strong>  Produktivität verdoppelt!');

                }

                $scope.activate = function() {

                    // prevent double activation
                    if (angular.isDefined(tick) ||  $scope.source.amount == 0) return;

                    $scope.source.loaded = 0;
                    var timeto = 100;

                    tick = $interval(function() {
                        if ($scope.source.loaded < timeto) {
                            $scope.source.loaded++;
                        } else {

                            var amount = $scope.source.amount * $scope.source.cash
                            $scope.addMoney()(amount)
                            $scope.source.loaded = 0;

                            if (!$scope.source.ismanaged) {
                                $scope.stopTick();
                                return;
                            }

                        }

                    }, $scope.source.loadtime);


                }

                $scope.stopTick = function() {
                    if (angular.isDefined(tick)) {
                        $interval.cancel(tick);
                        tick = undefined;
                    }
                }

                $scope.isAffordable = function() {
                    return ($scope.getMoney() >= $scope.source.price)
                }

                this.activateManager = function() {
                    $scope.scope.ismanaged = true;
                }

                $scope.$on('$destroy', function() {
                    // Make sure that the interval is destroyed too
                    $scope.stopFight();
                });

            },
            templateUrl: 'view1/cash-source.html'
        };
    }])
    .directive('cashManager', function() {
        return {
            restrict: 'E',
            scope: {
                manager: '=model',
                reduceMoney: '&',
                getMoney: '&',
                activateManager: '&'
            },
            controller: function($scope) {

                $scope.buy = function() {

                    if ($scope.isAffordable()) {
                        $scope.reduceMoney()($scope.manager.price);
                        $scope.manager.isBought = true;
                        $scope.activateManager()($scope.manager.sourceID)
                    }
                }

                $scope.isAffordable = function() {
                    return ($scope.getMoney() >= $scope.manager.price)
                }
            },
            templateUrl: 'view1/manager.html'
        }
    })

.filter('buyamount', function() {
    return function(base, exp, amount) {

        console.log(exp)
        console.log(amount)
        var total = base;
        var temp = base;
        for (var i = 1; i < amount; i++) {
            temp = temp*exp;
            total += temp;
        }
        return total;
    }
})

 .filter('sumOfValue', function () {
    return function (data, key) {
        // if (typeof (data) === 'undefined' && typeof (key) === 'undefined') {
        //     return 0;
        // }
        // var sum = 0;
        // for (var i = 0; i < data.length; i++) {
        //     sum = sum + data[i][key];
        // }
        console.log(data)
        return 1;
    }
})

.controller('ModalInstanceCtrl', function($scope, $modalInstance) {



    $scope.ok = function() {
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
