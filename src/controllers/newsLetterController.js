import NewsLetter from "../models/newsLetter.js";
import sendMail from "../utils/sendEmail.js";

// @desc:  join newsletter
// @route: POST /api/v1/newsletters
const joinNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "email is required",
      });
    }

    let newsletter = await NewsLetter.findOne({ email });
    if (newsletter) {
      return res.status(400).json({
        status: false,
        messgae: "already subscribed",
      });
    }

    let subscribe = await NewsLetter.create({ email });
    return res.status(200).json({
      status: true,
      message: "subscribed to the newsletter successful",
      data: subscribe,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc:  get all subcribed email address
// @route: GET /api/v1/newsletters
const getAllSubscribedUsers = async (req, res) => {
  try {
    const subscribers = await NewsLetter.find({});
    return res.status(200).json({
      status: true,
      message: "fetch all subscriber successfully",
      data: subscribers,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc:  send newsletter
// @route: POST /api/v1/newsletters/send
const sendNewsLetter = async (req, res) => {
  try {
    const { sub, body } = req.body;

    const subscibedUsers = await NewsLetter.find({});

    const emails = subscibedUsers.map((user) => user.email);
    const emailString = emails.join(", ");
    sendMail(emailString, sub, body);

    return res
      .status(200)
      .json({ status: true, message: "email sent successfully" });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

export { joinNewsletter, getAllSubscribedUsers, sendNewsLetter };
