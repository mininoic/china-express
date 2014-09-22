
app
.controller('DonHangCtrl', ['$scope', 'danh_sach_don_hang', 'DanhSachGiaoDich', function($scope, danh_sach_don_hang, DanhSachGiaoDich) {

  $scope.danh_sach_don_hang = danh_sach_don_hang || DanhSachGiaoDich.init;

  var edit_index;

  function reset(){
    $scope.don_hang = {};
    $scope.create = true;
    edit_index = null;
  }

  reset();

  $scope.add = function(index){
    $scope.danh_sach_don_hang.list.unshift($scope.don_hang);
    reset();
    console.log($scope.danh_sach_don_hang.list);
  };

  $scope.edit = function(index){
    $scope.don_hang = $scope.danh_sach_don_hang.list[index];
    edit_index = index;
    $scope.create = false;
  };

  $scope.apply_edit = function(){
    $scope.danh_sach_don_hang.list[edit_index] = $scope.don_hang;
    reset();
  };
    
}])
;