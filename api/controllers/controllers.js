import { USER_NOT_FOUND } from "../constants/enums.js";
import { Profile } from "../models/models.js";

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
