const Users = require("../models/users.js");
const nodemailer = require("nodemailer");
const sha512 = require("js-sha512");
const Bills = require("../models/billbook.js");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
// const csvtojson = require("csvtojson");
const csv = require("csv-parser");
const fs = require("fs");
const multer = require("multer");
// const csv = require("fast-csv");
const CSVToJSON = require("csvtojson");

exports.signup = (req, res) => {
  const {
    admin_id,
    first_name,
    last_name,
    contact,
    email,
    password,
    shopname,
    city,
  } = req.body;

  // console.log(req.body); return false

  let errors = "";
  if (!admin_id) {
    errors = " admin_id is required.";
  } else if (!first_name) {
    errors = "first_name  is required.";
  } else if (!last_name) {
    errors = "last_name  is required.";
  } else if (!contact) {
    errors = "contact  is required.";
  } else if (!email) {
    errors = "email  is required.";
  } else if (!password) {
    errors = "password  is required.";
  } else if (!shopname) {
    errors = "shopname  is required.";
  } else if (!city) {
    errors = "city  is required.";
  }

  if (errors.length > 0) {
    return res.send({
      success: "no",
      message: errors,
      data: [],
    });
  }

  var device_token =
    Math.floor(Math.random() * 10000000) +
    admin_id +
    Math.floor(Math.random() * 10000000);

  Users.mobileexist(contact, admin_id, (err, resss) => {
    // console.log(resss); return false
    if (resss) {
      return res.send({
        success: "no",
        message: "Mobile number already exists",
        data: [],
      });
    } else {
      Users.emailexist(email, admin_id, (err, ress) => {
        if (ress) {
          return res.send({
            success: "no",
            message: "Email already exists",
            data: [],
          });
        } else {
          var userobj = new Users({
            admin_id: admin_id,
            first_name: first_name,
            last_name: last_name,
            shopname: shopname,
            contact: contact,
            email: email,
            password: password,
            city: city,
            device_token: device_token,
          });
          Users.createuser(userobj, (err, data) => {
            let objj = {};
            objj["user_id"] = data;
            objj["admin_id"] = admin_id;
            objj["first_name"] = first_name;
            objj["last_name"] = last_name;
            objj["device_token"] = device_token;

            // console.log(data); return false
            if (data) {
              var user_id = data;
              Users.addcustomer(admin_id, user_id, (err, custmdata) => {
                if (custmdata) {
                  return res.send({
                    success: "yes",
                    message: "Sign up succcessfully.",
                    data: objj,
                  });
                } else {
                  return res.send({
                    success: "no",
                    message: "Failed to add customer.kindly try again",
                    data: [],
                  });
                }
              });
            } else {
              return res.send({
                success: "no",
                message: "Something happen wrong.",
                data: [],
              });
            }
          });
        }
      });
    }
  });
};

exports.login = (req, res) => {
  // console.log(next); return false
  const user_id = uuidv4();
  // console.log(user_id); return false
  const { admin_id, email, password } = req.body;
  // console.log(req.body); return false
  let errors = "";
  if (!admin_id) {
    errors = " admin_id is required.";
  } else if (!email) {
    errors = "email  is required.";
  } else if (!password) {
    errors = "password  is required.";
  }

  if (errors.length > 0) {
    return res.send({
      success: "no",
      message: errors,
      data: [],
    });
  }

  var device_token =
    Math.floor(Math.random() * 10000000) +
    admin_id +
    Math.floor(Math.random() * 10000000);
  // console.log(device_token); return false

  Users.login(admin_id, email, password, device_token, (err, data) => {
    var user_id = data.id;
    if (data) {
      Users.settoken(user_id, device_token, (err, tokendata) => {
        // console.log(tokendata); return false
        if (tokendata) {
          var obj = {};
          obj["id"] = data.id;
          obj["admin_id"] = data.admin_id;
          obj["first_name"] = data.first_name;
          obj["last_name"] = data.last_name;
          obj["city"] = data.city;
          obj["device_token"] = device_token;

          return res.send({
            success: "yes",
            message: "User Logged in Successfully.",
            data: obj,
          });
        }
      });
    } else {
      return res.send({
        success: "no",
        message:
          "User doesn't exist.kindly Enter Correct details or Sign up as new user.",
        data: [],
      });
    }
  });
};

exports.checklogindetails = (req, res) => {
  const { user_id, device_token, admin_id } = req.body;
  // console.log(req.body); return false
  let errors = "";
  if (!user_id) {
    errors = " user_id is required.";
  } else if (!device_token) {
    errors = "device_token is required.";
  } else if (!admin_id) {
    errors = "admin_id  is required.";
  }

  if (errors.length > 0) {
    return res.send({
      success: "no",
      message: errors,
      data: [],
    });
  }

  Users.checklogindetails(user_id, device_token, admin_id, (err, data) => {
    if (data) {
      return res.send({
        success: "yes",
        message: "Details are correct you can Enter",
        data: [],
      });
    } else {
      return res.send({
        success: "no",
        message: "Hello Mr.Hacker Fuck You..!!",
        data: [],
      });
    }
  });
};

exports.myprofile = (req, res) => {
  const { user_id } = req.body;

  let errors = "";
  if (!user_id) {
    errors = " user_id is required.";
  }

  if (errors.length > 0) {
    return res.send({
      success: "no",
      message: errors,
      data: [],
    });
  }

  Users.getuserinfo(user_id, (err, userdata) => {
    if (userdata) {
      return res.send({
        success: "yes",
        message: "here is all user details.",
        data: userdata,
      });
    } else {
      return res.send({
        success: "no",
        message: "something went wrong.",
        data: [],
      });
    }
  });
};

exports.updateprofile = (req, res) => {
  const {
    admin_id,
    user_id,
    first_name,
    last_name,
    shopname,
    contact,
    email,
    city,
  } = req.body;

  let errors = "";
  if (!user_id) {
    errors = " user_id is required.";
  } else if (!admin_id) {
    errors = " admin_id is required.";
  } else if (!first_name) {
    errors = " first_name is required.";
  } else if (!last_name) {
    errors = " last_name is required.";
  } else if (!shopname) {
    errors = " shopname is required.";
  } else if (!contact) {
    errors = " contact is required.";
  } else if (!email) {
    errors = " email is required.";
  } else if (!city) {
    errors = " city is required.";
  }

  if (errors.length > 0) {
    return res.send({
      success: "no",
      message: errors,
      data: [],
    });
  }

  Users.findemailexist(admin_id, user_id, email, (err, maildata) => {
    if (maildata) {
      return res.send({
        success: "no",
        message: "Email already Exists.Enter New Email",
        data: [],
      });
    } else {
      Users.updateprofile(
        user_id,
        admin_id,
        email,
        first_name,
        last_name,
        shopname,
        contact,
        city,
        (err, data) => {
          if (data) {
            Users.checkadminornot(user_id, admin_id, (err, admind) => {
              if (admind) {
                var adminid = admind.id;
                Users.updateadmin(adminid, shopname, (err, adminupdate) => {});
              }
            });
            return res.send({
              success: "yes",
              message: "profile updated successfully.",
              data: [],
            });
          } else {
            return res.send({
              success: "no",
              message: "Something went wrong,",
              data: [],
            });
          }
        }
      );
    }
  });
};

exports.changepassword = (req, res) => {
  const { user_id, old_password, new_password } = req.body;
  let errors = "";
  if (!user_id) {
    errors = "user_id is required.";
  } else if (!old_password) {
    errors = "old password is required.";
  } else if (!new_password) {
    errors = "new password is required.";
  }

  if (errors.length > 0) {
    return res.send({
      success: "no",
      message: errors,
      data: [],
    });
  }

  Users.findidandpassexists(user_id, old_password, (err, pdaata) => {
    if (pdaata) {
      Users.updatepassword(user_id, new_password, (err, data) => {
        if (data) {
          var obj = {};
          obj["user_id"] = user_id;
          obj["new_password"] = new_password;
          return res.send({
            success: "yes",
            message: "Password updated successfully.",
            data: [],
          });
        }
      });
    } else {
      return res.send({
        success: "no",
        message: "Please enter correct password.",
        data: [],
      });
    }
  });
};

exports.forgotpassword = (req, res) => {
  const { user_id, admin_id } = req.body;
  let errors = "";
  if (!user_id) {
    errors = "user_id is required.";
  } else if (!admin_id) {
    errors = "admin_id is required.";
  }

  if (errors.length > 0) {
    return res.send({
      success: "no",
      message: errors,
      data: [],
    });
  }

  //   Users.findemailbyid(user_id, admin_id, (err, emaildata) => {
  //     if (emaildata) {
  //       var password = `'${Math.floor(Math.random() * 1000000)}'`;

  //       //   console.log(password);
  //       //   return false;
  //         var transporter = nodemailer.createTransport({
  //           service: "gmail",
  //           auth: {
  //             user: "meetkhunt6989@gmail.com",
  //             pass: "yrviookkfetalivv",
  //             // https://stackoverflow.com/questions/59188483/error-invalid-login-535-5-7-8-username-and-password-not-accepted  - refer to this page for getting password.
  //           },
  //         });

  //         var mailOptions = {
  //           from: "meetkhunt6989@gmail.com",
  //           to: emaildata.email,
  //           subject: "Forget Password.",
  //           text: `Your New Password is ${password}.Remember it and change it from upatepassword section incase you want to update it.`,
  //         };

  //         transporter.sendMail(mailOptions, function (error, info) {
  //           if (error) {
  //             console.log(error);
  //           } else {
  //             console.log("Email sent: " + info.response);
  //           }
  //         });
  //       var databasepass = sha512(password);
  //       //   console.log(databasepass);
  //       //   return false;
  //       Users.setforgetpassword(
  //         user_id,
  //         admin_id,
  //         databasepass,
  //         (err, data) => {}
  //       );

  //       return res.send({
  //         success: "yes",
  //         message: `We have Sent A link to Generate new Password to '${emaildata.email}' `,
  //         data: [],
  //       });
  //     }
  //   });
};

exports.addbill = (req, res) => {
  const {
    admin_id,
    customer_id,
    image,
    quantity,
    amount,
    billamount_paid,
    bill_date,
    bill_status,
  } = req.body;

  let errors = "";
  if (!admin_id) {
    errors = "admin_id is required.";
  } else if (!customer_id) {
    errors = "customer_id is required.";
  } else if (!quantity) {
    errors = "quantity is required.";
  } else if (!amount) {
    errors = "amount is required.";
  } else if (!billamount_paid) {
    errors = "billamount_paid is required.";
  } else if (!bill_status) {
    errors = "bill_status is required.";
  } else if (!bill_date) {
    errors = "bill_date is required.";
  } else if (!req.files || Object.keys(req.files).length === 0) {
    return res.send({
      error: "yes",
      message: "Bill Img is required.",
      data: [],
    });
  }

  if (errors.length > 0) {
    return res.send({
      success: "no",
      message: errors,
      data: [],
    });
  }

  Bills.checkdetailsofcostumer(customer_id, (err, customerdetail) => {
    if (customerdetail) {
      let userimage = req.files.image;
      var filename = Math.floor(Math.random() * 100000) + userimage.name;
      var filepath = "uploads/bill_images/" + filename;
      userimage.mv(filepath, function (err) {});

      var billobj = new Bills({
        admin_id: admin_id,
        customer_id: customer_id,
        image: filename,
        quantity: quantity,
        amount: amount,
        billamount_paid: billamount_paid,
        bill_status: bill_status,
        bill_date: bill_date,
      });
      Bills.addbill(billobj, (err, data) => {
        if (data) {
          return res.send({
            success: "yes",
            message: "Bill Added Sucessfully.",
            data: [],
          });
        } else {
          return res.send({
            success: "no",
            message: "Something Went wrong.",
            data: [],
          });
        }
      });
    }
  });
};

exports.updatebill = (req, res) => {
  const {
    bill_id,
    admin_id,
    amount,
    quantity,
    billamount_paid,
    bill_status,
    image,
    bill_date,
  } = req.body;
  // console.log(req.body); return false
  let errors = "";
  if (!admin_id) {
    errors = "admin_id is required.";
  } else if (!bill_id) {
    errors = "bill_id is required.";
  } else if (!amount) {
    errors = "amount is required.";
  } else if (!quantity) {
    errors = "quantity is required.";
  } else if (!billamount_paid) {
    errors = "billamount_paid is required.";
  } else if (!bill_status) {
    errors = "bill_status is required.";
  } else if (!bill_date) {
    errors = "bill_date is required.";
  } else if (!req.files || Object.keys(req.files).length === 0) {
  }

  // console.log(req.files); return false

  if (errors.length > 0) {
    return res.send({
      success: "no",
      message: errors,
      data: [],
    });
  }

  if (image) {
    var filename = image;
  } else {
    let userimage = req.files.image;
    var filename = Math.floor(Math.random() * 100000) + userimage.name;
    var filepath = "uploads/bill_images/" + filename;
    userimage.mv(filepath, function (err) {});
  }

  var date = moment(bill_date);
  var billdatee = date.format("YYYY-MM-DD");
  // console.log(req.body); return false

  Bills.updatebill(
    admin_id,
    bill_id,
    amount,
    quantity,
    billamount_paid,
    bill_status,
    billdatee,
    filename,
    (err, data) => {
      if (data) {
        return res.send({
          success: "yes",
          message: "Updated Successfully.",
          data: data,
        });
      }
    }
  );
};

exports.logout = (req, res) => {
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

  var device_token =
    Math.floor(Math.random() * 10000000) +
    admin_id +
    Math.floor(Math.random() * 10000000);

  Users.logout(admin_id, user_id, device_token, (err, data) => {
    if (data) {
      return res.send({
        success: "yes",
        message: "User Logged Out SuccessFully.",
        data: [],
      });
    }
  });
};

exports.listdownload = (req, res) => {
  const { imagefile } = req.body;
  // console.log(req.files); return false

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.send({
      error: "yes",
      message: "file is required.",
      data: [],
    });
  }

  let Csvfile = req.files.imagefile;
  var filename = Csvfile.name;
  var filepath = "uploads/bill_images/" + filename;
  Csvfile.mv(filepath, function (err) {});
  {
    //second method:-
    // const results = [];
    // fs.createReadStream(filepath)
    //   .pipe(csv({}))
    //   .on("data", (data) => results.push(data))
    //   .on("end", () => {
    //     console.log(results);
    //   });
  }
  // convert users.csv file to JSON array
  Users.getusers((ere, tabledata) => {});

  CSVToJSON()
    .fromFile(filepath)
    .then((array) => {
      // users is a JSON array
      // log the JSON array
      // console.log(array); return false
      array.forEach((pro) => {
        var id = pro.id;
        var user_id = pro.user_id;
        var admin_id = pro.admin_id;
        var first_name = pro.first_name;
        var last_name = pro.last_name;
        var shopname = pro.shopname;
        var contact = pro.contact;
        var email = pro.email;
        var city = pro.city;
        // console.log(city); return false
        Users.uploaddata(
          id,
          user_id,
          admin_id,
          first_name,
          last_name,
          shopname,
          contact,
          email,
          city,
          (err, data) => {
            console.log(id);
          }
        );
      });
      return res.send({
        error: "yes",
        message: "Data imported successfully.!",
        data: [],
      });
    })
    .catch((err) => {
      // log error if any
      console.log(err);
    });
};
