'use strict';

define(['angular', './router', 'angular-ui-router', './controllers', 'jquery', 'bootstrap'], function (angular, router) {

    angular.module('stat', ['ui.router', 'Controllers'])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        router($stateProvider, $urlRouterProvider);
    }]);

    angular.bootstrap(document, ['stat']);

});