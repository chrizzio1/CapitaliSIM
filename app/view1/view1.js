'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
    });
}])

.controller('View1Ctrl', ['$scope', '$modal', '$interval', function($scope, $modal, $interval) {

    $scope.cashSources = [{
        order: 1,
        name: "Limonadenstand",
        cash: 1,
        price: 4,
        amount: 1,
        exp: 1.28,
        loadtime: 15,
        loaded: 0,
        ismanaged: false

    }, {
        order: 2,
        name: "Zeitungsstand",
        cash: 60,
        price: 60,
        amount: 0,
        exp: 1.15,
        loadtime: 35,
        loaded: 0,
        ismanaged: false
    }, {
        order: 3,
        name: "Autowaschanlage",
        cash: 900,
        price: 720,
        amount: 0,
        exp: 1.3,
        loadtime: 100,
        loaded: 0,
        ismanaged: false
    }, {
        order: 4,
        name: "Pizzeria",
        cash: 30000,
        price: 10000,
        amount: 0,
        exp: 1.3,
        loadtime: 200,
        loaded: 0,
        ismanaged: false
    }, {
        order: 5,
        name: "Donut Shop",
        cash: 100000,
        price: 100000,
        amount: 0,
        exp: 1.3,
        loadtime: 200,
        loaded: 0,
        ismanaged: false
    }]

    $scope.manager = [{
        name: "Louis Lemon",
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
        price: "10000",
        isBought: false,
        sourceID: 2
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
        },
        controller: function($scope, $interval) {

            var tick;

            $scope.buy = function() {

                if ($scope.isAffordable()) {
                    $scope.source.amount++;
                    $scope.reduceMoney()($scope.source.price);
                    $scope.source.price = $scope.source.price * $scope.source.exp

                }
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


.controller('ModalInstanceCtrl', function($scope, $modalInstance) {

    

    $scope.ok = function() {
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
