import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.module.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
    // return res.status(200).json({
    //     message: "Just for testing backend"})
//GET USER DETAILS from frontend
// validation - not empty
// check if user already exists: username, email
//check for images, check for avatar
//upload them to cloudinary, avatar
// create user object- create entry in db
// remove password and refresh token field from response
// check for user creation 
//return response


 const {fullname, email, username, password} = req.body
 console.log("email:", email);
//  if(fullname === ""){
//     throw new ApiError(400, "Full name is required")
//         }
//30.17

if(
[fullname,email,username,password].some((field) => field?.trim() === "")
){
    throw new ApiError(400, "Full name is required")
        }
      const existedUser =  User.findOne({
            $or: [{username},{email}]
        })
      if(existedUser){
        throw new ApiError(409, "User with emial or userrname")
      }

      const avatarLocalPath = req.files?.avatar[0]?.path
      const converImageLocalPath = req.files?.converImage[0]?.path;
      if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar files is required")
      }
  
      const avatar = await uploadOnCloudinary(avatarLocalPath)
      const coverImage = await uploadOnCloudinary(converImageLocalPath)

if(!avatar) {
  throw new ApiError(400, "Avatar file is required");
}

const user = await User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase()

})
const createdUser = await User.findById(user._id).select(
  "-password -refreshToken"
)
if(!createdUser) {
  throw new ApiError(500,"Something went wrong while registerrting the user")
}
return res.status(201).json(
  new ApiResponse(200, createdUser, "User registerted successfully")
)
})



export {
    registerUser,
}