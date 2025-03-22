import ContactUs from "../models/contactUsModel.js";

// @desc:  send message using contact us form
// @route: POST /api/v1/contact
const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = new ContactUs({ name, email, subject, message });
    await contact.save();

    return res
      .status(201)
      .json({ status: true, message: "contact message sent", data: contact });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc:  get all contact
// @route: GET /api/v1/contact
const getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactUs.find({});
    return res.status(200).json({
      status: true,
      message: "all contacts fetched successfully",
      data: contacts,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc:  get a single contact
// @route: GET /api/v1/contact/:id
const getContactById = async (req, res) => {
  try {
    const contact = await ContactUs.findById(req.params.id);
    if (!contact) {
      return res
        .status(404)
        .json({ status: false, message: "contact not found" });
    }

    return res.status(200).json({ status: true, data: contact });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc:  delete contact form the db
// @route: DELETE /api/v1/contact/:id
const deleteContact = async (req, res) => {
  try {
    const deletedContact = await ContactUs.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res
        .status(404)
        .json({ status: false, message: "contact not found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "contact deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

export { sendContactMessage, getAllContacts, getContactById, deleteContact };
