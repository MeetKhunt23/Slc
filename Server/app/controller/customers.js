const Customers = require("../models/customers.js");
const Users = require("../models/users.js");
const {v4 : uuidv4} = require('uuid')

exports.getallcustomerbyadmin = (req, res) => {
  const { admin_id } = req.body;

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

  Customers.getcustomerofadmin(admin_id, (err, data) => {
    if (data) {
      return res.send({
        success: "yes",
        message: "here is all your customers.",
        data: data,
      });
    } else {
      return res.send({
        success: "no",
        message: "no customers are there of this admin id.",
        data: data,
      });
    }
  });
};

exports.getcustomerdetail = (req, res) => {
  const { user_id } = req.body;

  let errors = "";
  if (!user_id) {
    errors = "user_id is required.";
  }

  if (errors.length > 0) {
    return res.send({
      success: "no",
      message: errors,
      data: [],
    });
  }

  Customers.getdetailsofcustomer(user_id, (err, data) => {
    if (data) {
      data["Amount_Pending"] =
        Number(data.turn_over) - Number(data.Amount_paid);
      return res.send({
        success: "yes",
        message: "here are all details of customer",
        data: data,
      });
    }
  });
};

exports.getallcitiesbyadmin = (req, res) => {
  const { admin_id } = req.body;

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

  Customers.getallcitybyadmin(admin_id, (err, data) => {
    if (data) {
      return res.send({
        success: "yes",
        message: "here are all cities",
        data: data,
      });
    }
  });
};

exports.deletecustomer = (req, res) => {
  const { user_id, admin_id } = req.body;

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

  Customers.deletecustomerbyid(user_id, admin_id, (err, data) => {
    Customers.deletebillofcustomers(user_id, admin_id, (err, deleteddata) => {
      if (deleteddata) {
        return res.send({
          success: "yes",
          message: "customer deleted successfully.",
          data: [],
        });
      }
    });
  });
};

exports.addcustomer = (req, res) => {
  const {
    admin_id,
    first_name,
    last_name,
    shopname,
    contact,
    email,
    password,
    city,
  } = req.body;

  let errors = "";
  if (!admin_id) {
    errors = "admin_id is required.";
  } else if (!first_name) {
    errors = "first_name is required.";
  } else if (!last_name) {
    errors = "last_name is required.";
  } else if (!shopname) {
    errors = "shopname is required.";
  } else if (!contact) {
    errors = "contact is required.";
  } else if (!email) {
    errors = "email is required.";
  } else if (!password) {
    errors = "password is required.";
  } else if (!city) {
    errors = "city is required.";
  }

  if (errors.length > 0) {
    return res.send({
      success: "no",
      message: errors,
      data: [],
    });
  }

  const userobj = new Users({
    admin_id: admin_id,
    first_name: first_name,
    last_name: last_name,
    shopname: shopname,
    contact: contact,
    email: email,
    password: password,
    city: city,
  });

  Users.createuser(userobj, (err, data) => {
    if (data) {
      var user_id = data;
      Customers.addcustomerofadmin(user_id, admin_id, (err, custmerdata) => {
        if (custmerdata) {
          return res.send({
            success: "yes",
            message: "Your Customer Created Successfully.",
            data: custmerdata,
          });
        }
      });
    }
  });
};

exports.updatemycustomer = (req, res) => {
  const {
    admin_id,
    user_id,
    first_name,
    last_name,
    shopname,
    city,
    contact,
    email,
    password,
  } = req.body;
  let errors = "";
  if (!admin_id) {
    errors = "admin_id is required.";
  } else if (!first_name) {
    errors = "first_name is required.";
  } else if (!user_id) {
    errors = "user_id is required.";
  } else if (!last_name) {
    errors = "last_name is required.";
  } else if (!shopname) {
    errors = "shopname is required.";
  } else if (!contact) {
    errors = "contact is required.";
  } else if (!email) {
    errors = "email is required.";
  } else if (!password) {
    errors = "password is required.";
  } else if (!city) {
    errors = "city is required.";
  }

  if (errors.length > 0) {
    return res.send({
      success: "no",
      message: errors,
      data: [],
    });
  }

  Customers.updatemycustomer(
    admin_id,
    user_id,
    first_name,
    last_name,
    shopname,
    contact,
    email,
    password,
    city,
    (err, data) => {
      if (data) {
        return res.send({
          success: "yes",
          message: "Your Customer details Updated Successfully.",
          data: [],
        });
      }
    }
  );
};

exports.getallcustomerinsights = (req, res) => {
  const { admin_id,Filtertext } = req.body;

  let errors = "";
  if (!admin_id) {
    errors = "admin_id is required.";
  }else if(!Filtertext) {
    errors = "Filtertext is required.";
  }

  if (errors.length > 0) {
    return res.send({
      success: "no",
      message: errors,
      data: [],
    });
  }

  Customers.getidofadmin(admin_id, (err, usedid) => {
    var user_id = usedid.user_id;
    Customers.getinsightsofallcustomers(admin_id, user_id,Filtertext, (err, data) => {
      if (data.length) {
        return res.send({
          success: "yes",
          message: "All insight data are here.",
          data: data,
        });
      }
    });
  });
};



