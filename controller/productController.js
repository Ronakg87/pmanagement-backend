const { default: mongoose } = require('mongoose');
const Product = require('../model/productModel');
require('dotenv').config();
const add_product = async (req, res) => {
  try {
      // Ensure assignedTo is saved as an array of strings
      let assignedTo = req.body.assignedTo;

      // Check if assignedTo is a stringified array and parse it
      if (typeof assignedTo === 'string') {
          try {
              assignedTo = JSON.parse(assignedTo);
          } catch (error) {
              console.error("Invalid JSON format for assignedTo:", error);
              return res.status(400).send({ success: false, msg: "Invalid assignedTo format" });
          }
      }

      // Ensure it is always saved as an array
      if (!Array.isArray(assignedTo)) {
          assignedTo = [assignedTo];
      }

      const product = new Product({
          name: req.body.name,
          sku: req.body.sku,
          description: req.body.description,
          category: req.body.category,
          logo: req.file.filename,
          source: req.user.role,
          user_id: req.user._id,
          assignedTo: assignedTo
      });

      const productData = await Product.findOne({ name: req.body.name });
      if (productData) {
          res.status(400).send({ success: false, msg: "This Product already exists." });
      } else {
          const product_data = await product.save();
          res.status(200).send({ success: true, data: product_data });
      }
  } catch (error) {
      console.error(error);
      res.status(400).send({ success: false, msg: error.message });
  }
};

const deleteproduct = async (req, res) => {
    const deleteid = req.params.id;
    const source = req.params.source;
    try {
      if(req.user.role === "user" && source === "admin"){
        const updatedProduct = await Product.findOneAndUpdate(
          { _id: deleteid},   // Filter by product ID and the current user's ID
          { $pull: { assignedTo: req.user._id } },           // Remove the `userid` from `assignedTo`
          { new: true }                                // Return the updated document
        );
        res.status(200).send({ success: true,  msg:"Product has deleted successfully."});
      } else { 
        const del_product = await Product.findOneAndDelete({_id:deleteid, user_id: req.user._id});
        res.status(200).send({ success: true,  msg:"Product has deleted successfully."});
      }
      
      
    } catch (error) {
      res.status(400).send({success: false, msg: error.message});
    }
}

const getproduct = async (req, res) => {
  const id = req.params.id;

  try {
    // if(req.user._id != id){
    //   return res.status(200).send({success: true, msg:"Authrization token is not matched."});
    // }
  
    // const userdata = await Product.findById({_id:id});
    const productdata = await Product.findById({ _id:id });
    // console.log(productdata);
    if(productdata.length === 0){
      res.status(200).send({success: true, msg:"No Data Found.", data: productdata});
    }
    res.status(200).send({success: true, msg:"Product details fetched successfully.", data: productdata});
  } catch (error) {
    res.status(400).send({success: false, msg: error.message});
  }

}
const updateproduct = async (req, res) =>{
  const pid = req.params.id;

  try {
    // if(req.user._id != pid){
    //   return res.status(200).send({success: true, msg:"Authrization token is not matched."});
    // }

    if (!mongoose.isValidObjectId(pid)) {
      return res.status(404).json({success: false, message: "Please provide valid Product id"});
    }

    const productdata = await Product.findById(pid);
    if(!productdata) return res.status(404).json({success: false, msg:"Product not found."});
   
    const {
      name,
      sku,
      description,
      category,
      source,
    } = req.body;
    
    let assignedTo = req.body.assignedTo;

    let logo = productdata.logo; // Use existing logo by default
    if (req.file) {
      // Check if a new logo file was uploaded
      logo = req.file.filename; // Assuming `req.file.filename` contains the uploaded file name

      // Optional: Delete old logo from server (if applicable)
      const fs = require("fs");
      const oldLogoPath = `${process.env.ROOTURL}/productLogo/${logo}`;
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }

    // Check if assignedTo is a stringified array and parse it
    if (typeof assignedTo === 'string') {
      try {
          assignedTo = JSON.parse(assignedTo);
      } catch (error) {
          console.error("Invalid JSON format for assignedTo:", error);
          return res.status(400).send({ success: false, msg: "Invalid assignedTo format" });
      }
  }

  // Ensure it is always saved as an array
  if (!Array.isArray(assignedTo)) {
      assignedTo = [assignedTo];
  }
    
      const updatedProduct = await Product.findByIdAndUpdate(
        pid,
        {
          $set: {
            name,
            sku,
            description,
            category,
            logo,
            assignedTo,
            source,
          },
        },
        { new: true }
      );
    // const updatedata = await Product.findOneAndUpdate({ _id:pid, assignedTo: req.user._id }, {
    //   $set: {
    //     name: new_pname, description: new_pdescription, category: new_category, assignedTo: new_assignedTo, source: new_source,
    //   }},{new: true});
    
    if(updatedProduct) res.status(200).json({success: true, msg:`Product Updated Successfully.`});
    
  } catch (error) {
    res.status(400).json({success: false, msg: error.message});
  }
}

const getallproducts = async (req, res) => {
  const role = req.user.role;
  let allProductDetails = '';
  try {
    if(role === "admin"){
    allProductDetails = await Product.find();
    }else{
      allProductDetails = await Product.find({assignedTo: req.user._id});
    }
    // if(allUserDetails){
      res.status(200).send({success:true,msg:"All Products Data has been Fetched Successfully.", result:allProductDetails});
    // }

  } catch (error) {
    res.status(400).json({success: false, msg: error.message});
  }
  
}

const assignProductToUsers = async (req, res) =>{
  const pid = req.params.id;
  const assign_from = req.user._id;
  const assign_to = req.body.assign_to;

  try {
    if(req.user.role === 'admin'){
      return res.status(200).send({success: true, msg:"Access Denied."});
    }

    const productdata = await Product.findOne({ _id : pid});
    const uniqueArray= [
      ...new Set([...assign_to, ...productdata.assignedTo])
    ];
    
    const updatedata = await Product.findByIdAndUpdate({ _id:pid }, {
      $set: {
        assignedTo:uniqueArray
      }},{new: true});
    
    if(updatedata) res.status(200).json({success: true, msg:`Product assign successfully.`})
    
  } catch (error) {
    res.status(400).json({success: false, msg: error.message});
  }
}


module.exports = {
    add_product,
    getproduct,
    deleteproduct,
    updateproduct,
    getallproducts,
    assignProductToUsers
};