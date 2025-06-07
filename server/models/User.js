import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
    {
        clientcode : {type:String, Required:true, unique:true},
        token : {type:String, Required:true},
    }
)
const User = mongoose.model("User",UserSchema);
export default User;
