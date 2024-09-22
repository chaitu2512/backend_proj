import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
    // get the user details from frontend

    // validation of the user data - not empty string
    //check if user is already exits : username and email
    //check for the images and check for avatar
    //upload them to cloudinary, avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation 
    //return response

    const {fullName,email,username,password} =  req.body;
    console.log("email: " ,email)

    if(
        [fullName,email,username,password].some((field) =>
            field?.trim() === ""
        )
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = User.findOne({
        $or : [{username},{email}]
    })

    if(existedUser){
        throw new ApiError("409","Username or email already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImageLocalPath?.path;
    if(!avatarLocalPath){
        throw new ApiError("400","missing avatar file");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError("400","avatar file is required");
    }
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email: email,
        password,
        username : username.two_lowercase(),

    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!createdUser){
        throw new ApiError("500","Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )
})

export { registerUser };