angular.module('app.controllers', [])
//untuk menghitung berapa jumlah notifikasi yang masuk
.controller('jumlahnotifikasimasuk',function($scope,$ionicModal,$http,$rootScope,$state,$ionicHistory){
//mendapatkan tempat untuk melihat berapa jumlah notifikasi instansi tertentu contoh matos mall
var tempat=JSON.parse(window.localStorage.getItem("profile"))[0].nama;
//fungsi untuk menghitung berapa jumlah notifikasi masuk yang ada
  function notif(){
    //memanggil web service jumlah notifikasi 
  $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/jumlahnotifikasi.php',{params:{penempatan: tempat }})
  .then(function(response){$scope.jumlah=response.data[0].jumlah;aksi()
      },function(response){})}
  //fungsi yang memanggil fungsi lain
      function aksi(){
        notif()
      }
      //menjalankan fungsi
    aksi()
  //endang
})
//menghitung jumlah notifikasi keluar
.controller('jumlahnotifikasikeluar',function($scope,$ionicModal,$http,$rootScope,$state,$ionicHistory){
//mendapatkan objek tempat dari localStorage
var tempat=JSON.parse(window.localStorage.getItem("profile"))[0].nama;
//mendeklarasikan objek tempat
$scope.tempat=tempat
//fungsi notifikasi
  function notif(){
  $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/jumlahnotifikasikeluar.php',{params:{penempatan: tempat }})
  .then(function(response){$scope.jumlah=response.data[0].jumlah;aksi()
      },function(response){})}
  //memanggil fungsi notifikasi
      function aksi(){
        notif()
      }
      //menjalankan fungsi notifikasi
    aksi()
  //endang
})
.controller('barangCtrl', function($scope,$ionicModal,$http,$rootScope,$state,$ionicHistory) {
  //jika didalam objek profile kosong maka masuk ke halaman login
if(window.localStorage.getItem("profile") == null){$state.go("login")}
  //objek untuk menjalankan fungsi logout di halaman barang.html
  $scope.kembali=function(){
    //menghilangkan objek profile yang kita simpan agar log orang yang sudah login terhapus
window.localStorage.removeItem("profile");
//pindah ke halaman login
    $state.go("login");
  }
  //ng-show ion-spinner true memperlihatkan ion-spinner
  $scope.ilang=true;
//merefresh data barang
  $scope.refresh=function (){
    $http({
    method: 'GET',
    //tempat web service kita
    url: 'https://pengadaanperalatan-spiritbro.c9users.io/webservice/barang.php',
    //mengesend permintaan kita ke webservice contoh: https://pengadaanperalatan-spiritbro.c9users.io/webservice/barang.php?penempatan=Matos Mall
    params: {penempatan: JSON.parse(window.localStorage.getItem("profile"))[0].nama}
  }).then(function successCallback(response) {
    //jika permintaan sukses memasukkan data barang ke dalam array
    $scope.items=response.data;
    //meghilangkan ion-spinner
    $scope.ilang=false;
    //menghilangkan spinner pull-refresh
 $scope.$broadcast('scroll.refreshComplete');
    }, function errorCallback(response) {
      //jika request gagal akan memperlihatkan tidak ada data barang
      alert("tidak ada data barang")
      //menghilangkan spinner pull-refresh
       $scope.$broadcast('scroll.refreshComplete');
      });}
      $scope.refresh()
//jika salah satu barang ditouch maka akan masuk ke page infobarang.html
$scope.onTap=function(item){
    //untuk menghilangkan tombol back
  $ionicHistory.nextViewOptions({
    disableAnimate: false,
    disableBack: false
  });
  //pergi ke page infobarang dengan parameter kode_barang
$state.go("menu.infobarang",{obj: item.kode_barang})
}
})

.controller('permintaanCtrl', function($scope,$http,$state,$ionicHistory,$ionicLoading) {
//tempat contoh matos mall
$scope.tempat=JSON.parse(window.localStorage.getItem("profile"))[0].nama;
$scope.ilang=true;
//select kode barang yang kita mau
$scope.select = function(kodebarang) {
      $scope.kodebarang=kodebarang;
}
//tempat contoh matos mall
var tempat=JSON.parse(window.localStorage.getItem("profile"))[0].nama;
//merubah format tanggal menjadi misal senin,18 juli 2016
var tanggal=new Date().getFullYear()+"-"+("0" + (new Date().getMonth() + 1)).slice(-2)+"-"+("0"+new Date().getDate()).slice(-2);
 //mendapatkan sisa saldo dari menjumlah barang yang kita punya lalu barang tadi dikurangi berapa permintaan yang sudah kita lakukan contoh 5 barang - 1 permintaan maka saldo menjadi 4
  $http({
  method: 'GET',
  url: 'https://pengadaanperalatan-spiritbro.c9users.io/webservice/barang.php',
  params: {penempatan: JSON.parse(window.localStorage.getItem("profile"))[0].nama}
}).then(function successCallback(response) {
  $scope.items=response.data;
    $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/pembeda.php', {params: {penempatan: tempat,jenis: "permintaan"}}).then(
    //jumlah saldo =jumlah barang-jumlah permintaan
    function(panda){$scope.jumlahsaldo=response.data.length-panda.data.length; console.log(panda.data); $scope.ilang=false;},function(response){}
  )
    }, function errorCallback(response) {
    //jika terjadi error maka permintaan akan dibatalkan
    console.log(response)
    });
//fungsi untuk menambah permintaan
    $scope.tambah=function(){
      //jika jumlah saldo lebih besar dari 0 maka permintaan bisa dilakukan
      if($scope.jumlahsaldo > 0  ){
        //jika kode barang sudah kita isi maka permintaan bisa dilakukan
if( $scope.kodebarang != null){
  //memperlihatkan loading proses permintaan barang
        $ionicLoading.show({
     template: 'Sedang memproses permintaan anda'
   })
        //memasukkan data permintaan tadi ke database
        $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/insertpermintaan.php', {params: {penempatan: tempat,kode_barang: $scope.kodebarang,jumlah_saldo: $scope.jumlahsaldo,jumlah_permintaan: 1,keterangan: $scope.keterangan,tanggal: tanggal,status:"Belum Konfirmasi"}})
        .then(function(response){
          //jika berhasil maka data kita tadi kita masukkan variabel kimbo
          console.log(response.data)
          //kimbo adalah variabel permintaan yang kita ambil dari database 
          var kimbo=response.data;
          //mengambil data yang terakhir dari database kita lalu kita masukkan ke tabel history untuk mengerti jika kita sudah membuat permintaan baru
          var cam=response.data.length-1;
$http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/inserthistory.php', {params: {penempatan: kimbo[cam].penempatan,kode_barang: kimbo[cam].kode_barang,jenis: "permintaan",tanggal: tanggal, idtabel: kimbo[cam].ID, status: 0 }})
.then(function(response){console.log(response.data);
  $ionicHistory.nextViewOptions({
    disableAnimate: false,
    disableBack: true
  });
  //menghilakan loading
  $ionicLoading.hide();
  //masuk ke page notifikasi keluar
  $state.go("menu.notifikasikeluar")},function(response){})
        },function(response){})}else{
//jika kode barang kosong maka akan keluar "kode barang tidak boleh kosong"
          $ionicLoading.hide();alert("kode barang tidak boleh kosong")}
      }else{
//jika saldo habis maka permintaan anda tidak bisa diproses
        $ionicLoading.hide();alert("maaf,saldo anda tidak mencukupi untuk permintaan baru")}
    }
    //endang
})
//memproses laporan
.controller('laporanCtrl', function($scope,$http,$stateParams,$ionicHistory,$state,$ionicLoading) {
 //radiobutton kondisi
  $scope.kondisi = [
     { text: "Layak", value: "layak" },
     { text: "Tidak Layak", value: "tidak layak" },
     { text: "Sangat Layak", value: "sangat layak" },
     ];
     //data kondisi yang nanti akan kita kirimkan ke database
  $scope.data = {
      kondisi: ''
    };
    //username pengirim
    var username=JSON.parse(window.localStorage.getItem("profile"))[0].username;
    //kode barang
    $scope.kode_barang=$stateParams.obj.kode_barang;
    //penempatan
    $scope.penempatan=$stateParams.obj.penempatan;
    //id di tabel history digunakan jika laporan ini sudah kita kirim maka status akan bernilai 1 yang berarti sudah mengirim laporan dan notifikasi akan berwarna abu abu
    $scope.idhistory=$stateParams.obj.id;
    //jenis laporan service atau expired
    $scope.laporan1=$stateParams.obj.laporan;
    var tanggal=new Date().getFullYear()+"-"+("0" + (new Date().getMonth() + 1)).slice(-2)+"-"+("0"+new Date().getDate()).slice(-2);
    //fungsi untuk mengirim laporan ke admin pusat
      $scope.laporan=function(){
    if($scope.data.kondisi != '' ){
      $ionicLoading.show({
   template: 'Sedang memproses laporan anda'
 })
      //jika berhasil akan menginsert laporan ke tabel laporan_to_admin
      $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/insertlaporan.php', {params: {laporan:$scope.laporan1,penempatan: $scope.penempatan,kode_barang: $scope.kode_barang,kondisi: $scope.data.kondisi,username_pengirim: username ,keterangan: $scope.keterangan,tanggal: tanggal,status:"Belum Konfirmasi"}})
      .then(function(response){
        //data laporan
        var kimbo=response.data;
//mendapatkan data laporan terakhir
        var cam=response.data.length-1;
//menginsert history laporan
$http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/inserthistory.php', {params: {penempatan: kimbo[cam].penempatan,kode_barang: kimbo[cam].kodebarang,jenis: "laporan "+$scope.laporan1,tanggal: tanggal, idtabel: kimbo[cam].ID, status: 0 }})
.then(function(response){console.log(response.data);
//mengupdate status menjadi 1 tanda sudah dikirim
$http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/update.php', {params: {tabel: "history",id: $scope.idhistory }})
.then(function(response){if(response.data.indexOf("berhasil") > -1){
  $ionicHistory.nextViewOptions({
    disableAnimate: false,
    disableBack: true
  });
  //menghilangkan loading
  $ionicLoading.hide()
  //menuju ke halaman notifikasi keluar
$state.go("menu.notifikasikeluar")
}
    },function(response){})
},function(response){})
      },function(response){})
    }else{
//jika belum memilih kondisi maka akan keluar maaf anda belum memilih kondisi
      $ionicLoading.hide();alert("maaf,anda belum memilih kondisi");}
  }
  //endang
})
//script untuk login
.controller('loginCtrl', function($scope,$state,$http,$ionicHistory,$ionicNavBarDelegate,$ionicLoading) {
//jika kita sudah login sebelumnya dan belum logout maka otomatis akan masuk ke halaman barang
if(window.localStorage.getItem("profile") != null){$state.go("menu.barang",{},{reload: true})}
//menyimpan data untuk login
$scope.data={}

$scope.panda=function(){
//memperlihatkan loading 
$ionicLoading.show({
template: 'Tunggu sedang login...'
})
//mengecek apakah username dan password sudah benar
  $http({
  method: 'GET',
  url: "https://pengadaanperalatan-spiritbro.c9users.io/webservice/login.php",
  params: {username: $scope.data.username , password: $scope.data.password}
}).then(function successCallback(response) {

  if(response.data.error != "error"){
//jika benar maka masuk ke halaman barang
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
//untuk mendapatkan notifikasi
.controller('notifikasiCtrl', function($scope,$http,$state,$ionicPopup) {

//fungsi untuk merubah tanggal menjadi contoh senin,18 juli 2016
  $scope.konversitanggal=function(tanggal) {
    var today = new Date(Date.parse(tanggal));
    var custom_months = [ "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember" ];
    var custom_days = [  "Minggu", "Senin" ,"Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"  ];
    var date = custom_days[ today.getDay() ]+" ,"+today.getDate() + "-" + custom_months[ today.getMonth() ] +"-" + today.getFullYear() ;
    return  date;
}
//tanggal kita sekarang contoh 2016-06-21
var tanggal=new Date().getFullYear()+"-"+("0" + (new Date().getMonth() + 1)).slice(-2)+"-"+("0"+new Date().getDate()).slice(-2);
var tempat=JSON.parse(window.localStorage.getItem("profile"))[0].nama;
//fungsi untuk masuk ke notifikasi tertentu
$scope.onTap=function(item){
  //masuk ke notifikasi jawaban lalu mengupdate tabel history status menjadi 1 tanda sudah pernah dibaca
  switch(item.jenis.substring(0,8).trim()) {
      case "jawaban":
        if(item.status==0){
          $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/update.php', {params: {tabel: "history",id: item.id}})
          .then(function(response){if(response.data.indexOf("berhasil") > -1){
            $state.go("menu.infopermintaandanjawaban",{obj: {tabel: "laporan_to_user",id: item.idtabel} })
          }
              },function(response){})
          //jika status 1 tidak usah mengupdate tabel history field status
        }else{$state.go("menu.infopermintaandanjawaban",{obj: {tabel: "laporan_to_user",id: item.idtabel} })}
        break;
        //jika jenis expired/service masuk ke halaman laporan dengan mengirim obj dengan parameter seperti dibawah
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
//memperlihatkan ion spinner
$scope.ilang=true;
//untuk expired
var a=[];
//untuk service
var b=[];
//untuk jawaban
var c=[];
//array yang berisi semua jenis notifikasi
$scope.tanggalakhir=[];

//mendapatkan tabel history notifikasi
$http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/semua.php', {params: {penempatan: tempat}})
.then(function(response){$scope.tanggalakhir=response.data.reverse();$scope.ilang=false;
    },function(response){})
$scope.refresh=function(){
//notifikasi tanggal akhir
$http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/cektanggalakhir.php', {params: {penempatan: tempat,tanggal_akhir: tanggal }})
.then(function(response){
  //jika di tabel barang ada barang yang sudah expired maka kita masukkan ke array "a" untuk dimasukkan ke dalam tabel history
if(response.data.length!=0){
  //untuk setiap data barang dengan tanggal yang sudah expired maka kita masukkan ke dalam array "a"
  angular.forEach(response.data,function(value){
    a.push({penempatan: value.penempatan,kode_barang: value.kode_barang,jenis: "expired",tanggal: tanggal, idtabel: value.ID, status: "0" })
  })
//lalu kita mengambil data dari database melalui webservice dengan data berupa semua barang yang expired
  $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/historytanggalakhir.php', {params: {penempatan: tempat }})
  .then(function(response){
 //jika tabel history kosong maka array yang sudah kita buat tadi kita masukkan ke dalam tabel history
  if(response.data.length==0){
 $scope.$broadcast('scroll.refreshComplete');
    angular.forEach(a,function(value){
      $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/inserthistory.php', {params: {penempatan: value.penempatan,kode_barang: value.kode_barang,jenis: value.jenis,tanggal: value.tanggal, idtabel: value.idtabel, status: parseInt(value.status) }})
      .then(function(response){console.log(response) },function(response){}); })
  //jika ada data di tabel history maka data tadi kita bandingkan dengan data di array jika ada data yang berbeda maka kita insert ke tabel history 
  }else if(response.data.length!=0){
 $scope.$broadcast('scroll.refreshComplete');
        $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/pembeda.php', {params: {penempatan: tempat,jenis: "expired"}})
    .then(function(response){console.log(response.data)
 //fungsi untuk mencari perbedaaan array yang kita buat dengan array di tabel history
      var berakhir = a.filter(function(current){
          return response.data.filter(function(current_b){
              return current_b.penempatan == current.penempatan && current_b.kode_barang == current.kode_barang && current_b.jenis == current.jenis  && current_b.idtabel == current.idtabel
          }).length == 0
      });
      //fungsi untuk memasukkan data  ke array yang sudah kita buat yang paling atas sendiri
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
//melihat info barang yang kita punya 
.controller('info', function($scope,$stateParams,$ionicHistory,$http,$ionicNavBarDelegate,$state ) {
//kembali ke halaman barang
$scope.kembali=function(){$state.go("menu.barang")}
//judulnya kita buat kodebarang kita
$scope.title=$stateParams;
//ion spinner 
$scope.ilang=true;
  //mendapatkan detail barang dari webservice
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
//untuk mendapatkan info permintaan,service,laporan,dan expired,jawaban
.controller('infopermintaandanjawaban', function($scope,$http,$state,$stateParams) {
//ion spinner
$scope.ilang=false;
//menghilangkan tombol edit laporan
$scope.edit=false;
//jika tabel merupakan laporan to admin maka tombol edit laporan akan muncul untuk mengedit laporan
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
//memperlihatkan detail notifikasi
  $http.get('https://pengadaanperalatan-spiritbro.c9users.io/webservice/detailsemua.php', {params: $stateParams.obj })
  .then(function(response){
    $scope.detail=response.data[0];console.log(response.data);  $scope.ilang=true;
      },function(response){})
  //menuju ke halaman editlaporan.html
      $scope.editlaporan=function(){
        $state.go("menu.editlaporan",{obj: {keterangan:$scope.detail.keterangan,id: $scope.detail.ID,kondisi: $scope.detail.kondisi,kode_barang:$scope.detail.kodebarang,penempatan:$scope.detail.penempatan} })
      }
      //endang
})
//untuk mengedit laporan
.controller('editlaporan', function($scope,$http,$stateParams,$ionicHistory,$state) {
  //untuk memilih kondisi
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
//untuk mengedit laporan
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
//memperlihatkan notifikasi keluar
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
