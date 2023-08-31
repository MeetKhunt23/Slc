const { log } = require("console");
const sql = require("./db.js");

const Bills = function (bills) {
  this.admin_id = bills.admin_id;
  this.customer_id = bills.customer_id;
  this.image = bills.image;
  this.quantity = bills.quantity;
  this.amount = bills.amount;
  this.billamount_paid = bills.billamount_paid;
  this.bill_status = bills.bill_status;
  this.bill_date = bills.bill_date;
};

Bills.checkdetailsofcostumer = (customer_id, result) => {
  sql.query(
    `SELECT * FROM customers WHERE user_id=${customer_id}`,
    (err, res) => {
      result(null, res[0]);
      return;
    }
  );
};

Bills.addbill = (billobj, result) => {
  sql.query(`INSERT INTO bills SET ?`, [billobj], (err, res) => {
    // console.log(err); return false
    result(null, res.insertId);
    return;
  });
};

Bills.getallbills = (admin_id, user_id, filtertext, result) => {
  var strCon = "";
  var order_text;
  // var bill_status=""
  // console.log(filtertext); return false
  if (filtertext === "all") {
    strCon += true;
    order_text = "bill_date Desc";
  } else if (filtertext === "1") {
    strCon += "bill_status=1";
    order_text = "bill_date Desc";
  } else if (filtertext === "0") {
    strCon += "bill_status=0";
    order_text = "bill_date Desc";
  } else if (filtertext === "0.5") {
    strCon += "bill_status=0.5";
    order_text = "bill_date Desc";
  } else if (filtertext === "Asc") {
    strCon += true;
    order_text = "bill_date ASC";
  } else if (filtertext === "Desc") {
    strCon += true;
    order_text = "bill_date Desc";
  }
  sql.query(
    `SELECT *,CONCAT('` +
      nodeSiteUrl +
      `','/file/bill_images/',image) as bill_image FROM bills WHERE ` +
      strCon +
      ` AND admin_id=? AND customer_id=? AND delete_status="1" ORDER BY ` +
      order_text,
    [admin_id, user_id],
    (err, res) => {
      // console.log(res); return false
      result(null, res);
      return;
    }
  );
};

Bills.getbilldetails = (bill_id, admin_id, result) => {
  sql.query(
    `SELECT b.*,u.first_name,u.last_name,u.shopname,u.city FROM bills as b LEFT JOIN users as u ON u.id=b.customer_id WHERE b.id=${bill_id} AND b.admin_id=${admin_id}`,
    (err, res) => {
      // console.log(err); return false
      result(null, res[0]);
      return;
    }
  );
};

Bills.updatebill = (
  admin_id,
  bill_id,
  amount,
  quantity,
  billamount_paid,
  bill_status,
  bill_date,
  filename,
  result
) => {
  sql.query(
    `UPDATE bills SET amount=?,quantity=?,billamount_paid=?,bill_status=?,bill_date=?,image=? WHERE id=? AND admin_id=?`,
    [
      amount,
      quantity,
      billamount_paid,
      bill_status,
      bill_date,
      filename,
      bill_id,
      admin_id,
    ],
    (err, res) => {
      result(null, bill_id);
      return;
    }
  );
};

Bills.deletebill = (admin_id, bill_id, result) => {
  sql.query(
    `DELETE FROM bills WHERE id=? AND admin_id=?`,
    [bill_id, admin_id],
    (err, res) => {
      result(null, bill_id);
      return;
    }
  );
};

Bills.changedeletestatus = (bill_id, admin_id, result) => {
  sql.query(
    `UPDATE bills SET delete_status="0" WHERE id=? AND admin_id=?`,
    [bill_id, admin_id],
    (err, res) => {
      // console.log(res); return false
      result(null, bill_id);
      return;
    }
  );
};

Bills.Addtorecyclebin = (bill_id, customer_id, admin_id, result) => {
  sql.query(
    `INSERT INTO recyclebin SET bill_id=?,customer_id=?,admin_id=?,is_recycled="1"`,
    [bill_id, customer_id, admin_id],
    (err, res) => {
      result(null, res.insertId);
      return;
    }
  );
};

Bills.getallrecyclebills = (admin_id, result) => {
  sql.query(
    `SELECT r.id,r.bill_id,r.customer_id,r.admin_id,u.first_name,u.last_name,u.city,u.shopname,CONCAT('` +
      nodeSiteUrl +
      `','/file/bill_images/',b.image) as bill_image,b.quantity,b.amount,b.billamount_paid,b.bill_status,b.bill_date FROM recyclebin as r LEFT JOIN bills as b ON b.id=r.bill_id LEFT JOIN users as u ON r.customer_id=u.id WHERE r.admin_id=? AND is_recycled="1"`,
    [admin_id],
    (err, res) => {
      // console.log(err); return false
      result(null, res);
      return;
    }
  );
};

Bills.getrecyclebillsofuser = (admin_id, user_id, result) => {
  sql.query(
    `SELECT r.id,r.bill_id,r.customer_id,r.admin_id,u.first_name,u.last_name,u.city,u.shopname,CONCAT('` +
      nodeSiteUrl +
      `','/file/bill_images/',b.image) as bill_image,b.quantity,b.amount,b.billamount_paid,b.bill_status,b.bill_date FROM recyclebin as r LEFT JOIN bills as b ON b.id=r.bill_id LEFT JOIN users as u ON r.customer_id=u.id WHERE r.admin_id=? AND r.customer_id=? AND is_recycled="1"`,
    [admin_id, user_id],
    (err, res) => {
      // console.log(res); return false
      result(null, res);
      return;
    }
  );
};

Bills.updateisrecycle = (admin_id, bill_id, result) => {
  sql.query(
    `UPDATE recyclebin SET is_recycled="0" WHERE admin_id=? AND bill_id=?`,
    [admin_id, bill_id],
    (err, res) => {
      result(null, admin_id);
      return;
    }
  );
};

Bills.updatedeletestatus = (admin_id, bill_id, result) => {
  sql.query(
    `UPDATE bills SET delete_status="1" WHERE id=? AND admin_id=?`,
    [bill_id, admin_id],
    (err, res) => {
      result(null, bill_id);
      return;
    }
  );
};

Bills.checkisbillexists = (bill_id, admin_id, result) => {
  sql.query(
    `SELECT * FROM recyclebin WHERE bill_id=? AND admin_id=? AND is_recycled="0"`,
    [bill_id, admin_id],
    (err, res) => {
      result(null, res);
      return;
    }
  );
};

Bills.updateisrecycledstatus = (bill_id, admin_id, result) => {
  sql.query(
    `UPDATE recyclebin SET is_recycled="1" WHERE bill_id=? AND admin_id=?`,
    [bill_id, admin_id],
    (err, res) => {
      result(null, bill_id);
      return;
    }
  );
};

Bills.getpaymentduebills = (admin_id, user_id, filtertext, result) => {
  var strCon = "";
  var order_text;
  // var bill_status=""
  // console.log(filtertext); return false
  if (filtertext === "all") {
    strCon += "(bill_status=0 OR bill_status=0.5)";
    order_text = "bill_date Desc";
  } else if (filtertext === "0") {
    strCon += "bill_status=0";
    order_text = "bill_date Desc";
  } else if (filtertext === "0.5") {
    strCon += "bill_status=0.5";
    order_text = "bill_date Desc";
  } else if (filtertext === "Asc") {
    strCon += "(bill_status=0 OR bill_status=0.5)";
    order_text = "bill_date ASC";
  } else if (filtertext === "Desc") {
    strCon += "(bill_status=0 OR bill_status=0.5)";
    order_text = "bill_date Desc";
  }
  sql.query(
    `SELECT *,CONCAT('` +
      nodeSiteUrl +
      `','/file/bill_images/',image) as bill_image,(DATE_ADD(bill_date, INTERVAL 90 DAY)) as payment_duedate FROM bills WHERE admin_id=? AND customer_id=? AND (DATE_ADD(bill_date, INTERVAL 90 DAY) < CURDATE()) AND delete_status=1 AND ` +
      strCon +
      ` ORDER BY ` +
      order_text,
    [admin_id, user_id],
    (err, res) => {
      // console.log(err); return false
      result(null, res);
      return;
    }
  );
};

Bills.getaccountstatement=(admin_id,result)=>{
  sql.query(`SELECT SUM(amount)as Total_Turn_Over,SUM(quantity) as Total_Sales FROM bills WHERE admin_id=?`,[admin_id],(err,res)=>{
    // console.log(res); return false
result(null,res[0])
return
  })
}

module.exports = Bills;
