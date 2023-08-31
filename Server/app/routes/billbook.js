module.exports = (app) => {
    var router = require("express").Router();
    const fileUpload = require("express-fileupload");
    app.use(fileUpload());
    const bills = require("../controller/billbook");
    app.post("/getallbills", bills.getallbills);
    app.post("/getbilldetails", bills.getbilldetails);
    app.post("/deletebill", bills.deletebill);
    app.post("/getrecyclebinbills", bills.getrecyclebinbills);
    app.post("/recyclebill", bills.recyclebill);
    app.post("/getpaymentduebills", bills.getpaymentduebills);
    app.post("/getaccountdetails", bills.getaccountdetails);

    // app.post("/event/updateevent", users.updateevent);
    // app.post("/checkadmin", users.checkadmin);
  };