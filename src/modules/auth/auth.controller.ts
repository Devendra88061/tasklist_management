import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import user from "../../models/user";
const JWT_SECRET = "axcdremsXvT";


class authController {

  // SignUp
  public static async signUpUser(request: any, response: any) {
    const { userName, password, qualification, city, phoneNumber, role } = request.body;
    try {
      // Check if the user already exists
      const existingUser = await user.findOne({ phoneNumber });
      if (existingUser) {
        return response.status(400).json({
          message: "User already exists"
        });
      }
      else {
        // userName and phone no is required fields
        if (!request.body.userName || !request.body.phoneNumber) {
          return response.status(400).send({
            message: "Required fields are missing",
          });
        }
        const newUser = new user({
          userName, password, qualification, city, phoneNumber, role
        });
        const hash = await bcrypt.hash(password, 17);
        newUser.password = hash;
        await newUser.save();
        response.status(201).json({
          message: "User created successfully",
          data: newUser,
        });
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({
        message: "Internal server error"
      });
    }
  };

  // login 
  /*
   * Note : for the login process we need the email id because 
   *        there are many users with same name
   */
  public static async login(request: any, response: any) {
    console.log("Hhello-----");
    const { userName, password } = request.body;
    console.log("password---", password.length);
    try {
      let userData = await user.findOne({ userName });
      console.log("userData---", userData?.password.length);
      if (password == userData?.password) {

      }
      if (!userData) {
        return "You are not register user please signUp now";
      }
      const passwordMatch = await bcrypt.compare(password, userData?.password);
      console.log("passwordMatch---", passwordMatch);
      if (passwordMatch) {
        // To convert mongoose doc into plain object
        userData = userData.toObject();
        console.log("userData---", userData);
        const token = jwt.sign({ userName: userData.userName }, JWT_SECRET);
        console.log("token---", token);
        userData.token = token;
        return {userData};
      } else {
        return "Invalid password please re-entered correct password";
      }
    } catch (error: any) {
      response.status(500).json({
        message: "Internal server error"
      });
    }
  }

  // HomeTab
  public static async homeTab(request: any, response: any) {
    const userId = request.params.id
    console.log("userId---", userId);
    try {
      const userData = await user.findById(userId);
      if (!userData) {
        return response.status(404).json({
          message: 'User not found'
        });
      }
      response.json({
        userName: userData.userName,
        qualification: userData.qualification,
        city: userData.city,
        phoneNumber: userData.phoneNumber,
      });
    } catch (error: any) {
      response.status(500).json({
        message: "Internal server error"
      });
    }
  }

}
export default authController;