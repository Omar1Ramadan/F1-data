const request = require('supertest');
const app = require('./server');
const db = require('./db');

beforeAll(done => {
  db.query('SET FOREIGN_KEY_CHECKS = 0', done);
});

afterAll(done => {
  db.query('SET FOREIGN_KEY_CHECKS = 1', done);
  db.end();
});

describe('CRUD operations for Circuit', () => {
  let circuitId;

  it('should create a new circuit', async () => {
    const res = await request(app)
      .post('/circuit')
      .send({
        Name: 'Silverstone Circuit',
        Country: 'UK'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('insertId');
    circuitId = res.body.insertId;
  });

  it('should retrieve the created circuit', async () => {
    const res = await request(app).get(`/circuit?Circuit_ID=${circuitId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('Name', 'Silverstone Circuit');
  });

  it('should update the circuit', async () => {
    const res = await request(app)
      .put('/circuit')
      .send({
        Circuit_ID: circuitId,
        Name: 'Updated Silverstone Circuit',
        Country: 'UK'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Circuit updated successfully');
  });

  it('should delete the circuit', async () => {
    const res = await request(app)
      .delete('/circuit')
      .send({ Circuit_ID: circuitId });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Circuit deleted successfully');
  });
});

describe('CRUD operations for Driver', () => {
  let driverId;

  it('should create a new driver', async () => {
    const res = await request(app)
      .post('/driver')
      .send({
        Name: 'Lewis Hamilton',
        DOB: '1985-01-07',
        Gender: 'Male',
        Country_of_Birth: 'UK'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('insertId');
    driverId = res.body.insertId;
  });

  it('should retrieve the created driver', async () => {
    const res = await request(app).get(`/driver?Driver_ID=${driverId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('Name', 'Lewis Hamilton');
  });

  it('should update the driver', async () => {
    const res = await request(app)
      .put('/driver')
      .send({
        Driver_ID: driverId,
        Name: 'Updated Lewis Hamilton',
        DOB: '1985-01-07',
        Gender: 'Male',
        Country_of_Birth: 'UK'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Driver updated successfully');
  });

  it('should delete the driver', async () => {
    const res = await request(app)
      .delete('/driver')
      .send({ Driver_ID: driverId });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Driver deleted successfully');
  });
});

describe('CRUD operations for Constructor', () => {
  let constructorId;

  it('should create a new constructor', async () => {
    const res = await request(app)
      .post('/constructor')
      .send({
        Name: 'Mercedes',
        Country: 'Germany'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('insertId');
    constructorId = res.body.insertId;
  });

  it('should retrieve the created constructor', async () => {
    const res = await request(app).get(`/constructor?Constructor_ID=${constructorId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('Name', 'Mercedes');
  });

  it('should update the constructor', async () => {
    const res = await request(app)
      .put('/constructor')
      .send({
        Constructor_ID: constructorId,
        Name: 'Updated Mercedes',
        Country: 'Germany'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Constructor updated successfully');
  });

  it('should delete the constructor', async () => {
    const res = await request(app)
      .delete('/constructor')
      .send({ Constructor_ID: constructorId });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Constructor deleted successfully');
  });
});

describe('CRUD operations for Season', () => {
  let seasonId;

  it('should create a new season', async () => {
    const res = await request(app)
      .post('/season')
      .send({
        Driver_Winner: 1,
        Constructor_Winner: 1
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('insertId');
    seasonId = res.body.insertId;
  });

  it('should retrieve the created season', async () => {
    const res = await request(app).get(`/season?Season_ID=${seasonId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('Driver_Winner', 1);
  });

  it('should update the season', async () => {
    const res = await request(app)
      .put('/season')
      .send({
        Season_ID: seasonId,
        Driver_Winner: 2,
        Constructor_Winner: 2
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Season updated successfully');
  });

  it('should delete the season', async () => {
    const res = await request(app)
      .delete('/season')
      .send({ Season_ID: seasonId });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Season deleted successfully');
  });
});

describe('CRUD operations for GrandPrix', () => {
  let grandPrixId;

  it('should create a new grand prix', async () => {
    const res = await request(app)
      .post('/grandprix')
      .send({
        Circuit_ID: 1,
        Season_ID: 1,
        Name: 'British Grand Prix',
        Qualifying_Format: 'Q1-Q2-Q3'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('insertId');
    grandPrixId = res.body.insertId;
  });

  it('should retrieve the created grand prix', async () => {
    const res = await request(app).get(`/grandprix?GrandPrix_ID=${grandPrixId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('Name', 'British Grand Prix');
  });

  it('should update the grand prix', async () => {
    const res = await request(app)
      .put('/grandprix')
      .send({
        GrandPrix_ID: grandPrixId,
        Circuit_ID: 1,
        Season_ID: 1,
        Name: 'Updated British Grand Prix',
        Qualifying_Format: 'Q1-Q2-Q3'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('GrandPrix updated successfully');
  });

  it('should delete the grand prix', async () => {
    const res = await request(app)
      .delete('/grandprix')
      .send({ GrandPrix_ID: grandPrixId });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('GrandPrix deleted successfully');
  });
});

describe('CRUD operations for MainRace', () => {
  let mainRaceId;

  it('should create a new main race', async () => {
    const res = await request(app)
      .post('/mainrace')
      .send({
        GrandPrix_ID: 1,
        Date: '2023-07-16'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('insertId');
    mainRaceId = res.body.insertId;
  });

  it('should retrieve the created main race', async () => {
    const res = await request(app).get(`/mainrace?Race_ID=${mainRaceId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('Date', '2023-07-16');
  });

  it('should update the main race', async () => {
    const res = await request(app)
      .put('/mainrace')
      .send({
        Race_ID: mainRaceId,
        GrandPrix_ID: 1,
        Date: '2023-07-17'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('MainRace updated successfully');
  });

  it('should delete the main race', async () => {
    const res = await request(app)
      .delete('/mainrace')
      .send({ Race_ID: mainRaceId });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('MainRace deleted successfully');
  });
});

describe('CRUD operations for QualificationRace', () => {
  let qualificationRaceId;

  it('should create a new qualification race', async () => {
    const res = await request(app)
      .post('/qualificationrace')
      .send({
        GrandPrix_ID: 1,
        Date: '2023-07-15'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('insertId');
    qualificationRaceId = res.body.insertId;
  });

  it('should retrieve the created qualification race', async () => {
    const res = await request(app).get(`/qualificationrace?Qual_ID=${qualificationRaceId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('Date', '2023-07-15');
  });

  it('should update the qualification race', async () => {
    const res = await request(app)
      .put('/qualificationrace')
      .send({
        Qual_ID: qualificationRaceId,
        GrandPrix_ID: 1,
        Date: '2023-07-16'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('QualificationRace updated successfully');
  });

  it('should delete the qualification race', async () => {
    const res = await request(app)
      .delete('/qualificationrace')
      .send({ Qual_ID: qualificationRaceId });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('QualificationRace deleted successfully');
  });
});

describe('CRUD operations for QualifyingResult', () => {
  let qualifyingResultId;

  it('should create a new qualifying result', async () => {
    const res = await request(app)
      .post('/qualifyingresult')
      .send({
        Driver_ID: 1,
        Qual_ID: 1,
        Best_Time: '00:01:30',
        Gap: '00:00:01',
        Position: 1
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('insertId');
    qualifyingResultId = res.body.insertId;
  });

  it('should retrieve the created qualifying result', async () => {
    const res = await request(app).get(`/qualifyingresult?QualResult_ID=${qualifyingResultId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('Position', 1);
  });

  it('should update the qualifying result', async () => {
    const res = await request(app)
      .put('/qualifyingresult')
      .send({
        QualResult_ID: qualifyingResultId,
        Driver_ID: 1,
        Qual_ID: 1,
        Best_Time: '00:01:29',
        Gap: '00:00:00',
        Position: 1
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('QualifyingResult updated successfully');
  });

  it('should delete the qualifying result', async () => {
    const res = await request(app)
      .delete('/qualifyingresult')
      .send({ QualResult_ID: qualifyingResultId });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('QualifyingResult deleted successfully');
  });
});

describe('CRUD operations for RaceResult', () => {
  let raceResultId;

  it('should create a new race result', async () => {
    const res = await request(app)
      .post('/raceresult')
      .send({
        Race_ID: 1,
        Driver_ID: 1,
        Constructor_ID: 1,
        Position: 1,
        Points_Gain_Loss: 25
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('insertId');
    raceResultId = res.body.insertId;
  });

  it('should retrieve the created race result', async () => {
    const res = await request(app).get(`/raceresult?RaceResult_ID=${raceResultId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('Position', 1);
  });

  it('should update the race result', async () => {
    const res = await request(app)
      .put('/raceresult')
      .send({
        RaceResult_ID: raceResultId,
        Race_ID: 1,
        Driver_ID: 1,
        Constructor_ID: 1,
        Position: 2,
        Points_Gain_Loss: 18
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('RaceResult updated successfully');
  });

  it('should delete the race result', async () => {
    const res = await request(app)
      .delete('/raceresult')
      .send({ RaceResult_ID: raceResultId });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('RaceResult deleted successfully');
  });
});

describe('CRUD operations for PitStop', () => {
  let pitStopId;

  it('should create a new pit stop', async () => {
    const res = await request(app)
      .post('/pitstop')
      .send({
        Race_ID: 1,
        Driver_ID: 1,
        Lap_Number: 10,
        Time_in_Pit: '00:00:30'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('insertId');
    pitStopId = res.body.insertId;
  });

  it('should retrieve the created pit stop', async () => {
    const res = await request(app).get(`/pitstop?PitStop_ID=${pitStopId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('Lap_Number', 10);
  });

  it('should update the pit stop', async () => {
    const res = await request(app)
      .put('/pitstop')
      .send({
        PitStop_ID: pitStopId,
        Race_ID: 1,
        Driver_ID: 1,
        Lap_Number: 11,
        Time_in_Pit: '00:00:29'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('PitStop updated successfully');
  });

  it('should delete the pit stop', async () => {
    const res = await request(app)
      .delete('/pitstop')
      .send({ PitStop_ID: pitStopId });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('PitStop deleted successfully');
  });
});

describe('CRUD operations for DriverEntry', () => {
  let driverEntryId;

  it('should create a new driver entry', async () => {
    const res = await request(app)
      .post('/driverentry')
      .send({
        Driver_ID: 1,
        Constructor_ID: 1,
        Season_ID: 1,
        Start_Date: '2023-01-01',
        Driver_Role: 'Primary'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('insertId');
    driverEntryId = res.body.insertId;
  });

  it('should retrieve the created driver entry', async () => {
    const res = await request(app).get(`/driverentry?DriverEntry_ID=${driverEntryId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('Driver_Role', 'Primary');
  });

  it('should update the driver entry', async () => {
    const res = await request(app)
      .put('/driverentry')
      .send({
        DriverEntry_ID: driverEntryId,
        Driver_ID: 1,
        Constructor_ID: 1,
        Season_ID: 1,
        Start_Date: '2023-01-01',
        End_Date: '2023-12-31',
        Driver_Role: 'Secondary'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('DriverEntry updated successfully');
  });

  it('should delete the driver entry', async () => {
    const res = await request(app)
      .delete('/driverentry')
      .send({ DriverEntry_ID: driverEntryId });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('DriverEntry deleted successfully');
  });
});