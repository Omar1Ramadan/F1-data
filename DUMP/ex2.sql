-- Create Circuit table
CREATE TABLE Circuit (
    Circuit_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Country VARCHAR(255) NOT NULL
);
DESCRIBE Circuit;

-- Create Driver table
CREATE TABLE Driver (
    Driver_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    DOB DATE NOT NULL,
    DOD DATE,
    Gender VARCHAR(50) NOT NULL,
    Country_of_Birth VARCHAR(255),
    Total_Championships INT DEFAULT 0,
    Total_Race_Entries INT DEFAULT 0,
    Total_Race_Wins INT DEFAULT 0,
    Total_Points INT DEFAULT 0
);
DESCRIBE Driver;

-- Create Constructor table
CREATE TABLE Constructor (
    Constructor_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Country VARCHAR(255) NOT NULL,
    Date_of_First_Debut DATE,
    Total_Championships INT DEFAULT 0,
    Total_Race_Entries INT DEFAULT 0,
    Total_Race_Wins INT DEFAULT 0,
    Total_Points INT DEFAULT 0
);
DESCRIBE Constructor;

-- Create Season table
CREATE TABLE Season (
    Season_ID INT AUTO_INCREMENT PRIMARY KEY,
    Driver_Winner INT,
    Constructor_Winner INT,
    FOREIGN KEY (Driver_Winner) REFERENCES Driver(Driver_ID),
    FOREIGN KEY (Constructor_Winner) REFERENCES Constructor(Constructor_ID)
);
DESCRIBE Season;

-- Create Grand Prix table
CREATE TABLE GrandPrix (
    GrandPrix_ID INT AUTO_INCREMENT PRIMARY KEY,
    Circuit_ID INT NOT NULL,
    Season_ID INT NOT NULL,
    Qual_ID INT,
    Race_ID INT,
    Name VARCHAR(255) NOT NULL,
    Qualifying_Format VARCHAR(50),
    FOREIGN KEY (Circuit_ID) REFERENCES Circuit(Circuit_ID),
    FOREIGN KEY (Season_ID) REFERENCES Season(Season_ID)
);
DESCRIBE GrandPrix;

-- Create Main Race table
CREATE TABLE MainRace (
    Race_ID INT AUTO_INCREMENT PRIMARY KEY,
    GrandPrix_ID INT NOT NULL,
    Date DATE NOT NULL,
    FOREIGN KEY (GrandPrix_ID) REFERENCES GrandPrix(GrandPrix_ID)
);
DESCRIBE MainRace;

-- Create Qualification Race table
CREATE TABLE QualificationRace (
    Qual_ID INT AUTO_INCREMENT PRIMARY KEY,
    GrandPrix_ID INT NOT NULL,
    Date DATE NOT NULL,
    FOREIGN KEY (GrandPrix_ID) REFERENCES GrandPrix(GrandPrix_ID)
);
DESCRIBE QualificationRace;

-- Create Qualifying Result table
CREATE TABLE QualifyingResult (
    QualResult_ID INT AUTO_INCREMENT PRIMARY KEY,
    Driver_ID INT NOT NULL,
    Qual_ID INT NOT NULL,
    Best_Time TIME,
    Gap TIME,
    Position TINYINT,
    FOREIGN KEY (Driver_ID) REFERENCES Driver(Driver_ID),
    FOREIGN KEY (Qual_ID) REFERENCES QualificationRace(Qual_ID)
);
DESCRIBE QualifyingResult;

-- Create Race Result table
CREATE TABLE RaceResult (
    RaceResult_ID INT AUTO_INCREMENT PRIMARY KEY,
    Race_ID INT NOT NULL,
    Driver_ID INT NOT NULL,
    Constructor_ID INT NOT NULL,
    Position TINYINT,
    Points_Gain_Loss TINYINT,
    Total_Pit_Stops TINYINT DEFAULT 0,
    FOREIGN KEY (Race_ID) REFERENCES MainRace(Race_ID),
    FOREIGN KEY (Driver_ID) REFERENCES Driver(Driver_ID),
    FOREIGN KEY (Constructor_ID) REFERENCES Constructor(Constructor_ID)
);
DESCRIBE RaceResult;

-- Create Pit Stop table
CREATE TABLE PitStop (
    PitStop_ID INT AUTO_INCREMENT PRIMARY KEY,
    Race_ID INT NOT NULL,
    Driver_ID INT NOT NULL,
    Lap_Number TINYINT,
    Time_in_Pit TIME(6),
    FOREIGN KEY (Race_ID) REFERENCES MainRace(Race_ID),
    FOREIGN KEY (Driver_ID) REFERENCES Driver(Driver_ID)
);
DESCRIBE PitStop;

-- Create Driver Entry table
CREATE TABLE DriverEntry (
    DriverEntry_ID INT AUTO_INCREMENT PRIMARY KEY,
    Driver_ID INT NOT NULL,
    Constructor_ID INT NOT NULL,
    Season_ID INT NOT NULL,
    Start_Date DATE NOT NULL,
    End_Date DATE,
    Driver_Role VARCHAR(50),
    FOREIGN KEY (Driver_ID) REFERENCES Driver(Driver_ID),
    FOREIGN KEY (Constructor_ID) REFERENCES Constructor(Constructor_ID),
    FOREIGN KEY (Season_ID) REFERENCES Season(Season_ID)
);
DESCRIBE DriverEntry;

DELIMITER //

-- Trigger: Update Driver Stats
CREATE TRIGGER UpdateDriverStats_Insert AFTER INSERT ON RaceResult
FOR EACH ROW
BEGIN
    UPDATE Driver
    SET Total_Race_Entries = (SELECT COUNT(*) FROM RaceResult WHERE Driver_ID = NEW.Driver_ID),
        Total_Race_Wins = (SELECT COUNT(*) FROM RaceResult WHERE Driver_ID = NEW.Driver_ID AND Position = 1),
        Total_Points = (SELECT SUM(Points_Gain_Loss) FROM RaceResult WHERE Driver_ID = NEW.Driver_ID),
        Total_Championships = (SELECT COUNT(*) FROM Season WHERE Driver_Winner = NEW.Driver_ID)
    WHERE Driver_ID = NEW.Driver_ID;
END;

CREATE TRIGGER UpdateDriverStats_Delete AFTER DELETE ON RaceResult
FOR EACH ROW
BEGIN
    UPDATE Driver
    SET Total_Race_Entries = (SELECT COUNT(*) FROM RaceResult WHERE Driver_ID = OLD.Driver_ID),
        Total_Race_Wins = (SELECT COUNT(*) FROM RaceResult WHERE Driver_ID = OLD.Driver_ID AND Position = 1),
        Total_Points = (SELECT SUM(Points_Gain_Loss) FROM RaceResult WHERE Driver_ID = OLD.Driver_ID),
        Total_Championships = (SELECT COUNT(*) FROM Season WHERE Driver_Winner = OLD.Driver_ID)
    WHERE Driver_ID = OLD.Driver_ID;
END;

CREATE TRIGGER UpdateDriverStats_Update AFTER UPDATE ON RaceResult
FOR EACH ROW
BEGIN
    UPDATE Driver
    SET Total_Race_Entries = (SELECT COUNT(*) FROM RaceResult WHERE Driver_ID = NEW.Driver_ID),
        Total_Race_Wins = (SELECT COUNT(*) FROM RaceResult WHERE Driver_ID = NEW.Driver_ID AND Position = 1),
        Total_Points = (SELECT SUM(Points_Gain_Loss) FROM RaceResult WHERE Driver_ID = NEW.Driver_ID),
        Total_Championships = (SELECT COUNT(*) FROM Season WHERE Driver_Winner = NEW.Driver_ID)
    WHERE Driver_ID = NEW.Driver_ID;
END;

-- Trigger: Update Constructor Stats
CREATE TRIGGER UpdateConstructorStats_Insert AFTER INSERT ON RaceResult
FOR EACH ROW
BEGIN
    UPDATE Constructor
    SET Total_Race_Entries = (SELECT COUNT(*) FROM RaceResult WHERE Constructor_ID = NEW.Constructor_ID),
        Total_Race_Wins = (SELECT COUNT(*) FROM RaceResult WHERE Constructor_ID = NEW.Constructor_ID AND Position = 1),
        Total_Points = (SELECT SUM(Points_Gain_Loss) FROM RaceResult WHERE Constructor_ID = NEW.Constructor_ID),
        Total_Championships = (SELECT COUNT(*) FROM Season WHERE Constructor_Winner = NEW.Constructor_ID),
        Date_of_First_Debut = (SELECT MIN(Start_Date) FROM DriverEntry WHERE Constructor_ID = NEW.Constructor_ID)
    WHERE Constructor_ID = NEW.Constructor_ID;
END;

CREATE TRIGGER UpdateConstructorStats_Delete AFTER DELETE ON RaceResult
FOR EACH ROW
BEGIN
    UPDATE Constructor
    SET Total_Race_Entries = (SELECT COUNT(*) FROM RaceResult WHERE Constructor_ID = OLD.Constructor_ID),
        Total_Race_Wins = (SELECT COUNT(*) FROM RaceResult WHERE Constructor_ID = OLD.Constructor_ID AND Position = 1),
        Total_Points = (SELECT SUM(Points_Gain_Loss) FROM RaceResult WHERE Constructor_ID = OLD.Constructor_ID),
        Total_Championships = (SELECT COUNT(*) FROM Season WHERE Constructor_Winner = OLD.Constructor_ID),
        Date_of_First_Debut = (SELECT MIN(Start_Date) FROM DriverEntry WHERE Constructor_ID = OLD.Constructor_ID)
    WHERE Constructor_ID = OLD.Constructor_ID;
END;

CREATE TRIGGER UpdateConstructorStats_Update AFTER UPDATE ON RaceResult
FOR EACH ROW
BEGIN
    UPDATE Constructor
    SET Total_Race_Entries = (SELECT COUNT(*) FROM RaceResult WHERE Constructor_ID = NEW.Constructor_ID),
        Total_Race_Wins = (SELECT COUNT(*) FROM RaceResult WHERE Constructor_ID = NEW.Constructor_ID AND Position = 1),
        Total_Points = (SELECT SUM(Points_Gain_Loss) FROM RaceResult WHERE Constructor_ID = NEW.Constructor_ID),
        Total_Championships = (SELECT COUNT(*) FROM Season WHERE Constructor_Winner = NEW.Constructor_ID),
        Date_of_First_Debut = (SELECT MIN(Start_Date) FROM DriverEntry WHERE Constructor_ID = NEW.Constructor_ID)
    WHERE Constructor_ID = NEW.Constructor_ID;
END;

-- Trigger: Update Race Result Pit Stops
CREATE TRIGGER UpdateRaceResultPitStops_Insert AFTER INSERT ON PitStop
FOR EACH ROW
BEGIN
    UPDATE RaceResult
    SET Total_Pit_Stops = (SELECT COUNT(*) FROM PitStop WHERE Race_ID = NEW.Race_ID AND Driver_ID = NEW.Driver_ID)
    WHERE Race_ID = NEW.Race_ID AND Driver_ID = NEW.Driver_ID;
END;

CREATE TRIGGER UpdateRaceResultPitStops_Delete AFTER DELETE ON PitStop
FOR EACH ROW
BEGIN
    UPDATE RaceResult
    SET Total_Pit_Stops = (SELECT COUNT(*) FROM PitStop WHERE Race_ID = OLD.Race_ID AND Driver_ID = OLD.Driver_ID)
    WHERE Race_ID = OLD.Race_ID AND Driver_ID = OLD.Driver_ID;
END;

CREATE TRIGGER UpdateRaceResultPitStops_Update AFTER UPDATE ON PitStop
FOR EACH ROW
BEGIN
    UPDATE RaceResult
    SET Total_Pit_Stops = (SELECT COUNT(*) FROM PitStop WHERE Race_ID = NEW.Race_ID AND Driver_ID = NEW.Driver_ID)
    WHERE Race_ID = NEW.Race_ID AND Driver_ID = NEW.Driver_ID;
END;

-- Trigger: Update Season Winners on INSERT
CREATE TRIGGER UpdateSeasonWinners_Insert AFTER INSERT ON RaceResult
FOR EACH ROW
BEGIN
    -- Update Driver Winner
    UPDATE Season
    SET Driver_Winner = (
        SELECT Driver_ID
        FROM RaceResult rr
        JOIN MainRace mr ON rr.Race_ID = mr.Race_ID
        JOIN GrandPrix gp ON mr.GrandPrix_ID = gp.GrandPrix_ID
        WHERE gp.Season_ID = (SELECT gp.Season_ID
                              FROM MainRace mr
                              JOIN GrandPrix gp ON mr.GrandPrix_ID = gp.GrandPrix_ID
                              WHERE mr.Race_ID = NEW.Race_ID)
        GROUP BY Driver_ID
        ORDER BY SUM(rr.Points_Gain_Loss) DESC
        LIMIT 1
    )
    WHERE Season_ID = (SELECT gp.Season_ID
                       FROM MainRace mr
                       JOIN GrandPrix gp ON mr.GrandPrix_ID = gp.GrandPrix_ID
                       WHERE mr.Race_ID = NEW.Race_ID);

    -- Update Constructor Winner
    UPDATE Season
    SET Constructor_Winner = (
        SELECT Constructor_ID
        FROM RaceResult rr
        JOIN MainRace mr ON rr.Race_ID = mr.Race_ID
        JOIN GrandPrix gp ON mr.GrandPrix_ID = gp.GrandPrix_ID
        WHERE gp.Season_ID = (SELECT gp.Season_ID
                              FROM MainRace mr
                              JOIN GrandPrix gp ON mr.GrandPrix_ID = gp.GrandPrix_ID
                              WHERE mr.Race_ID = NEW.Race_ID)
        GROUP BY Constructor_ID
        ORDER BY SUM(rr.Points_Gain_Loss) DESC
        LIMIT 1
    )
    WHERE Season_ID = (SELECT gp.Season_ID
                       FROM MainRace mr
                       JOIN GrandPrix gp ON mr.GrandPrix_ID = gp.GrandPrix_ID
                       WHERE mr.Race_ID = NEW.Race_ID);
END;
//

-- Trigger: Update Season Winners on DELETE
CREATE TRIGGER UpdateSeasonWinners_Delete AFTER DELETE ON RaceResult
FOR EACH ROW
BEGIN
    -- Update Driver Winner
    UPDATE Season
    SET Driver_Winner = (
        SELECT Driver_ID
        FROM RaceResult rr
        JOIN MainRace mr ON rr.Race_ID = mr.Race_ID
        JOIN GrandPrix gp ON mr.GrandPrix_ID = gp.GrandPrix_ID
        WHERE gp.Season_ID = (SELECT gp.Season_ID
                              FROM MainRace mr
                              JOIN GrandPrix gp ON mr.GrandPrix_ID = gp.GrandPrix_ID
                              WHERE mr.Race_ID = OLD.Race_ID)
        GROUP BY Driver_ID
        ORDER BY SUM(rr.Points_Gain_Loss) DESC
        LIMIT 1
    )
    WHERE Season_ID = (SELECT gp.Season_ID
                       FROM MainRace mr
                       JOIN GrandPrix gp ON mr.GrandPrix_ID = gp.GrandPrix_ID
                       WHERE mr.Race_ID = OLD.Race_ID);

    -- Update Constructor Winner
    UPDATE Season
    SET Constructor_Winner = (
        SELECT Constructor_ID
        FROM RaceResult rr
        JOIN MainRace mr ON rr.Race_ID = mr.Race_ID
        JOIN GrandPrix gp ON mr.GrandPrix_ID = gp.GrandPrix_ID
        WHERE gp.Season_ID = (SELECT gp.Season_ID
                              FROM MainRace mr
                              JOIN GrandPrix gp ON mr.GrandPrix_ID = gp.GrandPrix_ID
                              WHERE mr.Race_ID = OLD.Race_ID)
        GROUP BY Constructor_ID
        ORDER BY SUM(rr.Points_Gain_Loss) DESC
        LIMIT 1
    )
    WHERE Season_ID = (SELECT gp.Season_ID
                       FROM MainRace mr
                       JOIN GrandPrix gp ON mr.GrandPrix_ID = gp.GrandPrix_ID
                       WHERE mr.Race_ID = OLD.Race_ID);
END;
//

-- Trigger: Update Season Winners on UPDATE
CREATE TRIGGER UpdateSeasonWinners_Update AFTER UPDATE ON RaceResult
FOR EACH ROW
BEGIN
    -- Update Driver Winner
    UPDATE Season
    SET Driver_Winner = (
        SELECT Driver_ID
        FROM RaceResult rr
        JOIN MainRace mr ON rr.Race_ID = mr.Race_ID
        JOIN GrandPrix gp ON mr.GrandPrix_ID = gp.GrandPrix_ID
        WHERE gp.Season_ID = (SELECT gp.Season_ID
                              FROM MainRace mr
                              JOIN GrandPrix gp ON mr.GrandPrix_ID = gp.GrandPrix_ID
                              WHERE mr.Race_ID = NEW.Race_ID)
        GROUP BY Driver_ID
        ORDER BY SUM(rr.Points_Gain_Loss) DESC
        LIMIT 1
    )
    WHERE Season_ID = (SELECT gp.Season_ID
                       FROM MainRace mr
                       JOIN GrandPrix gp ON mr.GrandPrix_ID = gp.GrandPrix_ID
                       WHERE mr.Race_ID = NEW.Race_ID);

    -- Update Constructor Winner
    UPDATE Season
    SET Constructor_Winner = (
        SELECT Constructor_ID
        FROM RaceResult rr
        JOIN MainRace mr ON rr.Race_ID = mr.Race_ID
        JOIN GrandPrix gp ON mr.GrandPrix_ID = gp.GrandPrix_ID
        WHERE gp.Season_ID = (SELECT gp.Season_ID
                              FROM MainRace mr
                              JOIN GrandPrix gp ON mr.GrandPrix_ID = gp.GrandPrix_ID
                              WHERE mr.Race_ID = NEW.Race_ID)
        GROUP BY Constructor_ID
        ORDER BY SUM(rr.Points_Gain_Loss) DESC
        LIMIT 1
    )
    WHERE Season_ID = (SELECT gp.Season_ID
                       FROM MainRace mr
                       JOIN GrandPrix gp ON mr.GrandPrix_ID = gp.GrandPrix_ID
                       WHERE mr.Race_ID = NEW.Race_ID);
END;
//
DELIMITER ;

-- Display all tables in the database
SHOW TABLES;

-- Display all triggers names in the database
SELECT TRIGGER_NAME
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = 'f1db';

