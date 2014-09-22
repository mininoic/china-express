'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('app', [
    'ngAnimate',
    'ngCookies',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'ui.load',
    'ui.jq',
    'ui.validate',
    'pascalprecht.translate',
    'app.filters',
    'app.services',
    'app.directives',
    'app.controllers'
  ])
.run(
  [          '$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;        
    }
  ]
)
.config(
  [          '$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($stateProvider,   $urlRouterProvider,   $controllerProvider,   $compileProvider,   $filterProvider,   $provide) {
        
        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive  = $compileProvider.directive;
        app.filter     = $filterProvider.register;
        app.factory    = $provide.factory;
        app.service    = $provide.service;
        app.constant   = $provide.constant;
        app.value      = $provide.value;

        $urlRouterProvider
            .otherwise('/app/formEList');
        $stateProvider            
            .state('app', {
                abstract: true,
                url: '/app',
                templateUrl: 'tpl/app.html'
            })

        var LFormL = ['A','B','C','D'];
        for (var i = 0; i < LFormL.length; i++) {
            var form = LFormL[i];
            $stateProvider
                .state('app.form'+form+'List', {
                    url: '/form'+form+'List',
                    templateUrl: 'tpl/app_form_'+form+'_list.html',
                    controller: 'FormAListCtrl',
                    resolve: {
                        danh_sach_giao_dich: [
                            'Form'+form+'List',
                            function(dataService){
                                return dataService.fetch();
                            }
                        ],
                        DataService: [
                            'Form'+form+'List',
                            function(dataService){
                                return dataService;
                            }
                        ]
                    }
                })
                .state('app.form'+form, {
                    url: '/form'+form+'/:id',
                    templateUrl: 'tpl/app_form_'+form+'.html',
                    controller: 'DonHangCtrl',
                    resolve: {
                        danh_sach_don_hang: [
                            'Form'+form+'List',
                            '$stateParams', '$state',
                            (function(form){
                                return function(dataService, $stateParams, $state){
                                    if ($stateParams.id) {
                                        return dataService.get($stateParams.id)
                                        .then(function(data){
                                            return data;
                                        }, function(err){
                                            console.log(err)
                                            $state.go('app.form'+form+'List')
                                        })
                                    } else return null;
                                }
                            })(form)
                        ],
                        DataService: [
                            'Form'+form+'List',
                            function(dataService){
                                return dataService;
                            }
                        ]
                    }
                })
        };

        $stateProvider 
            .state('app.formEList', {
                url: '/formEList',
                templateUrl: 'tpl/app_dashboard.html',
                controller: 'FormECtrl',
                resolve: {
                    formEData: ['$http','api',function($http,api){
                        return $http.get(api.formE)
                        .then(function(data){
                            return data.data;
                        })
                    }]
                }
            })
    }
  ]
)

.config(['$translateProvider', function($translateProvider){

  // Register a loader for the static files
  // So, the module will search missing translation tables under the specified urls.
  // Those urls are [prefix][langKey][suffix].
  $translateProvider.useStaticFilesLoader({
    prefix: 'l10n/',
    suffix: '.json'
  });

  // Tell the module what language to use by default
  $translateProvider.preferredLanguage('en');

  // Tell the module to store the language in the local storage
  $translateProvider.useLocalStorage();

}])

/**
 * jQuery plugin config use ui-jq directive , config the js and css files that required
 * key: function name of the jQuery plugin
 * value: array of the css js file located
 */
.constant('JQ_CONFIG', {
    easyPieChart:   ['js/jquery/charts/easypiechart/jquery.easy-pie-chart.js'],
    sparkline:      ['js/jquery/charts/sparkline/jquery.sparkline.min.js'],
    plot:           ['js/jquery/charts/flot/jquery.flot.min.js', 
                        'js/jquery/charts/flot/jquery.flot.resize.js',
                        'js/jquery/charts/flot/jquery.flot.tooltip.min.js',
                        'js/jquery/charts/flot/jquery.flot.spline.js',
                        'js/jquery/charts/flot/jquery.flot.orderBars.js',
                        'js/jquery/charts/flot/jquery.flot.pie.min.js'],
    slimScroll:     ['js/jquery/slimscroll/jquery.slimscroll.min.js'],
    sortable:       ['js/jquery/sortable/jquery.sortable.js'],
    nestable:       ['js/jquery/nestable/jquery.nestable.js',
                        'js/jquery/nestable/nestable.css'],
    filestyle:      ['js/jquery/file/bootstrap-filestyle.min.js'],
    slider:         ['js/jquery/slider/bootstrap-slider.js',
                        'js/jquery/slider/slider.css'],
    chosen:         ['js/jquery/chosen/chosen.jquery.min.js',
                        'js/jquery/chosen/chosen.css'],
    TouchSpin:      ['js/jquery/spinner/jquery.bootstrap-touchspin.min.js',
                        'js/jquery/spinner/jquery.bootstrap-touchspin.css'],
    wysiwyg:        ['js/jquery/wysiwyg/bootstrap-wysiwyg.js',
                        'js/jquery/wysiwyg/jquery.hotkeys.js'],
    dataTable:      ['js/jquery/datatables/jquery.dataTables.min.js',
                        'js/jquery/datatables/dataTables.bootstrap.js',
                        'js/jquery/datatables/dataTables.bootstrap.css'],
    vectorMap:      ['js/jquery/jvectormap/jquery-jvectormap.min.js', 
                        'js/jquery/jvectormap/jquery-jvectormap-world-mill-en.js',
                        'js/jquery/jvectormap/jquery-jvectormap-us-aea-en.js',
                        'js/jquery/jvectormap/jquery-jvectormap.css'],
    footable:       ['js/jquery/footable/footable.all.min.js',
                        'js/jquery/footable/footable.core.css']
    }
)


.constant('MODULE_CONFIG', {
    select2:        ['js/jquery/select2/select2.css',
                        'js/jquery/select2/select2-bootstrap.css',
                        'js/jquery/select2/select2.min.js',
                        'js/modules/ui-select2.js']
    }
)

.constant('api', (function(){
    var host = 'http://chuyenhang.mininoic.com/api/';
    var api = {
        host: 'http://chuyenhang.mininoic.com/api/',
        formE: host+'general'
    };
    var LFormL = ['A','B','C','D'];
    for (var i = 0; i < LFormL.length; i++) {
        var path = api.host+LFormL[i]+'/list/'; 
        var pathList = api.host+LFormL[i]+'/'; 
        api[LFormL[i]] = {
            fetch: pathList+'fetch',
            get: (function(path){ 
                return function(j){
                    return path+'get/'+j
                };
            })(pathList),
            edit: path+'edit',
            create: path+'create',
            delete: (function(path){ 
                return function(j){
                    return path+'delete/'+j
                };
            })(path),
            list: {
                edit: pathList+'edit',
                create: pathList+'create',
                delete: (function(path){ 
                    return function(j){
                        return path+'delete/'+j
                    };
                })(pathList),
            }
        }
    };
    return api;
})())
;