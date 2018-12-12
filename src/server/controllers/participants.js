const { Op } = require('sequelize');
const { join } = require('path');
const participant = require('../database/models/participant');
const dates = require('../database/models/dates');
const courses = require('../database/models/participantCourses');
const { checkFiles } = require('./../helpers/checkFiles');
const { participantValid } = require('./../helpers/validation');

// Get all participants
exports.get = async (req, res) => {
  try {
    const getParticipants = await participant.findAll({
      order: [
        ['nationality', 'ASC'],
      ],
    });
    res.send({ getParticipants });
  } catch (err) {
    res.status(500).send({ err });
  }
};

// delete an exist participant
exports.delete = (req, res) => {
  try {
    participant
      .destroy({
        where: {
          id: req.body.participantId,
        },
      })
      .then(() => {
        res.status(200).send({
          message: 'participant deleted successfully',
        });
      });
  } catch (err) {
    res.status(500).send({
      err,
    });
  }
};

// Search for an individual participant by surname & forename
exports.searchBySurName = async (req, res) => {
  try {
    const { participantName } = req.body;
    const searchResult = await participant.findAll({
      where: {
        [Op.or]: [{
          surename: {
            [Op.iLike]: `%${participantName}%`,
          },
        }, {
          forename: {
            [Op.iLike]: `%${participantName}%`,
          },
        }],
      },
    });
    if (searchResult[0]) {
      res.send({ searchResult });
    } else {
      res.send({ message: 'Cant find participant with this name' });
    }
  } catch (error) {
    res.send({ error });
  }
};

// Search for an individual participant by birth of date
exports.searchBydate = async (req, res) => {
  try {
    const { participantDate } = req.body;
    const searchResult = await participant.findAll({
      where: {
        date_of_birth: {
          [Op.gte]: `%${participantDate}%`,
        },
      },
    });
    if (searchResult[0]) {
      res.send({ searchResult });
    } else {
      res.send({ message: 'Cant find participant with this birth of date' });
    }
  } catch (error) {
    res.send({ error });
  }
};

// Get the details for an individual participant
exports.getDetails = async (req, res) => {
  const CVsPath = join(__dirname, '..', 'CVs');

  try {
    const participantId = req.params.id;
    const result = await participant.findAll({
      where: {
        id: participantId,
      },
    });
    const filename = await checkFiles(CVsPath, participantId);
    if (result[0]) {
      const details = result[0].dataValues;
      if (filename) details.fileExists = true;
      else details.fileExists = false;
      res.status(200).send(details);
    } else {
      res.status(404).send('Error in finding result');
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

// Add new participant
exports.post = async (req, res) => {
  try {
    const participantdata = JSON.parse(req.body.data);
    participantValid(participantdata);
    const { count } = await participant.findAndCountAll({
      where: {
        email: participantdata.email,
      },
    });
    if (count !== 0) throw new TypeError('The email is used');
    const { dataValues: { id } } = await participant.create(participantdata);
    if (!req.files) {
      return res.send({ message: 'Adding participant done', id });
    }
    const { file } = req.files;
    if (file) {
      file.mv(join(__dirname, '..', 'CVs', `${id}.${file.mimetype.split('/')[1]}`), (err) => {
        if (err) res.status(400).send('Error');
        else {
          return res.send({ message: 'Adding participant done', id });
        }
      });
    } else {
      res.send({ message: 'Adding participant done', id });
    }
  } catch (error) {
    const { message } = error;
    res.send({ error: message });
  }
};

// Get dates for an individual participant
exports.getDates = async (req, res) => {
  try {
    const participantId = req.params.id;
    const participantDates = await dates.findAll({
      where: {
        participant_id: participantId,
      },
    });
    res.send({ participantDates });
  } catch (err) {
    res.status(500).send({ err });
  }
};

// delete an exist date for an individual participant
exports.deleteDate = (req, res) => {
  try {
    dates
      .destroy({
        where: {
          id: req.body.dateId,
        },
      })
      .then(() => {
        res.status(200).send({
          message: 'date deleted successfully',
        });
      });
  } catch (err) {
    res.status(500).send({
      err,
    });
  }
};

// Update information of participant
exports.update = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    const participantId = req.params.id;
    await participant.update(data, {
      where: {
        id: participantId,
      },
    });
    if (!req.files) {
      return res.send({ message: 'updating data is done' });
    }
    const { file } = req.files;
    if (file) {
      file.mv(join(__dirname, '..', 'CVs', `${participantId}.${file.mimetype.split('/')[1]}`), (err) => {
        if (err) res.status(400).send('Error');
        else {
          return res.send({ message: 'updating data is done' });
        }
      });
    }
  } catch (error) {
    const { message } = error;
    res.send({ error: message });
  }
};

// Get the details for an individual date
exports.getDateDetails = async (req, res) => {
  try {
    const { dateId } = req.params;
    const result = await dates.findAll({
      where: {
        id: dateId,
      },
    });
    if (result[0]) {
      const details = (result[0].dataValues);
      res.status(200).send(details);
    } else {
      res.status(404).send('Error in finding result');
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

// Get courses for an individual participant
exports.getCourses = async (req, res) => {
  try {
    const participantId = req.params.id;
    const participantCourses = await courses.findAll({
      where: {
        participant_id: participantId,
      },
    });
    res.send({ participantCourses });
  } catch (err) {
    res.status(500).send({ err });
  }
};

// delete an exist course for an individual participant
exports.deleteCourse = (req, res) => {
  try {
    courses
      .destroy({
        where: {
          id: req.body.courseId,
        },
      })
      .then(() => {
        res.status(200).send({
          message: 'course deleted successfully',
        });
      });
  } catch (err) {
    res.status(500).send({
      err,
    });
  }
};

// Add participant Date
exports.addDate = async (req, res) => {
  try {
    const participantId = req.params.id;
    const { dateData } = req.body;
    dateData.participant_id = participantId;
    await dates.create(dateData);
    res.status(200).send({ message: 'Adding date is done' });
  } catch (err) {
    res.status(500).send({
      err,
    });
  }
};

// Get the details for an individual course
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const result = await courses.findAll({
      where: {
        id: courseId,
      },
    });
    if (result[0]) {
      const details = (result[0].dataValues);
      res.status(200).send(details);
    } else {
      res.status(404).send('Error in finding result');
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

// Add new course for special participant
exports.addCourse = async (req, res) => {
  try {
    const participantId = req.params.id;
    const { courseData } = req.body;
    courseData.participant_id = participantId;
    await courses.create(courseData);
    res.status(200).send({ message: 'Adding date is done' });
  } catch (err) {
    res.status(500).send({
      err,
    });
  }
};

// Editing for participant date data
exports.editDate = async (req, res) => {
  try {
    const { dateData } = req.body;
    const { dateId } = req.params;
    await dates.update(dateData, {
      where: {
        id: dateId,
      },
    });
    res.send({ message: 'Editing details was done !' });
  } catch (err) {
    const { msg } = err;
    res.send({ err: msg });
  }
};

// Editing for participant training data
exports.editTraining = async (req, res) => {
  try {
    const { trainingData } = req.body;
    const { courseId } = req.params;
    await courses.update(trainingData, {
      where: {
        id: courseId,
      },
    });
    res.send({ message: 'Editing details was done !' });
  } catch (err) {
    const { msg } = err;
    res.send({ err: msg });
  }
};
