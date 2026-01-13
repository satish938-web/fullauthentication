import bcrypt, { hash } from 'bcrypt';

export const generateHashPassword = async(password)=>{
    return await bcrypt.hash(password,10)
}

export const VerifyPasswordHash = async (password,hash) =>{
    return bcrypt.compare(password,hash)
}