angular.module('app.controllers', [])
.controller('jumlahnotifikasimasuk',function($scope,$ionicModal,$http,$rootScope,$state,$ionicHistory){
var tempat=JSON.parse(window.localStorage.getItem("profile"))[0].nama;
  function notif(){
  $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/jumlahnotifikasi.php',{params:{penempatan: tempat }})
  .then(function(response){$scope.jumlah=response.data[0].jumlah;aksi()
      },function(response){})}
      function aksi(){
        notif()
      }
    aksi()
  //endang
})
.controller('jumlahnotifikasikeluar',function($scope,$ionicModal,$http,$rootScope,$state,$ionicHistory){
var tempat=JSON.parse(window.localStorage.getItem("profile"))[0].nama;
$scope.tempat=tempat
  function notif(){
  $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/jumlahnotifikasikeluar.php',{params:{penempatan: tempat }})
  .then(function(response){$scope.jumlah=response.data[0].jumlah;aksi()
      },function(response){})}
      function aksi(){
        notif()
      }
    aksi()
  //endang
})
.controller('barangCtrl', function($scope,$ionicModal,$http,$rootScope,$state,$ionicHistory) {
if(window.localStorage.getItem("profile") == null){$state.go("login")}
  $scope.kembali=function(){
window.localStorage.removeItem("profile");
    $state.go("login");
  }
  $scope.ilang=true;
  $scope.refresh=function (){
    $http({
    method: 'GET',
    url: 'https://pengadaanperalatan-spiritbro.c9users.io/webservice/barang.php',
    params: {penempatan: JSON.parse(window.localStorage.getItem("profile"))[0].nama}
  }).then(function successCallback(response) {
    $scope.items=response.data;
    $scope.ilang=false;
 $scope.$broadcast('scroll.refreshComplete');
    }, function errorCallback(response) {
      alert("tidak ada data barang")
       $scope.$broadcast('scroll.refreshComplete');
      });}
      $scope.refresh()
$scope.onTap=function(item){
  // alert(item.kode_barang+"panda");
  $ionicHistory.nextViewOptions({
    disableAnimate: false,
    disableBack: false
  });
$state.go("menu.infobarang",{obj: item.kode_barang})
}
})

.controller('permintaanCtrl', function($scope,$http,$state,$ionicHistory,$ionicLoading) {
$scope.tempat=JSON.parse(window.localStorage.getItem("profile"))[0].nama;
$scope.ilang=true;
$scope.select = function(kodebarang) {

    $scope.kodebarang=kodebarang;
}

var tempat=JSON.parse(window.localStorage.getItem("profile"))[0].nama;
var tanggal=new Date().getFullYear()+"-"+("0" + (new Date().getMonth() + 1)).slice(-2)+"-"+("0"+new Date().getDate()).slice(-2);
  $http({
  method: 'GET',
  url: 'https://pengadaanperalatan-spiritbro.c9users.io/webservice/barang.php',
  params: {penempatan: JSON.parse(window.localStorage.getItem("profile"))[0].nama}
}).then(function successCallback(response) {
  $scope.items=response.data;
    $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/pembeda.php', {params: {penempatan: tempat,jenis: "permintaan"}}).then(
    function(panda){$scope.jumlahsaldo=response.data.length-panda.data.length; console.log(panda.data); $scope.ilang=false;},function(response){}
  )
    }, function errorCallback(response) {
    console.log(response)
    });
    $scope.tambah=function(){
      if($scope.jumlahsaldo > 0  ){
if( $scope.kodebarang != null){
        $ionicLoading.show({
     template: 'Sedang memproses permintaan anda'
   })
        $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/insertpermintaan.php', {params: {penempatan: tempat,kode_barang: $scope.kodebarang,jumlah_saldo: $scope.jumlahsaldo,jumlah_permintaan: 1,keterangan: $scope.keterangan,tanggal: tanggal,status:"Belum Konfirmasi"}})
        .then(function(response){
          console.log(response.data)
          var kimbo=response.data;
          var cam=response.data.length-1;
$http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/inserthistory.php', {params: {penempatan: kimbo[cam].penempatan,kode_barang: kimbo[cam].kode_barang,jenis: "permintaan",tanggal: tanggal, idtabel: kimbo[cam].ID, status: 0 }})
.then(function(response){console.log(response.data);
  $ionicHistory.nextViewOptions({
    disableAnimate: false,
    disableBack: true
  });
  $ionicLoading.hide();
  $state.go("menu.notifikasikeluar")},function(response){})
        },function(response){})}else{$ionicLoading.hide();alert("kode barang tidak boleh kosong")}
      }else{$ionicLoading.hide();alert("maaf,saldo anda tidak mencukupi untuk permintaan baru")}
    }
    //endang
})

.controller('laporanCtrl', function($scope,$http,$stateParams,$ionicHistory,$state,$ionicLoading) {
  $scope.kondisi = [
     { text: "Layak", value: "layak" },
     { text: "Tidak Layak", value: "tidak layak" },
     { text: "Sangat Layak", value: "sangat layak" },
     ];
  $scope.data = {
      kondisi: ''
    };
    var username=JSON.parse(window.localStorage.getItem("profile"))[0].username;
    $scope.kode_barang=$stateParams.obj.kode_barang;
    $scope.penempatan=$stateParams.obj.penempatan;
    $scope.idhistory=$stateParams.obj.id;
    $scope.laporan1=$stateParams.obj.laporan;
    var tanggal=new Date().getFullYear()+"-"+("0" + (new Date().getMonth() + 1)).slice(-2)+"-"+("0"+new Date().getDate()).slice(-2);
      $scope.laporan=function(){
    if($scope.data.kondisi != '' ){
      $ionicLoading.show({
   template: 'Sedang memproses laporan anda'
 })
      $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/insertlaporan.php', {params: {laporan:$scope.laporan1,penempatan: $scope.penempatan,kode_barang: $scope.kode_barang,kondisi: $scope.data.kondisi,username_pengirim: username ,keterangan: $scope.keterangan,tanggal: tanggal,status:"Belum Konfirmasi"}})
      .then(function(response){
        var kimbo=response.data;
        var cam=response.data.length-1;
$http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/inserthistory.php', {params: {penempatan: kimbo[cam].penempatan,kode_barang: kimbo[cam].kodebarang,jenis: "laporan "+$scope.laporan1,tanggal: tanggal, idtabel: kimbo[cam].ID, status: 0 }})
.then(function(response){console.log(response.data);
$http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/update.php', {params: {tabel: "history",id: $scope.idhistory }})
.then(function(response){if(response.data.indexOf("berhasil") > -1){
  $ionicHistory.nextViewOptions({
    disableAnimate: false,
    disableBack: true
  });
  $ionicLoading.hide()
$state.go("menu.notifikasikeluar")
}
    },function(response){})
},function(response){})
      },function(response){})
    }else{$ionicLoading.hide();alert("maaf,anda belum memilih kondisi");}
  }
  //endang
})

.controller('loginCtrl', function($scope,$state,$http,$ionicHistory,$ionicNavBarDelegate,$ionicLoading) {
if(window.localStorage.getItem("profile") != null){$state.go("menu.barang",{},{reload: true})}

$ionicHistory.nextViewOptions({
  disableAnimate: false,
  disableBack: false
});
$scope.data={}

$scope.panda=function(){
$ionicHistory.clearHistory();
$ionicLoading.show({
template: 'Tunggu sedang login...'
})
  $http({
  method: 'GET',
  url: "https://pengadaanperalatan-spiritbro.c9users.io/webservice/login.php",
  params: {username: $scope.data.username , password: $scope.data.password}
}).then(function successCallback(response) {
//  $cookies.put('user', response.data.user_lapangan);
  //alert($cookies.get("user"));
  if(response.data.error != "error"){
   window.localStorage.setItem("profile", JSON.stringify(response.data));
   console.log(JSON.parse(window.localStorage.getItem("profile")));
$ionicLoading.hide()
$state.go("menu.barang");
 }
   else{
$ionicLoading.hide()
     alert("username atau password anda salah")}
  }, function errorCallback(response) {
    $ionicLoading.hide()
          alert("koneksi atau request error");
    });
  //
}
})

.controller('notifikasiCtrl', function($scope,$http,$state,$ionicPopup) {
//console.log(angular.element("notifikasi"))

  $scope.konversitanggal=function(tanggal) {
    var today = new Date(Date.parse(tanggal));
    var custom_months = [ "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember" ];
    var custom_days = [  "Minggu", "Senin" ,"Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"  ];
    var date = custom_days[ today.getDay() ]+" ,"+today.getDate() + "-" + custom_months[ today.getMonth() ] +"-" + today.getFullYear() ;
    return  date;
}
var tanggal=new Date().getFullYear()+"-"+("0" + (new Date().getMonth() + 1)).slice(-2)+"-"+("0"+new Date().getDate()).slice(-2);
var tempat=JSON.parse(window.localStorage.getItem("profile"))[0].nama;
$scope.onTap=function(item){
  switch(item.jenis.substring(0,8).trim()) {
      case "jawaban":
        if(item.status==0){
          $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/update.php', {params: {tabel: "history",id: item.id}})
          .then(function(response){if(response.data.indexOf("berhasil") > -1){
            $state.go("menu.infopermintaandanjawaban",{obj: {tabel: "laporan_to_user",id: item.idtabel} })
          }
              },function(response){})
        }else{$state.go("menu.infopermintaandanjawaban",{obj: {tabel: "laporan_to_user",id: item.idtabel} })}
        break;
        case "expired":
            if(item.status==0){
              $state.go("menu.laporan",{obj: {laporan:"expired",kode_barang: item.kode_barang,penempatan: item.penempatan,id:item.id}});
            }else{$state.go("menu.infopermintaandanjawaban",{obj: {tabel: "barang",id: item.idtabel} })}
            break;
        case "service":
            if(item.status==0){
              $state.go("menu.laporan",{obj: {laporan:"service",kode_barang: item.kode_barang,penempatan: item.penempatan,id:item.id}});
            }else{$state.go("menu.infopermintaandanjawaban",{obj: {tabel: "barang",id: item.idtabel} })}
          break;

}
}
$scope.ilang=true;
var a=[];
var b=[];
var c=[];
$scope.tanggalakhir=[];

//mendapatkan tabel history notifikasi
$http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/semua.php', {params: {penempatan: tempat}})
.then(function(response){$scope.tanggalakhir=response.data.reverse();$scope.ilang=false;
    },function(response){})
$scope.refresh=function(){
//notifikasi tanggal akhir
$http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/cektanggalakhir.php', {params: {penempatan: tempat,tanggal_akhir: tanggal }})
.then(function(response){
if(response.data.length!=0){
  angular.forEach(response.data,function(value){
    a.push({penempatan: value.penempatan,kode_barang: value.kode_barang,jenis: "expired",tanggal: tanggal, idtabel: value.ID, status: "0" })
  })

  $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/historytanggalakhir.php', {params: {penempatan: tempat }})
  .then(function(response){
  if(response.data.length==0){
 $scope.$broadcast('scroll.refreshComplete');
    angular.forEach(a,function(value){
      $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/inserthistory.php', {params: {penempatan: value.penempatan,kode_barang: value.kode_barang,jenis: value.jenis,tanggal: value.tanggal, idtabel: value.idtabel, status: parseInt(value.status) }})
      .then(function(response){console.log(response) },function(response){}); })
  }else if(response.data.length!=0){
 $scope.$broadcast('scroll.refreshComplete');
        $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/pembeda.php', {params: {penempatan: tempat,jenis: "expired"}})
    .then(function(response){console.log(response.data)
      var berakhir = a.filter(function(current){
          return response.data.filter(function(current_b){
              return current_b.penempatan == current.penempatan && current_b.kode_barang == current.kode_barang && current_b.jenis == current.jenis  && current_b.idtabel == current.idtabel
          }).length == 0
      });
      angular.forEach(berakhir,function(value){
        $scope.tanggalakhir.unshift(value);
        $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/inserthistory.php', {params: {penempatan: value.penempatan,kode_barang: value.kode_barang,jenis: value.jenis,tanggal: value.tanggal, idtabel: value.idtabel, status: parseInt(value.status) }})
        .then(function(response){console.log(response) },function(response){}); })

     },function(response){console.log(response)})

  }
  },function(response){});
}
},function(response){});
//notifikasi tanggal service
$http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/cektanggalservice.php', {params: {penempatan: tempat,tanggal_service: tanggal }})
.then(function(response){
if(response.data.length!=0){
  angular.forEach(response.data,function(value){
    b.push({penempatan: value.penempatan,kode_barang: value.kode_barang,jenis: "service",tanggal: tanggal, idtabel: value.ID, status: "0" })
  })

  $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/historytanggalservice.php', {params: {penempatan: tempat }})
  .then(function(response){
  if(response.data.length==0){
 $scope.$broadcast('scroll.refreshComplete');
    angular.forEach(b,function(value){
      $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/inserthistory.php', {params: {penempatan: value.penempatan,kode_barang: value.kode_barang,jenis: value.jenis,tanggal: value.tanggal, idtabel: value.idtabel, status: parseInt(value.status) }})
      .then(function(response){console.log(response) },function(response){}); })
  }else if(response.data.length!=0){
 $scope.$broadcast('scroll.refreshComplete');
        $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/pembeda.php', {params: {penempatan: tempat,jenis: "service"}})
    .then(function(response){console.log(response.data)
      var berakhir = b.filter(function(current){
          return response.data.filter(function(current_b){
              return current_b.penempatan == current.penempatan && current_b.kode_barang == current.kode_barang && current_b.jenis == current.jenis &&  current_b.idtabel == current.idtabel
          }).length == 0
      });
      angular.forEach(berakhir,function(value){
        $scope.tanggalakhir.unshift(value);
        $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/inserthistory.php', {params: {penempatan: value.penempatan,kode_barang: value.kode_barang,jenis: value.jenis,tanggal: value.tanggal, idtabel: value.idtabel, status: parseInt(value.status) }})
        .then(function(response){console.log(response) },function(response){}); })

     },function(response){console.log(response)})

  }
  },function(response){});
}
},function(response){});
//notifikasi jawaban
$http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/cekjawaban.php', {params: {penempatan: tempat,tanggal: tanggal }})
.then(function(response){
if(response.data.length!=0){
  angular.forEach(response.data,function(value){
    c.push({penempatan: value.penempatan,kode_barang: value.kode_barang,jenis: "jawaban "+value.jawab,tanggal: tanggal, idtabel: value.ID, status: "0" })
  })

  $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/historyjawaban.php', {params: {penempatan: tempat }})
  .then(function(response){
  if(response.data.length==0){
 $scope.$broadcast('scroll.refreshComplete');
    angular.forEach(c,function(value){
      $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/inserthistory.php', {params: {penempatan: value.penempatan,kode_barang: value.kode_barang,jenis: value.jenis,tanggal: value.tanggal, idtabel: value.idtabel, status: parseInt(value.status) }})
      .then(function(response){console.log(response) },function(response){}); })
  }else if(response.data.length!=0){
 $scope.$broadcast('scroll.refreshComplete');
        $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/pembeda.php', {params: {penempatan: tempat,jenis: "jawaban"}})
    .then(function(response){console.log(response.data)
      var berakhir = c.filter(function(current){
          return response.data.filter(function(current_b){
              return current_b.penempatan == current.penempatan && current_b.kode_barang == current.kode_barang && current_b.jenis == current.jenis  && current_b.idtabel == current.idtabel
          }).length == 0
      });
      angular.forEach(berakhir,function(value){
        $scope.tanggalakhir.unshift(value);
        $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/inserthistory.php', {params: {penempatan: value.penempatan,kode_barang: value.kode_barang,jenis: value.jenis,tanggal: value.tanggal, idtabel: value.idtabel, status: parseInt(value.status) }})
        .then(function(response){console.log(response) },function(response){}); })

     },function(response){console.log(response)})

  }
  },function(response){});
}
},function(response){});}
$scope.refresh()
//endang


})
.controller('info', function($scope,$stateParams,$ionicHistory,$http,$ionicNavBarDelegate,$state ) {

$scope.kembali=function(){$state.go("menu.barang")}
$scope.title=$stateParams;
$scope.ilang=true;
  $http({
  method: 'GET',
  url: 'https://pengadaanperalatan-spiritbro.c9users.io/webservice/detailbarang.php',
  params: {kode_barang: $stateParams.obj }
}).then(function successCallback(response) {
  $scope.items=response.data;
console.log($scope.items)
  $scope.ilang=false;
  }, function errorCallback(response) {
    console.log(response)
    });
})
.controller('infopermintaandanjawaban', function($scope,$http,$state,$stateParams) {
$scope.ilang=false;
$scope.edit=false;
  switch($stateParams.obj.tabel) {
              case "laporan_to_user":
              $scope.edit=false;
        $scope.title="Jawaban dari admin";
                break;
                case "laporan_to_admin":
          $scope.title="Laporan ke admin";
          $scope.edit=true;
                  break;
              default:
            $scope.edit=false;
$scope.title=$stateParams.obj.tabel;
            break;}

  $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/detailsemua.php', {params: $stateParams.obj })
  .then(function(response){
    $scope.detail=response.data[0];console.log(response.data);  $scope.ilang=true;
      },function(response){})
      $scope.editlaporan=function(){
        $state.go("menu.editlaporan",{obj: {keterangan:$scope.detail.keterangan,id: $scope.detail.ID,kondisi: $scope.detail.kondisi,kode_barang:$scope.detail.kodebarang,penempatan:$scope.detail.penempatan} })
      }
      //endang
})
.controller('editlaporan', function($scope,$http,$stateParams,$ionicHistory,$state) {
  $scope.kondisi = [
     { text: "Layak", value: "layak" },
     { text: "Tidak Layak", value: "tidak layak" },
     { text: "Sangat Layak", value: "sangat layak" },
     ];
  $scope.data = {
      kondisi: $stateParams.obj.kondisi
    };
    var username=JSON.parse(window.localStorage.getItem("profile"))[0].username;
    $scope.kode_barang=$stateParams.obj.kode_barang;
    $scope.penempatan=$stateParams.obj.penempatan;
    $scope.keterangan=$stateParams.obj.keterangan;

    $scope.editlaporan=function(){
    if($scope.data.kondisi != '' ){
      $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/updatelaporan.php', {params: {id: $stateParams.obj.id,kondisi: $scope.data.kondisi,keterangan: $scope.keterangan}})
      .then(function(response){
        $ionicHistory.nextViewOptions({
          disableAnimate: false,
          disableBack: true
        });
$state.go("menu.barang")
      },function(response){})
    }else{alert("maaf,anda belum memilih kondisi")}
  }
  //endang
})
.controller('notifikasikeluar',function($scope,$state,$http){

  $scope.konversitanggal=function(tanggal) {
    var today = new Date(Date.parse(tanggal));
    var custom_months = [ "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember" ];
    var custom_days = [  "Minggu", "Senin" ,"Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"  ];
    var date = custom_days[ today.getDay() ]+" ,"+today.getDate() + "-" + custom_months[ today.getMonth() ] +"-" + today.getFullYear() ;
    return  date;
}
$scope.ilang=true;
var tanggal=new Date().getFullYear()+"-"+("0" + (new Date().getMonth() + 1)).slice(-2)+"-"+("0"+new Date().getDate()).slice(-2);
  var tempat=JSON.parse(window.localStorage.getItem("profile"))[0].nama;
  $scope.refresh=function(){
  $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/notifikasikeluar.php', {params: {penempatan: tempat}})
  .then(function(response){$scope.tanggalakhir=response.data.reverse();$scope.ilang=false; $scope.$broadcast('scroll.refreshComplete');
      },function(response){})}
      $scope.refresh();
  $scope.onTap=function(item){
    switch(item.jenis.substring(0,8).trim()) {
      case "perminta":
      if(item.status==0){
        $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/update.php', {params: {tabel: "history",id: item.id}})
        .then(function(response){if(response.data.indexOf("berhasil") > -1){
          $state.go("menu.infopermintaandanjawaban",{obj: {tabel: "permintaan",id: item.idtabel} })
        }
            },function(response){})
      }else{$state.go("menu.infopermintaandanjawaban",{obj: {tabel: "permintaan",id: item.idtabel} })}
            break;
            case "laporan":
                if(item.status==0){
                  $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/update.php', {params: {tabel: "history",id: item.id}})
                  .then(function(response){if(response.data.indexOf("berhasil") > -1){
                    $state.go("menu.infopermintaandanjawaban",{obj: {tabel: "laporan_to_admin",id: item.idtabel} })
                  }
                      },function(response){})
                }else{$state.go("menu.infopermintaandanjawaban",{obj: {tabel: "laporan_to_admin",id: item.idtabel} })}
              break;
        }}
          //endang
})
