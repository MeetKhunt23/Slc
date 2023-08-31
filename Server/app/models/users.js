const sql = require("./db.js");

const Users = function (users) {
  this.admin_id = users.admin_id;
  this.first_name = users.first_name;
  this.last_name = users.last_name;
  this.shopname = users.shopname;
  this.contact = users.contact;
  this.email = users.email;
  this.password = users.password;
  this.city = users.city;
  this.device_token=users.device_token;
};

Users.mobileexist = (mobile, admin_id, result) => {
  sql.query(
    `SELECT * FROM users WHERE contact=${mobile} AND admin_id=${admin_id}`,
    (err, res) => {
      result(null, res[0]);
      return;
    }
  );
};

Users.emailexist = (email, admin_id, result) => {
  sql.query(
    `SELECT * FROM users WHERE email=? AND admin_id=?`,
    [email, admin_id],
    (err, res) => {
      // console.log(err); return false
      result(null, res[0]);
      return;
    }
  );
};

Users.createuser = (userobj, result) => {
  sql.query(`INSERT INTO users SET ?`, [userobj], (err, res) => {
    // console.log(err); return false
    result(null, res.insertId);
    return;
  });
};

Users.login = (admin_id, email, password,device_token, result) => {
  sql.query(
    `SELECT * FROM users WHERE admin_id=? AND email=? AND password=? `,
    [admin_id, email, password],
    (err, res) => {
      // console.log(res); return false
      result(null, res[0]);
      return;
    }
  );
};

Users.checklogindetails=(user_id, device_token,admin_id,result)=>{
sql.query(`SELECT * FROM users WHERE id=? AND device_token=? AND admin_id=?`,[user_id,device_token,admin_id],(err,res)=>{
  // console.log(err); return false
  result(null,res[0])
  return;
})
}

Users.logout=(admin_id,user_id,device_token,result)=>{
sql.query(`UPDATE users SET device_token=? WHERE admin_id=? AND id=?`,[device_token,admin_id,user_id],(err,res)=>{
  result(null,admin_id)
  return
})
}

Users.settoken=(user_id, device_token,result)=>{
sql.query(`UPDATE users SET device_token=? WHERE id =?`,[device_token,user_id],(err,res)=>{
  // console.log(err); return false
  result(null,user_id)
  return
})
}

Users.getuserinfo = (user_id, result) => {
  sql.query(`SELECT * FROM users WHERE id=${user_id}`, (err, res) => {
    result(null, res[0]);
    return;
  });
};

Users.findemailexist = (admin_id, user_id, email, result) => {
  sql.query(
    `SELECT * FROM users WHERE email=? AND id!=? AND admin_id=?`,
    [email, user_id, admin_id],
    (err, res) => {
      // console.log(res); return false
      result(null, res[0]);
      return;
    }
  );
};

Users.updateprofile = (
  user_id,
  admin_id,
  email,
  first_name,
  last_name,
  shopname,
  contact,
  city,
  result
) => {
  sql.query(
    `UPDATE users SET email=?,first_name=?,last_name=?,shopname=?,contact=?,city=? WHERE id=? AND admin_id=?`,
    [email, first_name, last_name, shopname, contact, city, user_id, admin_id],
    (err, res) => {
      result(null, user_id);
      return;
    }
  );
};

Users.checkadminornot = (user_id, admin_id, result) => {
  sql.query(
    `SELECT * FROM admins WHERE user_id=? AND unique_id=?`,
    [user_id, admin_id],
    (err, res) => {
      // console.log(err); return false
      result(null, res[0]);
      return;
    }
  );
};

Users.updateadmin = (adminid, shopname, result) => {
  sql.query(
    `UPDATE admins SET shopname=? WHERE id=?`,
    [shopname, adminid],
    (err, res) => {
      // console.log(res);
      result(null, adminid);
      return;
    }
  );
};

Users.findidandpassexists = (user_id, old_password, result) => {
  sql.query(
    `SELECT * FROM users WHERE id=? AND password=?`,
    [user_id, old_password],
    (err, res) => {
      result(null, res[0]);
      return;
    }
  );
};

Users.updatepassword = (user_id, new_password, result) => {
  sql.query(
    `UPDATE users SET password=? WHERE id=?`,
    [new_password, user_id],
    (err, res) => {
      result(null, user_id);
      return;
    }
  );
};

Users.findemailbyid=(user_id,admin_id,result)=>{
    sql.query(`SELECT email FROM users WHERE id=? AND admin_id=?`,[user_id,admin_id],(err,res)=>{
        result(null,res[0])
        return
    })
}

Users.setforgetpassword=(user_id,admin_id,password,result)=>{
sql.query(`UPDATE users SET password=? WHERE id=? AND admin_id=?`,[password,user_id,admin_id],(err,res)=>{
    result(null,user_id)
    return;
})
}

Users.addcustomer=(admin_id,user_id,result)=>{
sql.query(`INSERT INTO customers SET admin_id=?,user_id=?`,[admin_id,user_id],(err,res)=>{
    // console.log(err); return false
    result(null,res.insertId)
    return
})
}

Users.getusers=(result)=>{
sql.query(`CREATE TABLE customrs(id int ,user_id int,admin_id int,first_name varchar(255),last_name varchar(255),shopname varchar(255),contact varchar(255),email varchar(255),city varchar(255),PRIMARY KEY (id))`,(err,res)=>{
  // console.log(err); return false
  result(null,res)
  return
})
}

Users.uploaddata=(id,user_id,admin_id,first_name,last_name,shopname,contact,email,city,result)=>{
sql.query(`INSERT INTO customrs SET id=?,user_id=?,admin_id=?,first_name=?,last_name=?,shopname=?,contact=?,email=?,city=?`,[id,user_id,admin_id,first_name,last_name,shopname,contact,email,city],(err,res)=>{
  // console.log(err); return false
  result(null,res.insertId)
  return
})
}
module.exports = Users;
