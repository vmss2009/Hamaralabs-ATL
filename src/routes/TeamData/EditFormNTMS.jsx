import React from "react";

function NonTeamLeadersSelect(props) {
    function handleChange(event) {
        const temp = [...props.teamMems];
        temp[props.index] = event.target.value;
        props.setTeamMems(temp);
    }
    
    {/* Nageswar */}
    // Sort the students array by name in a case-insensitive manner//Nageswar
    const sortedStudents = [...props.students].sort((a, b) =>
        `${a.name.firstName} ${a.name.lastName}`.localeCompare(`${b.name.firstName} ${b.name.lastName}`, undefined, {
            sensitivity: 'base'
        })
    );

    return (
        <div id={props.index}>
            <select onChange={handleChange} value={props.teamMems[props.index]}>
                <option>--- SELECT ---</option>
                
                {sortedStudents.map((student, index) => (
                    <option key={index} value={student.docId}>
                        {`${student.name.firstName} ${student.name.lastName}`}
                    </option>
                ))}
                {/* Nageswar */}
            </select>
            <br />
            <br />
        </div>
    );
}

export default NonTeamLeadersSelect;
