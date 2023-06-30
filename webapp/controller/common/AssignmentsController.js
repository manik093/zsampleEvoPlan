sap.ui.define([
	"com/sample/zcheckplan/controller/BaseController"
 ], function (Controller) {
	"use strict";
	return Controller.extend("com.sample.zcheckplan.controller.BaseController", {
		onInit:function(){
			// init wont run here as this controlle doesnt have bounded view.
		},
		_SampleMethod:function(){
			console.log("sample, assignments controller");
		}
	});
 });