'use strict';

/* Services */


// Demonstrate how to register services
angular.module('app.services', [])
.factory('DanhSachGiaoDichPrototype', ['$q', 'api', '$http', function($q, api, $http){
	
	var DanhSachGiaoDichPrototype = function(type, init){
		this.list = {};
		this.init = (function(){
			if (init) return function(){
				this.list = {};
				init.apply(this, arguments);
				return this;
			}; else return function(ho_va_ten, dia_chi_sdt){
				this.ho_va_ten = ho_va_ten||'';
				this.dia_chi_sdt = dia_chi_sdt||'';
				this.list = {};
				return this;
			}
		})();
		this.api = api[type];
		this.apiList = this.api.list;
		return this;
	};

	function index(data, manipulator){
		var list = {};
		for (var i in data) {
			if (manipulator) manipulator(data[i]);
			list[data[i].id] = data[i];
		};
		return list;
	}

	DanhSachGiaoDichPrototype.prototype = {
		get : function(id){
			var _this = this;
		    return $http.get(this.api.get(id))
		    .then(function(data){
		    	var obj = JSON.parse(JSON.stringify(_this.list[id]));
		    	obj.list = index(data.data.data);
		    	return obj;
		    });
	  	},

	  	delete: function(id){
	  		return $http.get(this.api.delete(id));
	  	},

	  	create: function(data){
	  		return $http.post(this.api.create, data)
	  		.then(function(data){
	  			console.log(data);
	  			return data.data.data;
	  		});
	  	},

	  	edit: function(data){
	  		return $http.post(this.api.edit, data);
	  	},

	  	fetch: function(){
	  		var _this = this;
	  		return $http.get(this.api.fetch)
	  		.then(function(data){
	  			_this.list = index(data.data.data, function(item){
	  				item.ho_va_ten = item.ho_ten;
	  				item.ho_ten = null;
	  			});
	  			return _this.list;
	  		});
	  	},

	  	ListEdit: function(data){
  			return $http.post(this.apiList.edit,data);
  		},
  		ListDelete: function(id){
			return $http.get(this.apiList.delete(id));
  		},
  		ListCreate: function(data){
			return $http.post(this.apiList.create,data)
			.then(function(data){
				return data.data.data;
			});
	  	}
	}

	return DanhSachGiaoDichPrototype;
}])
.factory('FormAList', ['DanhSachGiaoDichPrototype', function(DanhSachGiaoDichPrototype){
 	var DanhSachGiaoDich = new DanhSachGiaoDichPrototype('A');
  	return DanhSachGiaoDich;
}])
.factory('FormBList',['$q', 'DanhSachGiaoDichPrototype', function($q, DanhSachGiaoDichPrototype){
 	var DanhSachGiaoDich = new DanhSachGiaoDichPrototype('B');

  	return DanhSachGiaoDich;
}])
.factory('FormCList',['$q', 'DanhSachGiaoDichPrototype', function($q, DanhSachGiaoDichPrototype){
 	var DanhSachGiaoDich = new DanhSachGiaoDichPrototype('C');

  	return DanhSachGiaoDich;
}])
.factory('FormDList',['$q', 'DanhSachGiaoDichPrototype', function($q, DanhSachGiaoDichPrototype){
 	var DanhSachGiaoDich = new DanhSachGiaoDichPrototype('D');
 	var date = ['ngay_nhap_ma', 'ngay_nhan_kho_quang_chau', 'ngay_chuyen', 'ngay_nhan_kho_hn'];
 	DanhSachGiaoDich.get = function(id){
 		return DanhSachGiaoDichPrototype.prototype.get.call(this,id)
 		.then(function(data){
 			for (var j in data.list){
	 			for (var i in data.list[j]){
	 				if (date.indexOf(i)>=0 && data.list[j][i]) {
	 					console.log(parseInt(data.list[j][i]))
	 					data.list[j][i] = new Date(parseInt(data.list[j][i]));
	 				}
	 			}
	 		}
	 		return data;
 		});
 	};

 	DanhSachGiaoDich.ListEdit = function(data){
 		console.log(data.ngay_nhan_kho_hn);
 		for (var i in data){
			if (date.indexOf(i)>=0) {
				console.log(data[i])
				data[i] = new Date(data[i]).getTime();
			}
		}
 		return DanhSachGiaoDichPrototype.prototype.ListEdit.call(this,data);
 	};

  	return DanhSachGiaoDich;
}])
.factory('scrollTo', ["$window", '$timeout', function($window, $timeout){
	var document = $window.document;
	return function scrollTo(idOrName) {
		$timeout(function(){
			if(!idOrName) $window.scrollTo(0, 0);
			var el = document.getElementById(idOrName);
			if(!el) {
				el = document.getElementsByName(idOrName);
				if(el && el.length) el = el[0];
				else el = null;
			}
			if(el) el.scrollIntoView();
		});
	}
}]);