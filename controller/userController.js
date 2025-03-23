const User = require("../model/userModel");
const bcryptjs = require("bcryptjs");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const mongoose = require("mongoose");

const create_token = async (id) => {
  try {
    const token = await jwt.sign({ _id: id }, config.secret_key);
    return token;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const securepassword = async (password) => {
  try {
    const passwordHash = await bcryptjs.hash(password, 10);
    return passwordHash;
    // res
    // .status(200)
    // .send({ success: true, password: passwordHash });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const register_user = async (req, res) => {
  try {
    // checkBody(req);
    const spassword = await securepassword(req.body.password);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: spassword,
      role:req.body.role
    });

    const userData = await User.findOne({ email: req.body.email });
    if (userData) {
      res
        .status(400)
        .send({ success: false, msg: "This email is already exists." });
    } else {
      const user_data = await user.save();
      res.status(200).send({ success: true, data: user_data });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// login method

const user_login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    
    const userData = await User.findOne({ email: email });
    if (userData) {
      const passwordMatch = await bcryptjs.compare(password, userData.password);
      if (passwordMatch) {
        const tokendata = await create_token(userData._id);
        const userResult = {
          // _id: userData._id,
          // name: userData.name,
          // email: userData.email,
          // password: userData.password,
          role: userData.role,
          // // image: userData.image,
          // // mobile: userData.mobile,
          // // type: userData.type,
          token: tokendata,
        };

        const response = {
          success: true,
          msg: "User Details",
          data: userResult,
        };
        res.status(200).send(response);
      } else {
        res
          .status(200)
          .send({ success: false, msg: "login credentials are incorrect." });
      }
    } else {
      res
        .status(200)
        .send({ success: false, msg: "login credentials are incorrect." });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

const auth = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res
      .status(200)
      .send({ success: true, msg: "Authentication successfull", user });
  } catch (error) {}
};

const update_password = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const password = req.body.password;
    console.log(user_id);
    const data = await User.findOne({ _id: user_id });

    if (data) {
      const new_password = await securepassword(password);

      User.findByIdAndUpdate(
        { _id: user_id },
        {
          $set: {
            password: new_password,
          }
        },{new:true},function(err, result){
          if(err)
            console.log(err)
          // console.log("Result:-"+result)
        }
      );

      res
        .status(200)
        .send({
          success: true,
          msg: "Your password has been updated successfully.",
        });
    } else {
      res.status(200).send({ success: false, msg: "user id not found!" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// const forget_password = async (req, res) => {
//   try {
//     const email = req.body.email;
    
//     if(email){
//       const userData = await User.findOne({ email: email });
//       if (userData) {
//         // const randomString = randomstring.generate();
//         // const data = await User.updateOne(
//         //   { email: email },
//         //   { $set: { token: randomString } }
//         // );
//         sendResetPasswordMail(userData.name, userData.email, userData._id);
//         res
//           .status(200)
//           .send({ success: true, msg: "Please check your mailbox." });
//       } else {
//         res
//           .status(200)
//           .send({ success: true, msg: "This email is does not exists." });
//       }
//     } else{
//       res.status(400).send({ success: true, msg: "Please Enter a Email." });
//     }
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

// const reset_password = async (req, res) => {
//   try {
//     // const token = req.query.token;
//     const user_id = req.query.id;
//     console.log(user_id);

//     const udata = await User.findOne({ _id: user_id });
    
//     if (udata) {
//       const password = req.body.password;
//       const new_password = await securepassword(password);
//       const userdata = await User.findByIdAndUpdate(
//         { _id: udata._id },
//         { $set: { password: new_password, token: "" } },
//         { new: true }
//       );

//       res
//         .status(200)
//         .send({
//           success: true,
//           msg: "Your password has been reset successfully.",
//           data: userdata,
//         });
//     } else {
//       res
//         .status(200)
//         .send({ success: true, msg: "This token has been expired." });
//     }
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

// const deleteuser = async (req, res) => {
//     const deleteid = req.params.id;
    
//     try {
//       if(req.user._id != deleteid){
//         return res.status(200).send({success: true, msg:"Authrization token is not matched."});
//       }
      
//       const del_user = await User.findByIdAndRemove({_id:deleteid});
//       res.status(200).send({ success: true,  msg:"User has deleted successfully."});
      
//     } catch (error) {
//       res.status(400).send({success: false, msg: error.message});
//     }
// }

const getuser = async (req, res) => {
  const id = req.params.id;

  try {
    if(req.user._id != id){
      return res.status(200).send({success: true, msg:"Authrization token is not matched."});
    }
  
    const userdata = await User.findById({_id:id});
    res.status(200).send({success: true, msg:"User details fetched successfully.", data: userdata});
  } catch (error) {
    res.status(400).send({success: false, msg: error.message});
  }
  
}

const updateuser = async (req, res) =>{
  const uid = req.params.id;
  
  try {
    if(req.user._id != uid){
      return res.status(200).send({success: true, msg:"Authrization token is not matched."});
    }

    const userdata = User.findOne({ _id : uid});
    
    if(!userdata) return res.status(404).json({success: false, msg:"user is not found !!!"});
    const new_name = req.body.name;
    const new_email = req.body.email;
    
    const updatedata = await User.findByIdAndUpdate({ _id:uid }, {
      $set: {
        name: new_name, email: new_email
      }},{new: true});
    
    if(updatedata) res.status(200).json({success: true, msg:`User profile updated successfully.`})
    
  } catch (error) {
    res.status(400).json({success: false, msg: error.message});
  }
}

const getAllUsers = async (req, res) => {

  try {
    // const allUserDetails = User.find({}, function(err, usersData){
    //   if(err)
    //     console.log(err);
    //   if(usersData){
    //     // console.log("Users count : " + usersData.length);
    //     // console.log(usersData);
    //     res.status(200).send({success:true,msg:"All Users Data has Fetched Successfully.", result:usersData});
    //   }  
    // });
    const allUserDetails = await User.find({_id:{$ne: req.user._id}}, 'name email role');
    res.status(200).send({success:true,msg:"All Users Data has been Fetched Successfully.", result:allUserDetails});

  } catch (error) {
    res.status(400).json({success: false, msg: error.message});
  }
  
}


const getuserbyids = async (req, res) => {
  try {
    const { ids } = req.body; // Array of user IDs
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }

    // const users = await User.find({ _id: { $in: ids } });
    const users = await User.find(
      { _id: { $in: ids } },
      'name email role' // Only include these fields
    );
    // const users = await User.find(
    //   { _id: { $in: ids } }
    // ).select('-password');

    if (users.length === 0) {
      return res.status(404).json({ message: "No user found" });
    }
    
    res.status(200).send({success: true, msg:"User details fetched successfully.", data: users});;
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};



module.exports = {
  register_user,
  user_login,
  securepassword,
  auth,
  update_password,
  // forget_password,
  // reset_password,
  // deleteuser,
  getuser,
  getuserbyids,
  updateuser,
  getAllUsers,
};
