module.exports = (app) => {
    var router = require("express").Router();
    const fileUpload = require("express-fileupload");
    app.use(fileUpload());
    const customer = require("../controller/customers.js");
    app.post("/getallcustomerbyadmin", customer.getallcustomerbyadmin);
    app.post("/getcustomerdetail", customer.getcustomerdetail);
    app.post("/getallcitiesbyadmin", customer.getallcitiesbyadmin);
    app.post("/addcustomer", customer.addcustomer);
    app.post("/deletecustomer", customer.deletecustomer);
    app.post("/updatemycustomer", customer.updatemycustomer);
    app.post("/getallcustomerinsights", customer.getallcustomerinsights);


    // app.post("/event/addevent", users.addevent);
    // app.post("/event/updateevent", users.updateevent);
    // app.post("/checkadmin", users.checkadmin);
  };