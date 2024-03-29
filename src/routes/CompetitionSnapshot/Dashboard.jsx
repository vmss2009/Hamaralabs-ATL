import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firestore";
import Sidebar from "../../components/Sidebar";
import { collection, onSnapshot, getDocs } from "firebase/firestore";

function CompetitionsSnapshot() {
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState("");
  const [competitionReports, setCompetitionReports] = useState([]);
  const [studentsInCompetition, setStudentsInCompetition] = useState([]);
  const [displayValue, setDisplayValue] = useState("none");
  const [schools, setSchools] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [citySchools, setCitySchools] = useState([]);

  function resetSearch() {
    setSelectedCompetition("");
    setCompetitionReports([]);
    setSelectedState("");
    setSelectedCity("");
    setSelectedSchool("");
    setCitySchools([]);
  }

  function handleMouseOver(event) {
    setDisplayValue("block");
  }

  function handleMouseOut(event) {
    setDisplayValue("none");
  }

  useEffect(() => {
    const competitionsRef = collection(db, "competitionData");
    const unsubscribe = onSnapshot(competitionsRef, (snapshot) => {
      const competitionData = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        competitionData.push(data);
      });
      setCompetitions(competitionData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (selectedState) {
      const filteredStudents = studentsInCompetition.filter((student) => {
        const studentSchool = schools.find((school) => school.name === student.school);
        return (
          (!selectedState || studentSchool.address.state === selectedState) &&
          (!selectedCity || studentSchool.address.city === selectedCity) &&
          (!selectedSchool || student.school === selectedSchool)
        );
      });

      setFilteredStudents(filteredStudents);
    } else {
      setFilteredStudents(studentsInCompetition);
    }
  }, [selectedState, selectedCity, selectedSchool, studentsInCompetition]);

  useEffect(() => {
    const schoolsRef = collection(db, "schoolData");

    getDocs(schoolsRef)
      .then((querySnapshot) => {
        const schoolData = [];
        const stateSet = new Set();
        const citySet = new Set();
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          schoolData.push(data);
          stateSet.add(data.address.state);
          citySet.add(data.address.city);
        });
        console.log(schoolData);
        setSchools(schoolData);
        setStates(Array.from(stateSet));
        setCities(Array.from(citySet));
      })
      .catch((error) => {
        console.error("Error fetching schools:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedCompetition) {
      const competitionReportsRef = collection(
        db,
        "competitionData",
        selectedCompetition,
        "reports"
      );

      const unsubscribe = onSnapshot(competitionReportsRef, (snapshot) => {
        const reportsData = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          reportsData.push(data);
        });
        setCompetitionReports(reportsData);
      });

      return () => {
        unsubscribe();
      };
    } else {
      setCompetitionReports([]);
    }
  }, [selectedCompetition]);

  useEffect(() => {
    if (selectedCompetition) {
      const studentsRef = collection(db, "studentData");
      onSnapshot(studentsRef, (snapshot) => {
        const studentsData = [];
        snapshot.forEach((snapshotData) => {
          const studentRef = collection(db, "studentData", snapshotData.id, "competitionData");
          onSnapshot(studentRef, (studentCompetitionSnapshots) => {
            studentCompetitionSnapshots.forEach((studentCompetitionSnapshot) => {
              if (studentCompetitionSnapshot.id === selectedCompetition) {
                const data = snapshotData.data();
                data.id = snapshotData.id;
                studentsData.push(data);
                setStudentsInCompetition(studentsData);
              }
            });
          })
        });
      });
    } else {
      setStudentsInCompetition([]);
    }
  }, [selectedCompetition]);

  useEffect(() => {
    if (selectedCity) {
      const cityFilteredSchools = schools
        .filter((school) => school.address.city === selectedCity)
        .map((school) => school.name);
      setCitySchools(cityFilteredSchools);
    } else {
      setCitySchools([]);
    }
  }, [selectedCity, schools]);

  function handleOnChange(event) {
    const { name, value } = event.target;

    if (name === "competitionSelect") {
      setSelectedCompetition(value);
      setSelectedState("");
      setSelectedCity("");
      setSelectedSchool("");
      setCitySchools([]);
    } else if (name === "stateSelect") {
      setSelectedState(value);
      setSelectedCity("");
      setSelectedSchool("");
      setCitySchools([]);
    } else if (name === "citySelect") {
      setSelectedCity(value);
      setSelectedSchool("");
      setCitySchools([]);
    } else if (name === "schoolSelect") {
      setSelectedSchool(value);
    }
  }

  const competitionOptions = competitions.map((competition) => (
    <option key={competition.id} value={competition.id}>
      {competition.name}
    </option>
  ));

  const studentsInCompetitionList = filteredStudents.map((student) => {
    const studentSchool = schools.find((school) => school.name === student.school);

    return (
      <div key={student.id}>
        <div className="box" style={{ paddingTop: "0" }} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
          <div className="boxContainer">
            <span style={{ fontWeight: "600" }}>Student Name: </span>
            {student.name.firstName} {student.name.lastName}
          </div>
          <br />
          <div className="boxContainer">
            <span style={{ fontWeight: "600" }}>School: </span> {student.school}
          </div>
          <br />
          <div className="boxContainer">
            <span style={{ fontWeight: "600" }}>City: </span>{" "}
            {studentSchool ? studentSchool.address.city : "Unknown"}
          </div>
          <br />
          <div className="boxContainer">
            <span style={{ fontWeight: "600" }}>State: </span>{" "}
            {studentSchool ? studentSchool.address.state : "Unknown"}
          </div>
          <br />
        </div>
      </div>
    );
  });

  const competitionReportsList = competitionReports.map((report) => (
    <div key={report.id}>
      <p>Report ID: {report.id}</p>
      <p>Report Data: {JSON.stringify(report)}</p>
    </div>
  ));

  function StateFilter({
    selectedState,
    states,
    selectedCity,
    cities,
    setSelectedState,
    setSelectedCity,
    studentsInCompetition,
    selectedCompetition,
  }) {
    // Filter students by state
    const filteredByState = studentsInCompetition.filter((student) => {
      const studentSchool = student.school;
      const schoolData = schools.find((school) => school.name === studentSchool);
      return schoolData && schoolData.address.state === selectedState;
    });

    // Get unique cities within the selected state
    const uniqueCities = new Set(filteredByState.map((student) => {
      const studentSchool = student.school;
      const schoolData = schools.find((school) => school.name === studentSchool);
      return schoolData ? schoolData.address.city : null;
    }));

    const filteredCities = Array.from(uniqueCities);

    // Update the selected city if it's not part of the filtered cities
    if (!filteredCities.includes(selectedCity)) {
      setSelectedCity("");
    }

    // Filter the states based on the selected competition's students
    const competitionStates = new Set(studentsInCompetition.map((student) => {
      const studentSchool = student.school;
      const schoolData = schools.find((school) => school.name === studentSchool);
      return schoolData ? schoolData.address.state : null;
    }));

    const filteredStates = Array.from(competitionStates);

    return (
      <div className="boxContainer">
        <label htmlFor="stateSelect">State: </label>
        <select
          name="stateSelect"
          id="stateSelect"
          onChange={(event) => setSelectedState(event.target.value)}
          value={selectedState}
        >
          <option value="" disabled={true}>
            Select State
          </option>
          {filteredStates.map((state, index) => (
            <option key={index} value={state}>
              {state}
            </option>
          ))}
        </select>

        <label htmlFor="citySelect">City: </label>
        <select
          name="citySelect"
          id="citySelect"
          onChange={(event) => setSelectedCity(event.target.value)}
          value={selectedCity}
        >
          <option value="" disabled={true}>
            Select City
          </option>
          {filteredCities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
    );
  }


  function SchoolFilter({
    selectedSchool,
    citySchools,
    setSelectedSchool,
  }) {
    return (
      <div className="boxContainer">
        <label htmlFor="schoolSelect">School: </label>
        <select
          name="schoolSelect"
          id="schoolSelect"
          onChange={(event) => setSelectedSchool(event.target.value)}
          value={selectedSchool}
        >
          <option value="" disabled={true}>
            Select School
          </option>
          {citySchools.map((school, index) => (
            <option key={index} value={school}>
              {school}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="container">
      <Sidebar />
      <link rel="stylesheet" href="/CSS/form.css" />
      <link rel="stylesheet" href="/CSS/report.css" />
      <div style={{ height: "10vh" }}>
        <h1 className="title">Competition Snapshot | Digital ATL</h1>
        <hr />
        <div className="boxContainer">
          <label htmlFor="competitionSelect">Competition: </label>
          <select
            name="competitionSelect"
            id="competitionSelect"
            onChange={handleOnChange}
            value={selectedCompetition}
          >
            <option value="" disabled={true}>
              SELECT
            </option>
            {competitionOptions}
          </select>

          <StateFilter
            selectedState={selectedState}
            states={states}
            selectedCity={selectedCity}
            cities={cities}
            setSelectedState={setSelectedState}
            setSelectedCity={setSelectedCity}
            studentsInCompetition={studentsInCompetition}
            selectedCompetition={selectedCompetition}
          />
          <SchoolFilter
            selectedSchool={selectedSchool}
            citySchools={citySchools}
            setSelectedSchool={setSelectedSchool}
          />
          <button className="resetbutton" onClick={resetSearch}>
            Clear Search
          </button>
        </div>
        <hr />
        <div>{studentsInCompetitionList}</div>
        <hr />
        <div>{competitionReportsList}</div>
      </div>
    </div>
  );
}

export default CompetitionsSnapshot;
