﻿var storefrontAppDependencies = [
    'ngStorage',
    'pascalprecht.translate',
    'ngSanitize',
    'ngAnimate',
    'ui.bootstrap',
    'vcRecaptcha',
    'storefrontApp.consts',
    'mgo-angular-wizard'
];
var storefrontApp = angular.module('storefrontApp', storefrontAppDependencies);

storefrontApp.factory('httpErrorInterceptor', [
    '$q', '$rootScope', function ($q, $rootScope) {
        var httpErrorInterceptor = {};

        httpErrorInterceptor.responseError = function (rejection) {
            if (rejection.data && rejection.data.message) {
                $rootScope.$broadcast('storefrontError', {
                    type: 'error',
                    title: [rejection.config.method, rejection.config.url, rejection.status, rejection.statusText, rejection.data.message].join(' '),
                    message: rejection.data.stackTrace
                });
            }
            return $q.reject(rejection);
        };
        httpErrorInterceptor.requestError = function (rejection) {
            if (rejection.data && rejection.data.message) {
                $rootScope.$broadcast('storefrontError', {
                    type: 'error',
                    title: [rejection.config.method, rejection.config.url, rejection.status, rejection.statusText, rejection.data.message].join(' '),
                    message: rejection.data.stackTrace
                });
            }
            return $q.reject(rejection);
        };

        return httpErrorInterceptor;
    }
]);

storefrontApp.factory('themeInterceptor', ['$q', 'baseUrl', function ($q, baseUrl) {
    var themeInterceptor = {};

    themeInterceptor.request = function (config) {
        if (config.url.startsWith('storefrontapi') || config.url.startsWith('themes')) {
            config.url = baseUrl + config.url;
        }
        return config || $q.when(config);
    };

    return themeInterceptor;
}
]);

storefrontApp.config(['$locationProvider', '$httpProvider', 'baseUrl', '$translateProvider', 'vcRecaptchaServiceProvider', 'reCaptchaKey', function ($locationProvider, $httpProvider, baseUrl, $translateProvider, vcRecaptchaServiceProvider, reCaptchaKey) {
    //$locationProvider.html5Mode({ enabled: true, requireBase: false, rewriteLinks: false });
    $httpProvider.interceptors.push('httpErrorInterceptor');
    $httpProvider.interceptors.push('themeInterceptor');

    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
    $translateProvider.useUrlLoader(baseUrl + 'themes/localization.json');
    $translateProvider.preferredLanguage('en');

    // wizardConfigProvider.prevString = 'Back';
    // wizardConfigProvider.nextString = 'Continue';
    // wizardConfigProvider.submitString = 'Complete';

    vcRecaptchaServiceProvider.setSiteKey(reCaptchaKey);
}]);

storefrontApp.run(['$rootScope', '$window', function ($rootScope, $window) {
    $rootScope.print = function () {
        $window.print();
    };
}]);
