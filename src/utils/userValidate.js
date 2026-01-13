import validator from 'validator';

export const userValidate =({name,email,password}) =>{
    if(!name || !email || !password)
        throw new Error("All filed are required");

    if(!validator.isEmail(email))
        throw new Error("Invalid email Format");
    
    if(!validator.isStrongPassword(password))
        throw new Error("Weak password!!")
}