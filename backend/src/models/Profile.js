const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Profile extends Model {}

Profile.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false, unique: true },
    skills: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    resume_url: { type: DataTypes.STRING, allowNull: true },
    experience_years: { type: DataTypes.FLOAT, defaultValue: 0 },
    education: { type: DataTypes.STRING, allowNull: true },
    bio: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    modelName: 'Profile',
    tableName: 'profiles',
  }
);

module.exports = Profile;
