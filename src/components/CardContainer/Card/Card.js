import React from "react";

function CardSkill(props) {
    return <li>Lv{props.skill.level}: {props.skill.name}</li>
}

function Card(props) {
    const skillList = props.card.skills.map((skill) =>
        <CardSkill key={skill.id} skill={skill} />
    );

    return (
        <div>
            <p>{props.card.name}</p>
            <p>{props.card.faction}</p>
            <p>{props.card.health[props.statDisplayLevel]}</p>
            <p>{props.card.attack[props.statDisplayLevel]}</p>
            <p>Skills:</p>
            <ul>{skillList}</ul>
        </div>
    );
}