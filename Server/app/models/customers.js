const sql = require("./db.js");

const Customers = function (customers) {
  this.admin_id = customers.admin_id;
  this.user_id = customers.user_id;
};

Customers.getcustomerofadmin = (admin_id, result) => {
  sql.query(
    `SELECT c.id,c.user_id,c.admin_id,u.first_name,u.last_name,u.shopname,u.contact,u.email,u.city,CONCAT('` +
    nodeSiteUrl +
    `','/file/bill_images/',u.profile_image) as profile_image FROM customers as c LEFT JOIN users as u ON u.id=c.user_id  WHERE c.admin_id=${admin_id}`,
    (err, res) => {
      // console.log(err); return false
      result(null, res);
      return;
    }
  );
};

Customers.getdetailsofcustomer = (user_id, result) => {
  sql.query(
    `SELECT u.*,(SELECT SUM(b.amount) FROM bills as b WHERE b.customer_id=${user_id} AND b.delete_status="1")as turn_over,(SELECT SUM(b.quantity) FROM bills as b WHERE b.customer_id=${user_id} AND b.delete_status="1")as quantity_traded,(SELECT SUM(b.billamount_paid) FROM bills as b WHERE b.customer_id=${user_id} AND b.delete_status="1")as Amount_paid,(SELECT COUNT(b.id) FROM bills as b WHERE b.bill_status="0" AND b.customer_id=${user_id} AND b.delete_status="1")as Unpaid_bills,(SELECT COUNT(b.id) FROM bills as b WHERE b.bill_status="0.5" AND b.customer_id=${user_id} AND b.delete_status="1")as Halfpaid_bills,(SELECT COUNT(b.id) FROM bills as b WHERE b.bill_status="1" AND b.customer_id=${user_id} AND b.delete_status="1")as Paid_bills FROM users as u LEFT JOIN bills as b ON u.id=b.customer_id WHERE u.id=${user_id}`,
    (err, res) => {
      // console.log(err); return false
      result(null, res[0]);
      return;
    }
  );
};

Customers.getallcitybyadmin = (admin_id, result) => {
  sql.query(`SELECT city FROM users WHERE admin_id=${admin_id}`, (err, res) => {
    result(null, res);
    return;
  });
};

Customers.deletecustomerbyid = (user_id, admin_id, result) => {
  sql.query(
    `DELETE FROM customers WHERE user_id=${user_id} AND admin_id=${admin_id}`,
    (err, res) => {
      sql.query(
        `DELETE FROM users WHERE id=${user_id} AND admin_id=${admin_id}`,
        (err, ress) => {
          result(null, user_id);
          return;
        }
      );
    }
  );
};

Customers.addcustomerofadmin = (user_id, admin_id, result) => {
  sql.query(
    `INSERT INTO customers SET user_id=?,admin_id=?`,
    [user_id, admin_id],
    (err, res) => {
      result(null, res.insertId);
      return;
    }
  );
};

Customers.updatemycustomer = (
  admin_id,
  user_id,
  first_name,
  last_name,
  shopname,
  contact,
  email,
  password,
  city,
  result
) => {
  sql.query(
    `UPDATE users SET first_name=?,last_name=?,shopname=?,contact=?,email=?,password=?,city=? WHERE admin_id=? AND id=?`,
    [
      first_name,
      last_name,
      shopname,
      contact,
      email,
      password,
      city,
      admin_id,
      user_id,
    ],
    (err, res) => {
      // console.log(res); return false
      result(null, user_id);
      return;
    }
  );
};

Customers.deletebillofcustomers = (user_id, admin_id, result) => {
  sql.query(
    `DELETE FROM bills WHERE customer_id=? AND admin_id=?`,
    [user_id, admin_id],
    (err, res) => {
      result(null, user_id);
      return;
    }
  );
};

Customers.getinsightsofallcustomers = (admin_id,user_id,Filtertext,result) => {
  var filter="";
  if(Filtertext==="default"){
    filter="ORDER BY id ASC"
  }else if(Filtertext==="red"){
    filter="ORDER BY (SELECT COUNT(b.id) FROM bills as b WHERE b.bill_status=0 AND b.customer_id=u.id AND b.delete_status=1) DESC"
  }else if(Filtertext==="green"){
    filter="ORDER BY (SELECT COUNT(b.id) FROM bills as b WHERE b.bill_status=1 AND b.customer_id=u.id AND b.delete_status=1) DESC"
  }else if(Filtertext==="turnover"){
    filter="ORDER BY (SELECT SUM(b.amount) FROM bills as b WHERE b.customer_id=u.id AND b.delete_status=1) DESC"
  }
  sql.query(
    `SELECT u.id,u.first_name,u.last_name,u.shopname,u.city,(SELECT SUM(b.amount) FROM bills as b WHERE b.customer_id=u.id AND b.delete_status="1")as turn_over,(SELECT SUM(b.quantity) FROM bills as b WHERE b.customer_id=u.id AND b.delete_status="1")as quantity_traded,(SELECT SUM(b.billamount_paid) FROM bills as b WHERE b.customer_id=u.id AND b.delete_status="1")as Amount_paid,(SELECT (SUM(b.amount)-SUM(b.billamount_paid)) as unpaid FROM bills as b WHERE b.customer_id=u.id AND b.delete_status="1")as Amount_unpaid,(SELECT COUNT(b.id) FROM bills as b WHERE b.bill_status="0" AND b.customer_id=u.id AND b.delete_status="1")as Unpaid_bills,(SELECT COUNT(b.id) FROM bills as b WHERE b.bill_status="0.5" AND b.customer_id=u.id AND b.delete_status="1")as Halfpaid_bills,(SELECT COUNT(b.id) FROM bills as b WHERE b.bill_status="1" AND b.customer_id=u.id AND b.delete_status="1")as Paid_bills FROM users as u WHERE u.admin_id=? AND id!=? `+filter,
    [admin_id,user_id],
    (err, res) => {
      // console.log(err); return false
      result(null, res);
      return;
    }
  );
};

Customers.getidofadmin=(admin_id,result)=>{
sql.query(`SELECT user_id FROM admins WHERE unique_id=?`,[admin_id],(err,res)=>{
  result(null,res[0])
  return 
})
}

module.exports = Customers;
