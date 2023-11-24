import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import user from "../../models/user";
import { userRole } from "../../enum/enum";
export const JWT_SECRET = "axcdremsXvT";
import twilio from "twilio";

export const loggedInUsers: Array<string> = [];

// Twilio credentials
const accountSid = 'AC4dd4eae08c4d763594eb7d55ddb1e5e8';
const authToken = 'fccedd51d35d8b45b5cfa88fd373ce07';
const twilioPhone = '+12767794333';

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
        // authController.sendOtp(phoneNumber, response);
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
    const { userName, password } = request.body;
    try {
      let userData = await user.findOne({ userName });
      if (!userData) {
        return response.status(400).send({
          message: "You are not register user please signUp now",
        });
      }
      const passwordMatch = await bcrypt.compare(password, userData?.password);
      if (passwordMatch) {
        // To convert mongoose doc into plain object
        userData = userData.toObject();
        const token = jwt.sign({ _id: userData._id }, JWT_SECRET);
        (userData as any)["token"] = token;
        loggedInUsers.push(token);
        return response.status(200).send({
          data: userData,
        });
      } else {
        return response.status(400).send({
          message: "Invalid password please re-entered correct password",
        });
      }
    } catch (error: any) {
      response.status(500).json({
        message: "Internal server error"
      });
    }
  }
  // logout Api
  public static async logout(request: any, response: any) {
    try {
      const token = request.header('Authorization');
      loggedInUsers.splice(loggedInUsers.indexOf(token), 1);
      response.status(200).json({
        message: "Logout successful"
      });
    } catch (error) {
      response.status(500).json({
        message: 'Internal Server Error'
      })
    }
  };

  // HomeTab
  public static async homeTab(request: any, response: any) {
    const userId = request.params.id
    console.log("userId---", userId);
    try {
      const userData = await user.findById({ _id: userId });
      if (!userData) {
        return response.status(404).json({
          message: 'User not found'
        });
      }
      response.status(200).json({
        message: 'record fetch successfully',
        data: userData
      });
    } catch (error: any) {
      response.status(500).json({
        message: "Internal server error"
      });
    }
  }

  // add url functionality 

  public static async addUrl(request: any, response: any) {
    const userData = request.user;
    try {
      const userId = userData._id;
      const userNewData = await user.findById({ _id: userId });
      const role = userNewData?.role;

      if (role == userRole.ADMIN) {
        const updateData = request.body;
        const updatedUser = await user.findByIdAndUpdate(userId, updateData, { new: true });
        if (!updatedUser) {
          return response.status(404).json({
            message: 'User not found',
          });
        }
        response.json({
          message: "Only admin can add url",
          url: updatedUser.url,
        });
      } else if (role == userRole.USER) {
        try {
          const recordCount = await user.countDocuments();
          const userData = await user.find();
          response.status(200).json({
            message: "You are only able to see url data",
            totalUrlCount: recordCount,
            result: userData,
          });
        } catch (error) {
          response.status(500).json({
            message: "Something went wrong",
          });
        }
      }
    } catch (error: any) {
      response.status(500).json({
        message: "Internal server error"
      });
    }
  }

  // We are sending the otp on mobile number but 
  // On task there is no further process for the otp verification 
  // we are using username and password for login api

  public static async sendOtp(phone: any, response: any) {
    var client = twilio(accountSid, authToken);
    const phoneNumber = phone;
    const otp = this.generateOTP();

    // Send OTP via Twilio
    client.messages
      .create({
        body: `Your OTP is: ${otp}`,
        from: twilioPhone,
        to: phoneNumber,
      })
      .then((message: any) => {
        console.log(message.sid);
        response.send('OTP sent successfully');
      })
      .catch((error: any) => {
        console.error(error);
        response.status(500).send('Error sending OTP');
      });
  } static generateOTP() {
    throw new Error("Method not implemented.");
  };
  generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
export default authController;