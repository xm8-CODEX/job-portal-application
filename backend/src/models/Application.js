const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Application extends Model {}

Application.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    job_id: { type: DataTypes.UUID, allowNull: false },
    seeker_id: { type: DataTypes.UUID, allowNull: false },
    resume_url: { type: DataTypes.STRING, allowNull: false },
    cover_note: { type: DataTypes.TEXT, allowNull: true },
    match_score: { type: DataTypes.FLOAT, allowNull: true }, // 0-1, from matchService
    status: {
      type: DataTypes.ENUM('applied', 'shortlisted', 'rejected', 'hired'),
      defaultValue: 'applied',
    },
  },
  {
    sequelize,
    modelName: 'Application',
    tableName: 'applications',
    indexes: [{ unique: true, fields: ['job_id', 'seeker_id'] }],
  }
);

module.exports = Application;
