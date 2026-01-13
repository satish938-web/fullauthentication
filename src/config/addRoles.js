import Role from "../model/roleModel.js";

export const addRoles = async () => {
  const admin = await Role.findOne({ role: "admin" });

  if (!admin) {
    await Role.create({
      role: "admin",
      permissions: ["create", "read", "update", "delete"] // ✅ fixed
    });
  }

  const user = await Role.findOne({ role: "user" });

  if (!user) {
    await Role.create({
      role: "user",
      permissions: ["read"] // ✅ fixed
    });
  }

  console.log("Roles are ready");
};
