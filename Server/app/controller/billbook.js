const Bills = require("../models/billbook.js");
const moment = require("moment");

exports.getallbills = (req, res) => {
  const { admin_id,user_id,filtertext} = req.body;

  let errors = "";
  if (!user_id) {
    errors = "user_id is required.";
  } else if (!admin_id) {
    errors = "admin_id is required.";
  }else if (!filtertext) {
    errors = "filtertext is required.";
  }

  if (errors.length > 0) {
    return res.send({
      success: "no",
      message: errors,
      data: [],
    });
  }

  Bills.getallbills(admin_id, user_id,filtertext, (err, data) => {
    if (data) {
      var array = [];
      data.forEach((pro) => array.push(pro.bill_image));
      var Billarray = [];
      var mainarray = data;
      mainarray.forEach((row) => {
        var obj = {};
        obj["id"] = row.id;
        obj["admin_id"] = row.admin_id;
        obj["user_id"] = row.customer_id;
        obj["quantity"] = row.quantity;
        obj["amount"] = row.amount;
        obj["billamount_paid"] = row.billamount_paid;
        obj["billamount_unpaid"] =
          Number(row.amount) - Number(row.billamount_paid);
        var date = moment(row.bill_date);
        var billdatee = date.format("DD-MM-YYYY");
        obj["bill_date"] = billdatee;
        obj["bill_status"] = row.bill_status;
        obj["img"] = row.bill_image;
        obj["image_array"] = array;
        Billarray.push(obj);
      });

      return res.send({
        success: "yes",
        message: "here are all bills data of user",
        data: Billarray,
      });
    }
  });
};

exports.getbilldetails = (req, res) => {
  const { admin_id, bill_id } = req.body;

  let errors = "";
  if (!admin_id) {
    errors = "admin_id is required.";
  } else if (!bill_id) {
    errors = "bill_id is required.";
  }

  if (errors.length > 0) {
    return res.send({
      success: "no",
      message: errors,
      data: [],
    });
  }

  Bills.getbilldetails(bill_id, admin_id, (err, data) => {
    if (data) {
      if (data.bill_status == "0") {
        var bill_status = "Unpaid";
      } else if (data.bill_status == "0.5") {
        var bill_status = "Half-Paid";
      } else {
        var bill_status = "Paid";
      }
      data["bill_status"] = bill_status;
      data["bill_amount_pending"] = Number(data.amount)-Number(data.billamount_paid);

      return res.send({
        success: "yes",
        message: "Bill Details are here.",
        data: data,
      });
    }
  });
};

exports.deletebill = (req, res) => {
  const { bill_id, admin_id } = req.body;
  let errors = "";
  if (!admin_id) {
    errors = "admin_id is required.";
  } else if (!bill_id) {
    errors = "bill_id is required.";
  }

  if (errors.length > 0) {
    return res.send({
      success: "no",
      message: errors,
      data: [],
    });
  }

  Bills.changedeletestatus(bill_id, admin_id, (err, changedata) => {
    Bills.getbilldetails(bill_id, admin_id, (err, billdetailsdata) => {
      Bills.checkisbillexists(bill_id, admin_id, (err, billexistdata) => {
        // console.log(billexistdata); return false
        if (billexistdata.length) {
          Bills.updateisrecycledstatus(bill_id, admin_id, (err, data) => {
            if (data) {
              return res.send({
                success: "yes",
                message: "Bill Deleted Successfully.",
                data: [],
              });
            }
          });
        } else {
          Bills.Addtorecyclebin(
            billdetailsdata.id,
            billdetailsdata.customer_id,
            billdetailsdata.admin_id,
            (err, data) => {
              if (data) {
                return res.send({
                  success: "yes",
                  message: "Bill Deleted Successfully.",
                  data: [],
                });
              }
            }
          );
        }
      });
    });
  });
};

exports.getrecyclebinbills = (req, res) => {
  const { admin_id, user_id } = req.body;

  let errors = "";
  if (!admin_id) {
    errors = "admin_id is required.";
  } else if (!user_id) {
    errors = "user_id is required.";
  }

  if (errors.length > 0) {
    return res.send({
      success: "no",
      message: errors,
      data: [],
    });
  }
  if (user_id == "all") {
    Bills.getallrecyclebills(admin_id, (err, data) => {
      if (data.length) {
        var array = [];
        data.forEach((pro) => array.push(pro.bill_image));
        var Billarray = [];
        var mainarray = data;
        mainarray.forEach((row) => {
          var obj = {};
          obj["id"] = row.bill_id;
          obj["admin_id"] = row.admin_id;
          obj["user_id"] = row.customer_id;
          obj["quantity"] = row.quantity;
          obj["amount"] = row.amount;
          obj["billamount_paid"] = row.billamount_paid;
          obj["billamount_unpaid"] =
            Number(row.amount) - Number(row.billamount_paid);
          var date = moment(row.bill_date);
          var billdatee = date.format("DD-MM-YYYY");
          obj["bill_date"] = billdatee;
          obj["bill_status"] = row.bill_status;
          obj["img"] = row.bill_image;
          obj["image_array"] = array;
          Billarray.push(obj);
        });
        return res.send({
          success: "yes",
          message: "All Recycle Bills are here",
          data: Billarray,
        });
      } else {
        return res.send({
          success: "yes",
          message: "No Bills Found.",
          data: [],
        });
      }
    });
  } else {
    Bills.getrecyclebillsofuser(admin_id, user_id, (err, data) => {
      if (data.length) {
        var array = [];
        data.forEach((pro) => array.push(pro.bill_image));
        var Billarray = [];
        var mainarray = data;
        mainarray.forEach((row) => {
          var obj = {};
          obj["id"] = row.bill_id;
          obj["admin_id"] = row.admin_id;
          obj["user_id"] = row.customer_id;
          obj["quantity"] = row.quantity;
          obj["amount"] = row.amount;
          obj["billamount_paid"] = row.billamount_paid;
          obj["billamount_unpaid"] =
            Number(row.amount) - Number(row.billamount_paid);
          var date = moment(row.bill_date);
          var billdatee = date.format("DD-MM-YYYY");
          obj["bill_date"] = billdatee;
          obj["bill_status"] = row.bill_status;
          obj["img"] = row.bill_image;
          obj["image_array"] = array;
          Billarray.push(obj);
        });
        return res.send({
          success: "yes",
          message: "All Recycle Bills of user.",
          data: Billarray,
        });
      } else {
        return res.send({
          success: "yes",
          message: "No Bills Found.",
          data: [],
        });
      }
    });
  }
};

exports.recyclebill = (req, res) => {
  const { admin_id, bill_id } = req.body;
  let errors = "";
  if (!admin_id) {
    errors = "admin_id is required.";
  } else if (!bill_id) {
    errors = "bill_id is required.";
  }

  if (errors.length > 0) {
    return res.send({
      success: "no",
      message: errors,
      data: [],
    });
  }

  Bills.updateisrecycle(admin_id, bill_id, (err, updatedrecledata) => {
    if (updatedrecledata) {
      Bills.updatedeletestatus(admin_id, bill_id, (err, data) => {
        if (data) {
          return res.send({
            success: "yes",
            message: "Bill Restored Successfully.",
            data: [],
          });
        }
      });
    }
  });
};

exports.getpaymentduebills=(req,res)=>{
  const { admin_id,user_id,filtertext} = req.body;

  let errors = "";
  if (!user_id) {
    errors = "user_id is required.";
  } else if (!admin_id) {
    errors = "admin_id is required.";
  }else if (!filtertext) {
    errors = "filtertext is required.";
  }

  if (errors.length > 0) {
    return res.send({
      success: "no",
      message: errors,
      data: [],
    });
  }

  Bills.getpaymentduebills(admin_id,user_id,filtertext,(err,data)=>{
    if(data){
      var array = [];
      data.forEach((pro) => array.push(pro.bill_image));
      var Billarray = [];
      var mainarray = data;
      mainarray.forEach((row) => {
        var obj = {};
        obj["id"] = row.id;
        obj["admin_id"] = row.admin_id;
        obj["user_id"] = row.customer_id;
        obj["quantity"] = row.quantity; 
        obj["amount"] = row.amount;
        obj["billamount_paid"] = row.billamount_paid;
        obj["billamount_unpaid"] =
          Number(row.amount) - Number(row.billamount_paid);
        var date = moment(row.bill_date);
        var billdatee = date.format("DD-MM-YYYY");
        obj["bill_date"] = billdatee;
        var duedate = moment(row.payment_duedate);
        var billduedatee = duedate.format("DD-MM-YYYY");
        obj["payment_duedate"] = billduedatee;
        obj["bill_status"] = row.bill_status;
        obj["img"] = row.bill_image;

        obj["image_array"] = array;
        
        Billarray.push(obj);
      });
      return res.send({
        success: "yes",
        message: "Here is List of all payment Dues.",
        data: Billarray,
      });
    }
  })

}


exports.getaccountdetails=(req,res)=>{
  const{admin_id}=req.body

  let errors = "";
   if (!admin_id) {
    errors = "admin_id is required.";
  }

  if (errors.length > 0) {
    return res.send({
      success: "no",
      message: errors,
      data: [],
    });
  }

  Bills.getaccountstatement(admin_id,(err,data)=>{
    if(data){
      var obj={};
      obj['Total_Turn_Over']=data.Total_Turn_Over;
      obj['Total_Sales']=data.Total_Sales;
      var profit=Number(data.Total_Turn_Over*10)/100
      obj['Total_profit']=profit;
      var GST=Number(data.Total_Turn_Over*18)/100
      obj['GST']=GST;
    }
    return res.send({
      success: "yes",
      message: "Here is all Account details",
      data: obj,
    });
  })
}