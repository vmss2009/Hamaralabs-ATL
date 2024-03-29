import React from "react";

function TeamLeadersSelect(props) {
    function handleChange(event) {
        const temp = props.teamMems;
        temp[props.index] = event.target.value;
        props.setTeamMems(temp); // Update the team members state with sorted values
        console.log(temp);
    }

    ///Below code shows students members without team leaders
    // Sort the students based on their names (first name + last name)
    // const sortedStudents = props.students
    //     .filter((student) => !student.isTeamLeader)
    //     .sort((a, b) => {
    //         const nameA = `${a.name.firstName} ${a.name.lastName}`.toLowerCase();
    //         const nameB = `${b.name.firstName} ${b.name.lastName}`.toLowerCase();
    //         return nameA.localeCompare(nameB);
    //     });

    // Nageswar--Modified
    const allStudents = [...props.students];
    const sortedStudents = allStudents.sort((a, b) => {
        const nameA = `${a.name.firstName} ${a.name.lastName}`.toLowerCase();
        const nameB = `${b.name.firstName} ${b.name.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
    });

     // Nageswar--Modified

    return (
        <div id={props.index}>
            <select onChange={handleChange}>
                <option selected={true} disabled={true}>--- SELECT ---</option>
                {
                    sortedStudents.map((student, index) => (
                        <option key={index} value={student.docId}>{`${student.name.firstName} ${student.name.lastName}`}</option>
                    ))
                }
            </select>
            <br/>
            <br/>
        </div>
    );
}

export default TeamLeadersSelect;