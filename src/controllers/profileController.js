import { User } from "../model/userModel.js";

export const getProfile = async (req, res) => {
  const user = await User
    .findById(req.user.id).populate("role","role permissions -_id")  
          .select("-password");
    

  res.json({
    message: "Profile fetched",
    data: user
  });
};
