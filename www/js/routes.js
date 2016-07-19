angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
// $ionicMaterialConfigProvider.enableForAllPlatforms();
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  $ionicConfigProvider.views.maxCache(0);
  $stateProvider


//untuk pergi ke page barang dengan side menu
      .state('menu.barang', {
    url: '/barang',
    views: {
      'side-menu21': {
        templateUrl: 'templates/barang.html',
        controller: 'barangCtrl'
      }
    }
  })
//untuk pergi ke page permintaan dengan side menu
  .state('menu.permintaan', {
    url: '/page2',
    views: {
      'side-menu21': {
        templateUrl: 'templates/permintaan.html',
        controller: 'permintaanCtrl'
      }
    }
  })
  //untuk pergi ke page info permintaan,jawaban,service,dan expired yang sudah kita lakukan
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
  //page notifikasi masuk
  .state('menu.notifikasi', {
    url: '/page3',
    views: {
      'side-menu21': {
        templateUrl: 'templates/notifikasi.html',
        controller: 'notifikasiCtrl'
      }
    }
  })
  //page notifikasi keluar
  .state('menu.notifikasikeluar', {
    url: '/notifikasikeluar',
    views: {
      'side-menu21': {
        templateUrl: 'templates/notifikasikeluar.html',
        controller: 'notifikasikeluar'
      }
    }
  })
  //page edit laporan yang salah
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
  //page info barang
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
  //side menu disamping
  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    abstract:true
  })
  //page login
    .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })
//page laporan
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

//page awal masuk ke android 
$urlRouterProvider.otherwise('/login')



});
