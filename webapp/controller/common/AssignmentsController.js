sap.ui.define([
	"com/sample/zcheckplan/controller/BaseController"
 ], function (Controller) {
	"use strict";
	return Controller.extend("com.sample.zcheckplan.controller.BaseController", {
		onInit:function(){
			console.log("manik");
		},
		_SampleMethod:function(){
			console.log(this);
		}
	});
 });