sap.ui.define([
	"com/sample/zcheckplan/controller/common/AssignmentsController",
	"com/sample/zcheckplan/model/formatter",
], function (Controller,formatter) {
	"use strict";
	return Controller.extend("com.sample.zcheckplan.controller.demands.ResourceTree", {
		formatter:formatter,
		onInit: function () {
			
		}
	});
});