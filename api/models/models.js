import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Status = sequelize.define(
  "status",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "status",
    timestamps: false,
  }
);

export const Profile = sequelize.define(
  "profiles",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Status,
        key: "id",
      },
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_seen: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

export const Chat = sequelize.define(
  "chats",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Profile,
        key: "id",
      },
      allowNull: true,
    },
    second_user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Profile,
        key: "id",
      },
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

export const Message = sequelize.define(
  "messages",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    chat_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Chat,
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
    },
    sender_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Profile,
        key: "id",
      },
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Profile.belongsTo(Status, { foreignKey: "status_id" });

Chat.belongsTo(Profile, { foreignKey: "first_user_id", as: 'firstUser' }); // Alias para el primer usuario
Chat.belongsTo(Profile, { foreignKey: "second_user_id", as: 'secondUser' }); // Alias para el segundo usuario

Message.belongsTo(Chat, { foreignKey: "chat_id" });
Message.belongsTo(Profile, { foreignKey: "sender_id" });
Message.belongsTo(Profile, { foreignKey: "sender_id", as: "sender" });
