'use strict';

define(['angular', 'NProgress'], function (angular, NProgress) {

    angular.module('stat.controllers', [])

    .controller('navCtrl', ['$scope', '$location', 'RequestService', function ($scope, $location, RequestService) {

        $scope.logout = function () {
            NProgress.start();

            RequestService.logout().success(function () {

                NProgress.done();
                $location.path( '/login' );

            }).error(function () {
                NProgress.done();
            });
        };

    }])

    .controller('menuCtrl', ['$scope', '$stateParams', 'ProjectService', function ($scope, $stateParams, ProjectService) {
        ProjectService.query({}, function (list) {

            list.forEach(function (item, i, arr) {
                if( item.name === $stateParams.name ) item.active = 'active';
            });

            $scope.list = list;
        });
    }])

    .controller('loginCtrl', ['$scope', '$location', 'RequestService', function ($scope, $location, RequestService) {

        $scope.data = { email: '', password : '' };

        $scope.login = function () {
            if( $scope.data.email && $scope.data.password ){
                NProgress.start();

                RequestService.login( $scope.data ).success(function () {

                    NProgress.done();
                    $location.path( '/home' );

                }).error(function () {
                    NProgress.done();
                });
            }
        };

    }])

    .controller('consoleCtrl', ['$scope', 'ProjectService', function ($scope, ProjectService) {

        function consoleInit () {

            ProjectService.query({}, function (list) {
                $scope.list = list;

                $scope.data = {
                    name : list[0]['name'],
                    _id : list[0]['_id'],
                    token : list[0]['token']
                };
            });
        }

        consoleInit();
        

        $scope.change = function (item) {
            $scope.data = item;
        };

        $scope.remove = function (id) {
            NProgress.start();

            ProjectService.remove({id : id}, function () {
                consoleInit();
                NProgress.done();
            });
        };

    }])

    .controller('homeCtrl', ['$scope', 'ProjectService', function ($scope, ProjectService) {
        ProjectService.query({}, function (list) {
            $scope.list = list;
        });
    }])

    .controller('createProjectCtrl', ['$scope', '$location', 'ProjectService', function ($scope, $location, ProjectService) {
        $scope.data = { name : '' };

        $scope.createProject = function () {

            if( $scope.data.name ){

                NProgress.start();

                ProjectService.save($scope.data, function (data) {
                    NProgress.done();
                    $location.path('/home');
                });

            }
        };
    }])
    
    .controller('projectCtrl', ['$scope', '$stateParams', 'ProjectService', 'GroupService', 'ContentService', function ($scope, $stateParams, ProjectService, GroupService, ContentService) {
        var id = $stateParams.id;

        $scope.project = ProjectService.get({id : id});
        $scope.group = GroupService.query({projectID : id});
    }])
});