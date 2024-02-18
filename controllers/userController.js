import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
  // registration

  static userRegistration = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email: email }); // checking duplicate email
    if (user) {
      res.send({ status: "failed", message: "email already exists" });
    } else {
      if (name && email && password) {
        // checking all fields are filled or not
        try {
          const salt = await bcrypt.genSalt(10);
          const hashpassword = await bcrypt.hash(password, salt);
          const doc = new UserModel({
            name: name,
            email: email,
            password: hashpassword,
          });
          await doc.save();
          res
            .status(201)
            .send({ status: "successfull", message: "registered successfuly" });
        } catch (error) {
          res.send({ status: "failed", message: "unable to register" });
        }
      } else {
        res.send({ status: "failed", message: "all fields are required" });
      }
    }
  };

  // login function

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password);

          if (user.email === email && isMatch) {
            // generate jwt token
            const token = jwt.sign(
              { userId: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );
            res.send({
              status: "success",
              message: "login success",
              token: token,
            });
          } else {
            res.send({
              status: "failed",
              message: "email or password is not valid",
            });
          }
        } else {
          res.send({ status: "failed", message: "email not registered" });
        }
      } else {
        res.send({ status: "failed", message: "all fields are required" });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "unable to login" });
    }
  };

  // password forgot
  static sendUserPasswordResetEmail = async (req, res) => {
    const { email } = req.body;
    if (email) {
      const user = await UserModel.findOne({ email: email });

      if (user) {
        const secret = user._id + process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ userId: user._id }, secret, {
          expiresIn: "15m",
        }); // generating link using token and userid
        const link = `http://127.0.0.1:3000/apiuser/reset/${user._id}/${token}`; // this is front end link
        // and used 3000 port in front end change accordingly

        // create route in front end for this password changing page
        console.log(link);
        res.send({
          status: "success",
          message: "password generating email sent to your email",
        });
      } else {
        res.send({ status: "failed", message: "email donsn't exist" });
      }
    } else {
      res.send({ status: "failed", message: "all fields are required" });
    }
  };
  static userPasswordReset = async (req, res) => {
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;
    const user = await UserModel.findById(id);
    const new_secret = (user._id = process.env.JWT_SECRET_KEY);
    console.log(id, token);
    try {
      jwt.verify(token, new_secret);
      if (password && password_confirmation) {
        if (password !== password_confirmation) {
          res.send({ status: "failed", message: "password dosn't match" });
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashpassword = await bcrypt.hash(password, salt);
          await UserModel.findByIdAndUpdate(req.user._id, {
            $set: { password: hashpassword },
          });
          res.send({ status: "failed", message: "password reset successful" });
        }
      } else {
        res.send({ status: "failed", message: "all fields are required" });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "error occered invalid tokenn" });
    }
  };
}

export default UserController;
