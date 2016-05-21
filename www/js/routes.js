angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
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

  .state('menu.notifikasi', {
    url: '/page3',
    views: {
      'side-menu21': {
        templateUrl: 'templates/notifikasi.html',
        controller: 'notifikasiCtrl'
      }
    }
  })
  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    abstract:true
  })
  .state('infobarang', {
    url: '/infobarang',
            templateUrl: 'templates/infobarang.html',
    controller: 'info',
    params: {
            obj: null
        }

  })
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('laporan', {
    url: '/laporan',
    templateUrl: 'templates/laporan.html',
    controller: 'laporanCtrl'
  })


$urlRouterProvider.otherwise('/login')



});
