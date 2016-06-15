angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
// $ionicMaterialConfigProvider.enableForAllPlatforms();
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  $ionicConfigProvider.views.maxCache(0);
  $stateProvider



      .state('menu.barang', {
    url: '/barang',
    views: {
      'side-menu21': {
        templateUrl: 'templates/barang.html',
        controller: 'barangCtrl'
      }
    }
  })

  .state('menu.permintaan', {
    url: '/page2',
    views: {
      'side-menu21': {
        templateUrl: 'templates/permintaan.html',
        controller: 'permintaanCtrl'
      }
    }
  })
  .state('menu.infopermintaandanjawaban', {
    url: '/page2',
    views: {
      'side-menu21': {
        templateUrl: 'templates/infopermintaandanjawaban.html',
        controller: 'infopermintaandanjawaban'
      }
    },
    params: {
            obj: null
        }
  })
  .state('menu.notifikasi', {
    url: '/page3',
    views: {
      'side-menu21': {
        templateUrl: 'templates/notifikasi.html',
        controller: 'notifikasiCtrl'
      }
    }
  })
  .state('menu.notifikasikeluar', {
    url: '/notifikasikeluar',
    views: {
      'side-menu21': {
        templateUrl: 'templates/notifikasikeluar.html',
        controller: 'notifikasikeluar'
      }
    }
  })
  .state('menu.editlaporan', {
    url: '/editlaporan',
    views: {
      'side-menu21': {
        templateUrl: 'templates/editlaporan.html',
        controller: 'editlaporan'
      }
    },
    params: {
            obj: null
        }
  })
  .state('menu.infobarang', {
    url: '/infobarang',
    views: {
      'side-menu21': {
        templateUrl: 'templates/infobarang.html',
        controller: 'info'
      }
    },
    params: {
            obj: null
        }
  })
  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    abstract:true
  })
    .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('menu.laporan', {
    url: '/laporan',
    views: {
      'side-menu21': {
        templateUrl: 'templates/laporan.html',
        controller: 'laporanCtrl'
      }
    },
    params: {
            obj: null
        }
  })


$urlRouterProvider.otherwise('/login')



});
