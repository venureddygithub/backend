import mongoose from "mongoose";

 export async function mongoDbconnnection(){
    try{
      const uri="mongodb+srv://venuetta104254:c4aLCHARG1O1dKca@vegetable.4mrwd.mongodb.net/"
      await mongoose.connect(uri);

      const db=mongoose.connection.useDb("vegetable_database");
      const user_details=db.collection("user-details");
      console.log("mango db connected")

      return user_details;

  
    }catch(e){
      console.log(e)
  
    }

  }