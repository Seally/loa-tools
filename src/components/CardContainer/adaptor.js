import * as $ from "jquery";
import * as _ from "underscore";

/**
 * Transforms a skill from the original JSON's format into the format this app
 * uses.
 * @param jsonSkill
 * @returns {{id: number, name: *|string, description: *}}
 */
function adaptSkill(jsonSkill) {
    return {
        id: parseInt(jsonSkill.SkillId),
        name: jsonSkill.Name,
        description: jsonSkill.Desc
    };
}

function extractIdsFromString(idsString) {
    return idsString.split('_').map(idString => parseInt(idString));
}

function extractSkillsFromString(skillIdsString, skills) {
    if(typeof jsonCard.Skill === 'string') {
        return extractIdsFromString(skillIdsString).map(id => skills[id]);
    }

    return [ parseInt(skillIdsString) ];
}

function verifySkillsArray(skillsArray) {
    let idList = {};

    skillsArray.forEach((skill) => {
        if(skill.SkillId in idList) {
            throw new Error('Duplicate IDs detected in skills.json.');
        }

        idList[skill.SkillId] = true;
    });
}

function verifyCardsArray(cardsArray) {
    let idList = {};

    cardsArray.forEach((card) => {
        if(card.CardId in idList) {
            throw new Error('Duplicate IDs detected in cards.json.');
        }

        idList[card.CardId] = true;
    });
}

function adaptCard(srcCard, skills) {
    let card = {};

    card.id = parseInt(srcCard.CardId);
    card.name = srcCard.CardName;
    card.factionId = srcCard.Race;
    card.starLevel = srcCard.Color;
    card.healthAtLevel = srcCard.HpArray;
    card.attackAtLevel = srcCard.AttackArray;
    card.xpAtLevel = srcCard.ExpArray;

    card.skillsAtLevel = {};

    if(srcCard.Skill) {
        card.skillsAtLevel[0] = extractSkillsFromString(srcCard.Skill, skills);
    }

    if(srcCard.LockSkill1) {
        card.skillsAtLevel[5] = extractSkillsFromString(srcCard.LockSkill1, skills);
    }

    if(srcCard.LockSkill2) {
        card.skillsAtLevel[10] = extractSkillsFromString(srcCard.LockSkill2, skills);
    }

    return card;
}

function adapt(options) {
    if(!_.isArray(options.array) ||
       !_.isFunction(options.verifier) ||
       !_.isFunction(options.adaptor) ||
       !(typeof options.idKeyName === 'string'))
    {
        throw
    }
    let output = {};

    verifierFunc(array);

    array.forEach(element => {
        output[array[keyIdName]] = adaptorFunc(element);
    });
}

function adaptSkills(skillsArray) {
    let skills = {};

    verifySkillsArray(skillsArray);

    skillsArray.forEach(skill => {
        skills[skill.SkillId] = adaptSkill(skill);
    });

    return skills;
}

function adaptCards(cardsArray, skills) {
    let cards = {};

    verifyCardsArray(cardsArray);

    cardsArray.forEach(card => {
        cards[card.CardId] = adaptCard(card, skills);
    });

    return cards;
}

function getCardsArrayFromJson() {
    let cardsArray = [];
    $.ajax({
        url: `${process.env.PUBLIC_URL}/loa-data/cards.json`,
        dataType: 'json',
        contentType: 'application/json',
        success: (data, textStatus, jqXHR) => {
            cardsArray = data.data.Cards;
        },
    });

    return cardsArray;
}

function getSkillsArrayFromJson() {
    let skillsArray = [];
    $.ajax({
        url: `${process.env.PUBLIC_URL}/loa-data/skills.json`,
        dataType: 'json',
        contentType: 'application/json',
        success: (data, textStatus, jqXHR) => {
            skillsArray = data.data.Skills;
        },
    });

    return skillsArray;
}