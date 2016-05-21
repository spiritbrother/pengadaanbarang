angular.module('app.controllers', [])

.controller('barangCtrl', function($scope,$http,$rootScope,$state,$ionicHistory) {

  $scope.kembali=function(){
window.localStorage.removeItem("profile");
    $state.go("login");
  }
  $scope.ilang=true;
    $http({
    method: 'GET',
    url: 'http://plokotok.16mb.com/barang.php',
    params: {penempatan: JSON.parse(window.localStorage.getItem("profile"))[0].nama}
  }).then(function successCallback(response) {
    $scope.items=response.data;

    $scope.ilang=false;
    }, function errorCallback(response) {
      console.log(response)
      });
$scope.onTap=function(item){
  // alert(item.kode_barang+"panda");
  $ionicHistory.nextViewOptions({
    disableAnimate: false,
    disableBack: false
  });
$state.go("infobarang",{obj: item.kode_barang})
}
})

.controller('permintaanCtrl', function($scope) {

})

.controller('laporanCtrl', function($scope) {

})

.controller('loginCtrl', function($scope,$state,$http,$ionicHistory,$ionicNavBarDelegate) {
// if(JSON.parse(window.localStorage.getItem("profile")).length == 1){
//   $state.go("menu.barang")
// }else{
//   $state.go("login")
// }
$ionicNavBarDelegate.showBackButton(false);
$ionicHistory.nextViewOptions({
  disableAnimate: false,
  disableBack: false
});
window.localStorage.removeItem("profile");
$scope.data={}

$scope.panda=function(){
$ionicHistory.clearHistory();

  $http({
  method: 'GET',
  url: "http://plokotok.16mb.com/login.php",
  params: {username: $scope.data.username , password: $scope.data.password}
}).then(function successCallback(response) {
//  $cookies.put('user', response.data.user_lapangan);
  //alert($cookies.get("user"));
  if(response.data.error != "error"){
   window.localStorage.setItem("profile", JSON.stringify(response.data));
   console.log(JSON.parse(window.localStorage.getItem("profile")));

$state.go("menu.barang");
 }
   else{alert("username atau password anda salah")}
  }, function errorCallback(response) {
          alert("koneksi atau request error");
    });
  //
}
})

.controller('notifikasiCtrl', function($scope,$http) {
  $http({
  method: 'GET',
  url: 'http://plokotok.16mb.com/'
}).then(function successCallback(response) {
  $scope.items=response.data.barang;

  $scope.ilang=false;
  }, function errorCallback(response) {
    console.log(response)
    });

})
.controller('info', function($scope,$stateParams,$ionicHistory,$http,$ionicNavBarDelegate,$state ) {
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
  });
$scope.kembali=function(){$state.go("menu.barang")}
$scope.title=$stateParams;
$scope.ilang=true;
  $http({
  method: 'GET',
  url: 'http://plokotok.16mb.com/detailbarang.php',
  params: {kode_barang: $stateParams.obj }
}).then(function successCallback(response) {
  $scope.items=response.data;
console.log($scope.items)
  $scope.ilang=false;
  }, function errorCallback(response) {
    console.log(response)
    });
})
