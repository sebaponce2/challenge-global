import { Op } from "sequelize";
import { USER_NOT_FOUND } from "../constants/enums.js";
import { Chat, Message, Profile, Status } from "../models/models.js";
import { getTimeAgo } from "../utils/time.js";

export const getUserLogin = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await Profile.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: USER_NOT_FOUND,
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error al recuperar el usuario",
      error,
    });
  }
};

export const getChatList = async (req, res) => {
  const { userId } = req.query;

  try {
    const chatList = await Chat.findAll({
      where: {
        [Op.or]: {
          first_user_id: userId,
          second_user_id: userId,
        },
      },
    });

    let response = [];

    if (chatList) {
      for (const chat of chatList) {
        // Determina quién es el contacto dependiendo de si el usuario es first_user_id o second_user_id
        const user_chat =
          chat.dataValues.first_user_id === Number(userId)
            ? chat.dataValues.second_user_id
            : chat.dataValues.first_user_id;

        const contact = await Profile.findOne({ where: { id: user_chat } });

        // Obtener el último mensaje relacionado con el chat
        const lastMessage = await Message.findOne({
          where: {
            chat_id: chat.id,
          },
          order: [["time", "DESC"]],
        });

        response.push({
          id: chat.id,
          contact: {
            id: contact.dataValues.id,
            name: contact.dataValues.name,
            lastName: contact.dataValues.last_name,
          },
          lastMessage: lastMessage ? lastMessage.dataValues.content : null,
          lastMessageTime: lastMessage
            ? lastMessage.dataValues.time.toLocaleTimeString([], {
                hour: "numeric",
                minute: "numeric",
              })
            : null,
        });
      }
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Error al recuperar el chat",
      error,
    });
  }
};

export const getChatMessages = async (req, res) => {
  const { chatId, userId } = req.query;

  try {
    const messages = await Message.findAll({
      where: {
        chat_id: chatId,
      },
      order: [["time", "ASC"]],
      include: [
        {
          model: Profile,
          as: "sender",
          attributes: ["id", "name", "last_name"],
        },
      ],
    });

    const chat = await Chat.findOne({
      where: { id: chatId },
      attributes: ["first_user_id", "second_user_id"],
    });

    const contactId =
      chat.first_user_id === Number(userId)
        ? chat.second_user_id
        : chat.first_user_id;

    const contactProfile = await Profile.findOne({
      where: { id: contactId },
      attributes: ["id", "last_seen", "status_id"],
      include: [
        {
          model: Status,
          attributes: ["value"], 
        },
      ],
    });

    const formattedMessages = messages.map((message) => ({
      sender:
      message.sender.id === Number(userId) ? "You" : message.sender.name,
      content: message.content,
      time: message.time.toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric",
      }),
    }));
    const formattedLastSeen = getTimeAgo(contactProfile.last_seen);

    const response = {
      contactId: contactId.toString(),
      status: contactProfile.status.value,
      lastSeen: `Last seen: ${formattedLastSeen}`, 
      messages: formattedMessages,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Error al recuperar los mensajes",
      error,
    });
  }
};
