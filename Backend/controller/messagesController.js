import messageModel from "./../model/MessageModel.js";
import { encrypt, decrypt } from "./enrypt_decrypt.js";

export const addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const encryptedObj = encrypt(message);
    const data = await messageModel.create({
      encrypted_msg: encryptedObj.encrypted_message,
      iv: encryptedObj.iv,
      users: [from, to],
      sender: from,
    });
    if (data) {
      return res.json({ msg: "Message added Successfully." });
    }
    return res.json({ msg: "Fail to add message to the database" });
  } catch (err) {
    next(err);
  }
};

export const getMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await messageModel
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updatedAt: 1 });

    const projecteMessages = messages.map((msg) => {
      let encrypted_msg = msg.encrypted_msg;
      let iv = msg.iv;
      let decrypt_msg = decrypt(encrypted_msg, iv);
      const time = new Date(msg.createdAt).toLocaleTimeString("en-IN",{
        hour:"2-digit",
        minute:"2-digit"
      });
      
      return {
        fromSelf: msg.sender.toString() === from,
        message: decrypt_msg.decrypted_message,
        date_time:time.split(" ")[0]
      };
    });

    res.json(projecteMessages);
  } catch (err) {
    next(err);
  }
};
