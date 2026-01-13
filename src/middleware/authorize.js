import { User } from "../model/userModel.js";

const authorize = (...permissions) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id).populate("role");

            if (!user || !user.role) {
                return res.status(403).json({
                    success: false,
                    message: "Role not assigned"
                });
            }

            const isAllowed = permissions.every(p =>
                user.role.permissions.includes(p)
            );

            if (!isAllowed) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }

            next();
        } catch (error) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }
    };
};

export default authorize;
