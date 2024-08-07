const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const { Sequelize } = require('sequelize');
const ProgramStudi = require('./models/ProgramStudi');

const app = express();
const port = 3000;

const client = redis.createClient();

client.on('connect', () => {
  console.log('Connected to Redis...');
});

client.on('error', (err) => {
  console.error('Redis error: ', err);
});

app.use(bodyParser.json());

app.get('/programs', async (req, res) => {
  client.get('programs', async (err, programs) => {
    if (programs) {
      res.json(JSON.parse(programs));
    } else {
      const programs = await ProgramStudi.findAll();
      client.setex('programs', 3600, JSON.stringify(programs)); // Cache for 1 hour
      res.json(programs);
    }
  });
});

app.post('/programs', async (req, res) => {
  const t = await ProgramStudi.sequelize.transaction();
  try {
    const newProgram = await ProgramStudi.create(req.body, { transaction: t });
    await t.commit();
    client.del('programs'); // Invalidate cache
    res.json(newProgram);
  } catch (error) {
    await t.rollback();
    res.status(500).send(error);
  }
});

app.put('/programs/:id', async (req, res) => {
  const t = await ProgramStudi.sequelize.transaction();
  try {
    const program = await ProgramStudi.findByPk(req.params.id);
    if (program) {
      await program.update(req.body, { transaction: t });
      await t.commit();
      client.del('programs'); // Invalidate cache
      res.json(program);
    } else {
      res.status(404).send('Program not found');
    }
  } catch (error) {
    await t.rollback();
    res.status(500).send(error);
  }
});

app.delete('/programs/:id', async (req, res) => {
  const t = await ProgramStudi.sequelize.transaction();
  try {
    const program = await ProgramStudi.findByPk(req.params.id);
    if (program) {
      await program.destroy({ transaction: t });
      await t.commit();
      client.del('programs'); // Invalidate cache
      res.send('Program deleted');
    } else {
      res.status(404).send('Program not found');
    }
  } catch (error) {
    await t.rollback();
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
