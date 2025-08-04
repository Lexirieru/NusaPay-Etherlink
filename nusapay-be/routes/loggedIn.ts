import express, { RequestHandler } from "express";

import {
  addPayrollData,
  addPayrollDetailsData,
  loadPayrollData,
  loadPayrollDetailsData,
  loadInvoiceData,
} from "../controllers/transactionController";

import {
  addOrUpdateEmployeeData,
  loadEmployeeDataFromGroup,
  addGroupName,
  addOrUpdateCompanyStats,
  addOrUpdateCompanyData,
  loadGroupName,
  deleteEmployeeDataFromGroup,
} from "../controllers/companyController";

const router = express.Router();

type RouteMethod = "get" | "post" | "put" | "delete";

type RouteDefinition = {
  method: RouteMethod;
  path: string;
  action: RequestHandler;
};

const routes: RouteDefinition[] = [
  // Payroll data

  {
    method: "post",
    path: "/loadInvoiceData",
    action: loadInvoiceData,
  },

  {
    method: "post",
    path: "/addPayrollData",
    action: addPayrollData,
  },
  {
    method: "get",
    path: "/loadPayrollData",
    action: loadPayrollData,
  },

  // Payroll details data
  {
    method: "post",
    path: "/addPayrollDetailsData",
    action: addPayrollDetailsData,
  },
  {
    method: "get",
    path: "/loadPayrollDetailsData",
    action: loadPayrollDetailsData,
  },
  // Employee Data
  {
    method: "post",
    path: "/addOrUpdateEmployeeData",
    action: addOrUpdateEmployeeData,
  },

  {
    method: "post",
    path: "/deleteEmployeeDataFromGroup",
    action: deleteEmployeeDataFromGroup,
  },

  {
    method: "post",
    path: "/loadEmployeeDataFromGroup",
    action: loadEmployeeDataFromGroup,
  },

  {
    method: "post",
    path: "/addGroupName",
    action: addGroupName,
  },

  {
    method: "post",
    path: "/loadGroupName",
    action: loadGroupName,
  },

  {
    method: "post",
    path: "/addOrUpdateCompanyStats",
    action: addOrUpdateCompanyStats,
  },
  {
    method: "post",
    path: "/addOrUpdateCompanyData",
    action: addOrUpdateCompanyData,
  },
];

routes.forEach((route) => {
  router[route.method](route.path, route.action);
});

export default router;
