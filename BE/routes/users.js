const User = require("../models/user"); // Import User Model Schema
const { v4: uuidv4 } = require("uuid");
const hash = require("../config/password-hasher");
let bcrypt = require("bcryptjs");
const isot = require("../config/iso-to-string").isoToString;

module.exports = (router) => {
  router.get("/getAllUser", (req, res) => {
    // Search database for all blog posts
    User.find({ deleted: false }, (err, user) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if blogs were found in database
        if (!user) {
          res.json({ success: false, message: "No User found." }); // Return error of no blogs found
        } else {
          res.json({
            success: true,
            user: user.map((e) => ({
              ...e._doc,
              date_added: isot(e.dateAdded),
            })),
          }); // Return success and blogs array
        }
      }
    }).sort({ dateAdded: 1 }); // Sort blogs from newest to oldest
  });
  //Results.map(obj => ({ ...obj, Active: 'false' }))

  router.post("/addUser", (req, res) => {
    if (!req.body.email) {
      res.json({ success: false, message: "You must provide an email" });
    } else {
      if (!req.body.username) {
        res.json({ success: false, message: "You must provide an username" });
      } else {
        if (!req.body.password) {
          res.json({ success: false, message: "You must provide an password" });
        } else if (req.body.password !== req.body.confirm) {
          res.json({ success: false, message: "Password dont match" });
        } else {
          let user = new User({
            id: uuidv4(),
            email: req.body.email.toLowerCase(),
            username: req.body.username.toLowerCase(),
            firstname: req.body.firstname.toLowerCase(),
            lastname: req.body.lastname.toLowerCase(),
            password: req.body.password,
            role: req.body.role.toLowerCase(),
          });
          user.save((err, data) => {
            if (err) {
              if (err.code === 11000) {
                res.json({
                  success: false,
                  message: "User name or Email already exists ",
                  err: err.message,
                });
              } else {
                if (err.errors) {
                  //for specific error email,username and password
                  if (err.errors.email) {
                    res.json({
                      success: false,
                      message: err.errors.email.message,
                    });
                  } else {
                    if (err.errors.username) {
                      res.json({
                        success: false,
                        message: err.errors.username.message,
                      });
                    } else {
                      if (err.errors.password) {
                        res.json({
                          success: false,
                          message: err.errors.password.message,
                        });
                      } else {
                        res.json({ success: false, message: err });
                      }
                    }
                  }
                } else {
                  res.json({
                    success: false,
                    message: "Could not save user Error : " + err,
                  });
                }
              }
            } else {
              res.json({
                success: true,
                message: "Account Registered successfully",
                data: { email: data.email, username: data.username },
              });
              // globalconnetion.emitter('user')
            }
          });
        }
      }
    }
  });

  router.put("/deleteUser", (req, res) => {
    let data = req.body;

    User.deleteOne(
      {
        id: data.id,
      },
      (err, user) => {
        if (err) {
          res.json({ success: false, message: "Could not Delete User" + err });
        } else {
          res.json({
            success: true,
            message: " Successfully Deleted the User",
            data: user,
          });
          // globalconnetion.emitter('user')
        }
      }
    );
  });

  router.put("/updateUser", (req, res) => {
    let data = req.body;
    console.log({ data });
    let userData = {};

    User.findOne({ id: data.id }, async (err, docs) => {
      //check old password against the database

      if (err) {
        res.json({
          success: false,
          message: "Error unable to Process Profile update: " + err,
        });
      } else {
        //if they change thier password
        if (data.changePassword) {
          if (data.type === "admin") {
            hash
              .encryptPassword(data.newPassword)
              .then((hash) => {
                userData.role = data.role;
                userData.avatar = data.avatar;
                userData.username = data.username;
                userData.email = data.email;
                userData.password = hash;
                userData.firstname = data.firstname || "";
                userData.lastname = data.lastname || "";
                userData.address = data.address || "";
                changedPassword = true;
                User.findOneAndUpdate(
                  { id: data.id },
                  userData,
                  { upsert: true },
                  (err, response) => {
                    if (err)
                      return res.json({ success: false, message: err.message });
                    if (response) {
                      res.json({
                        success: true,
                        message: "User Information has been updated!",
                        data: response,
                      });
                    } else {
                      res.json({
                        success: true,
                        message: "No User has been modified!",
                        data: response,
                      });
                    }
                  }
                );
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            let checkPassword = await bcrypt.compare(
              data.newPassword,
              docs.password
            );

            if (!checkPassword) {
              res.json({
                success: false,
                message: "Old Password Incorrect: " + !checkPassword,
              });
            } else {
              hash
                .encryptPassword(data.newPassword)
                .then((hash) => {
                  userData.role = data.role;
                  userData.username = data.username;
                  userData.avatar = data.avatar;
                  userData.email = data.email;
                  userData.password = hash;
                  userData.firstname = data.firstname || "";
                  userData.lastname = data.lastname || "";
                  userData.address = data.address || "";
                  changedPassword = true;
                  User.findOneAndUpdate(
                    { id: data.id },
                    userData,
                    { upsert: true },
                    (err, response) => {
                      if (err)
                        return res.json({
                          success: false,
                          message: err.message,
                        });
                      if (response) {
                        res.json({
                          success: true,
                          message: "User Information has been updated!",
                          data: response,
                        });
                      } else {
                        res.json({
                          success: true,
                          message: "No User has been modified!",
                          data: response,
                        });
                      }
                    }
                  );
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            //
          }
        } else {
          userData.role = data.role;
          userData.avatar = data.avatar;
          userData.username = data.username;
          userData.avatar = data.avatar;
          userData.firstname = data.firstname || "";
          userData.lastname = data.lastname || "";
          userData.address = data.address || "";
          userData.email = data.email;
          // userData.status = data.status;
          User.findOneAndUpdate(
            { id: data.id },
            userData,
            { upsert: true },
            (err, response) => {
              if (err)
                return res.json({ success: false, message: err.message });
              if (response) {
                res.json({
                  success: true,
                  message: "User Information has been updated!",
                  data: response,
                });
              } else {
                res.json({
                  success: true,
                  message: "No User has been modified!",
                  data: response,
                });
              }
            }
          );
        }
      }
    });
  });

  router.put("/updateProfile", (req, res) => {
    let data = req.body;
    let userData = {};

    User.findOne({ id: data.id }, async (err, docs) => {
      if (err) {
        res.json({
          success: false,
          message: "Error unable to Find Profile: " + err,
        });
      } else {
        let checkPassword = await bcrypt.compare(
          data.newPassword,
          docs.password
        );

        if (!checkPassword) {
          res.json({
            success: false,
            message: "Old Password Incorrect: " + !checkPassword,
          });
        } else {
          hash
            .encryptPassword(data.newPassword)
            .then((hash) => {
              userData.role = data.role;
              userData.username = data.username;
              userData.email = data.email;
              userData.password = hash;
              userData.firstname = data.firstname || "";
              userData.lastname = data.lastname || "";
              userData.address = data.address || "";
              changedPassword = true;
              User.findOneAndUpdate(
                { id: data.id },
                userData,
                { upsert: true },
                (err, response) => {
                  if (err)
                    return res.json({ success: false, message: err.message });
                  if (response) {
                    res.json({
                      success: true,
                      message: "Your Information has been updated!",
                      data: response,
                    });
                  } else {
                    res.json({
                      success: true,
                      message: "No Information has been modified!",
                      data: response,
                    });
                  }
                }
              );
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    });
  });

  router.get("/getAllVolunteer", (req, res) => {
    // Search database for all blog posts
    User.find(
      { deleted: false, role: "volunteer" },
      { id: 1, email: 1, username: 1, role: 1, status: 1 },
      (err, user) => {
        // Check if error was found or not
        if (err) {
          res.json({ success: false, message: err }); // Return error message
        } else {
          // Check if Volunteer were found in database
          if (!user) {
            res.json({ success: false, message: "No Volunteer found." }); // Return error of no Volunteer found
          } else {
            res.json({ success: true, user: user }); // Return success and Volunteer array
          }
        }
      }
    ).sort({ dateAdded: 1 }); // Sort Volunteer from newest to oldest
  });

  router.get("/getTotalVolunteer", (req, res) => {
    // Search database for all blog posts
    User.countDocuments(
      { deleted: false, role: "volunteer" },
      (err, volunteer) => {
        // Check if error was found or not
        if (err) {
          res.json({ success: false, message: err }); // Return error message
        } else {
          // Check if SocialWorker were found in database
          if (!volunteer) {
            res.json({ success: true, name: "Volunteers", total: volunteer }); // Return error of no Volunteer found
          } else {
            res.json({ success: true, name: "Volunteers", total: volunteer }); // Return success and SocialWorker array
          }
        }
      }
    ); // Sort SocialWorker from newest to oldest
  });

  router.get("/getTotalFoster", (req, res) => {
    // Search database for all blog posts
    User.countDocuments(
      { deleted: false, role: "foster" },
      (err, volunteer) => {
        console.log({ volunteer });
        // Check if error was found or not
        if (err) {
          res.json({ success: false, message: err }); // Return error message
        } else {
          // Check if SocialWorker were found in database
          if (!volunteer) {
            res.json({ success: true, name: "Volunteers", total: volunteer }); // Return error of no Volunteer found
          } else {
            res.json({ success: true, name: "Volunteers", total: volunteer }); // Return success and SocialWorker array
          }
        }
      }
    ); // Sort SocialWorker from newest to oldest
  });

  return router;
};
