const { sequelize } = require('../config/db');
const User = require('./User');
const Profile = require('./Profile');
const Job = require('./Job');
const Application = require('./Application');

// Associations
User.hasOne(Profile, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Profile.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Job, { foreignKey: 'employer_id', onDelete: 'CASCADE' });
Job.belongsTo(User, { foreignKey: 'employer_id', as: 'employer' });

Job.hasMany(Application, { foreignKey: 'job_id', onDelete: 'CASCADE' });
Application.belongsTo(Job, { foreignKey: 'job_id' });

User.hasMany(Application, { foreignKey: 'seeker_id', onDelete: 'CASCADE' });
Application.belongsTo(User, { foreignKey: 'seeker_id', as: 'seeker' });

module.exports = { sequelize, User, Profile, Job, Application };
