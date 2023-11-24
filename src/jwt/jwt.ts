import jwt from "jsonwebtoken";
import { JWT_SECRET, loggedInUsers } from "../modules/auth/auth.controller";

class jwtToken {
    public static async verifyJwt(request: any, response: any, next: CallableFunction) {
        const token = request.headers['authorization'];
        if (!token) {
            return response.status(403).json({
                message: 'No token provided'
            });
        }
        if( !loggedInUsers.includes(token)){
            return response.status(401).json({
                message: 'User already logout'
            }); 
        }
        jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
            if (err) {
                return response.status(401).json({
                    message: 'Unauthorized'
                });
            }
            request.user = decoded;
            next();
        });
    }
}
export default jwtToken;