const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Job extends Model {}

Job.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    employer_id: { type: DataTypes.UUID, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    skills: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    location: { type: DataTypes.STRING, allowNull: false },
    job_type: {
      type: DataTypes.ENUM('full-time', 'part-time', 'internship', 'contract'),
      defaultValue: 'full-time',
    },
    salary_min: { type: DataTypes.INTEGER, allowNull: true },
    salary_max: { type: DataTypes.INTEGER, allowNull: true },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'closed'),
      defaultValue: 'pending',
    },
    deadline: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    modelName: 'Job',
    tableName: 'jobs',
    indexes: [{ fields: ['status'] }, { fields: ['location'] }],
  }
);

module.exports = Job;
