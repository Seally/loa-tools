// const fs = require("fs");
const path = require('path');
const readline = require("readline");
// const _und = require('underscore');

let cardData = require(path.resolve(__dirname, 'cards.json'));
let skillData = require(path.resolve(__dirname, 'skills.json'));
// let runeData = require(path.resolve(__dirname, 'runes.json'));
// let mapData = require(path.resolve(__dirname, 'maps.json'));

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.prompt();

rl.on('line', function (command) {
  let cmdSanitized = command.trim().toLowerCase();
  let commands = cmdSanitized.split(/[^A-Za-z0-9_,-]/);

  if (commands[0] === 'help') {
    printHelp();
  } else if (commands[0] === 'list') {
    const starSyntaxRegex = /^all$|^([0-9,-]*[0-9]+)-?star$/;

    if (commands[1] === 'skill') {
      let skillPropertyName = getSkillPropertyFromUserCommand(commands[2]);
      let alsoPrint = [];

      if (commands[3] === 'with' && commands[4]) {
        alsoPrint = commands[4].split(',');
      }

      listSkillProperties(skillPropertyName, alsoPrint);
    } else if (commands[1] === 'skills' || commands[2] === 'skills') {
      let converged = commands[1] === 'converged';
      let withDescription = false;
      let skillPropertyGroup = undefined;
      let nextCmdPos = commands.findIndex(element => element === 'skills') + 1;

      if (commands[nextCmdPos] === 'with' && commands[nextCmdPos + 1] === 'description') {
        withDescription = true;
      }

      nextCmdPos = commands.findIndex(element => element === 'groupedby') + 1;
      if(nextCmdPos > 0) {
        try {
          skillPropertyGroup = getSkillPropertyFromUserCommand(commands[nextCmdPos]);
        } catch(err) {
          if(err instanceof RangeError) {
            skillPropertyGroup = undefined;
          }
        }
      }

      listSkills(command, skillPropertyGroup, converged, withDescription);
    } else if (commands[2] === 'cards') {
      let stars = new Set();
      let raceIds = new Set();

      if (starSyntaxRegex.test(commands[1])) {
        stars = handleCardStarFiltering(commands[1]);
      } else {
        raceIds = handleCardRaceFiltering(commands[1]);
      }

      listCards(raceIds, stars);
    } else if (commands[3] === 'cards') {
      let stars = new Set();
      let raceIds = new Set();

      for(let i = 1; i <= 2; ++i) {
        if (starSyntaxRegex.test(commands[i])) {
          let result = handleCardStarFiltering(commands[i]);

          for(let entry of result) {
            console.log('entry: ' + entry);
            stars.add(entry);
          }
        } else {
          let result = handleCardRaceFiltering(commands[i]);

          for(let entry of result) {
            console.log('entry: ' + entry);
            raceIds.add(entry);
          }
        }
      }

      listCards(raceIds, stars);
    } else if (commands[1] === 'cardraces') {
      listCardRaces();
    } else if (commands[1] === 'cardstars') {
      listCardStars();
    } else {
      handleUnrecognizedCommand(command);
    }
  } else {
    handleUnrecognizedCommand(command);
  }

  rl.prompt();
}).on('close', function () {
  console.log('\nExiting...');
  process.exit(0);
});

function handleUnrecognizedCommand(cmd, customMessage) {
  if(customMessage === undefined) {
    console.log(`Unrecognized command: "${cmd}"`);
  } else {
    console.log(customMessage);
  }
  printHelp();
}

function printHelp() {
  console.log(`Commands:
 - help: Shows this message
 - list <M-Nstar> <race> cards
 - list cardraces|cardstars
 - list skill <skill properties> [with name(s),desc(riptions)]: 
     add the bracketed portion to also print the skill names/descriptions along 
     with the listed property. Do *not* add space between commas. 
 - list [converged] skills [with descriptions] [groupedby <skill properties>]:
   * [converged]:                    similar skills are converged into a single 
                                     entry (see Skill Convergence Rules below).
                                     
                                     WARNING: This option cannot be used with 
                                     the "with descriptions" and 
                                     "groupedby affectvalues|affectvalues2" 
                                     options.
   * [with descriptions]:            prints the skill description along with the 
                                     name. 
                                     
                                     *Incompatible with "converged".
   * [groupedby <skill properties>]: lists the skills under groups. 
                                     *Incompatible with "converged" for 
                                     properties: affectvalues, affectvalues2*
   
   NOTE: "list skills with descriptions groupedby types" is identical to
         "list skill types with name,desc".
 - CTRL+C or CTRL+D to quit.
  
<race> can be "raceid#", with # being the race ID, or the following strings
('|' means or, and indicates that they are treated as the same race):
 - all
 - kingdom
 - forest
 - wild|wilderness
 - hell
 - undefined
 - universal|joker
 - prop
 - demon
 - demon97
 - di|didemon|demoninv|demoninvasion|demon100.
To specify multiple races, separate entries with a comma, like "wild,hell", 
*without* spaces between the comma and the next entry.

<M-N,Ostar>, where M and N are integers. "-N" part can be omitted. You can use 
commas here too. The keyword "all" can also be used here. The '-' immediately
before "star" is optional.

Examples: 
 - 1-star (only 1 stars)
 - 1-3star (1 to 3 stars)
 - 1star (only 1 stars)
 - 5-3star (3 to 5 stars)
 - 1,4-5star (1, 4, and 5 stars)

<skill properties>: this value can be:
 - types
 - launchtypes
 - launchconditions
 - launchconditionvalues
 - affecttypes
 - affectvalues
 - affectvalues2
 - skillcategories

Skill Convergence Rules
    Two skills can be converged when all of these are true:
 - Names are the same except the ending number (skill grade).
 - The description, minus the numeric portions, are identical.
 - The following properties are identical:
   * Type
   * LanchType
   * LanchCondition
   * LanchConditionValue
   * AffectType
   * SkillCategory
   * `);
}

function getSkillPropertyFromUserCommand(command, propertyMustBeConvergeable) {
  if(propertyMustBeConvergeable === undefined) {
    propertyMustBeConvergeable = false;
  }

  switch(command.trim().toLowerCase()) {
    case 'types':
      return 'Type';
    case 'launchtypes':
      return 'LanchType';
    case 'launchconditions':
      return 'LanchCondition';
    case 'launchconditionvalues':
      return 'LanchConditionValue';
    case 'affecttypes':
      return 'AffectType';
    case 'affectvalues':
      if(propertyMustBeConvergeable) {
        throw new RangeError('AffectValue property cannot be used with ' +
          'skill convergence.');
      }
      return 'AffectValue';
    case 'affectvalues2':
      if(propertyMustBeConvergeable) {
        throw new RangeError('AffectValue2 property cannot be used with ' +
          'skill convergence.');
      }
      return 'AffectValue2';
    case 'skillcategories':
      return 'SkillCategory';
    default:
      throw new RangeError('Unrecognized property: ' + command);
  }
}

function handleCardStarFiltering(command) {
  command = command.trim().toLowerCase();
  let stars = new Set();

  if(command === 'all') {
    return stars;
  }

  let userStars = /([0-9,-]*[0-9]+)-?star$/.exec(command)[1];

  let commaSeparatedStars = userStars.split(',');
  commaSeparatedStars.forEach(function (commaSeparatedStar) {
    // process lone numbers
    if (/^[0-9]+$/.test(commaSeparatedStar)) {
      stars.add(parseInt(commaSeparatedStar));
      // process number ranges
    } else if (/^[0-9]+-[0-9]+$/.test(commaSeparatedStar)) {
      let numberMatches = commaSeparatedStar.split('-').map(str => parseInt(str));
      let first = Math.min(...numberMatches);
      let last = Math.max(...numberMatches);

      for (let i = first; i <= last; ++i) {
        stars.add(i);
      }
    }
  });

  return stars;
}

function handleCardRaceFiltering(command) {
  // getRaceIds throws an error if race is invalid.
  let raceIds = new Set();
  let raceCommands = command.split(',');

  raceCommands.forEach(function (raceCommand) {
    if(raceCommand === 'all') {
      return new Set();
    } else if (/^raceid[0-9]+$/.test(raceCommand)) {
      raceIds.add(parseInt(raceCommand.match(/^raceid([0-9]+)$/)[1]));
    } else {
      try {
        getRaceIds(raceCommand).forEach(race => raceIds.add(race));
      } catch (err) {
        if(!(err instanceof RangeError)) {
          // if getRaceIds() throw error, ignore the entered race. Else,
          // rethrow.
          throw err;
        }
      }
    }
  });

  return raceIds;
}

function listSkills(command, skillProperty, converged, withDescription) {
  if(typeof converged !== 'boolean' || typeof withDescription !== 'boolean') {
    throw new RangeError('converged and withDescription must be Booleans.');
  }

  if(converged && withDescription) {
    handleUnrecognizedCommand(command, '"converged" option cannot be used ' +
      'with "with description".');
    return;
  }

  if(converged && /^AffectValue[2]?$/.test(skillProperty)) {
    handleUnrecognizedCommand(command, '"converged" option cannot be used ' +
      `with skill property: ${skillProperty}`);
    return;
  }

  if(!converged) {
    if(skillProperty !== undefined) {
      listSkillProperties(skillProperty, withDescription ? ['name', 'desc'] : ['name']);
    } else {
      let i = 1;

      skillData.data.Skills.forEach(function (skill) {
        process.stdout.write(`${i++}) ${skill.Name}`);

        if(withDescription) {
          process.stdout.write(`: ${skill.Desc}`);
        }

        process.stdout.write('\n');
      });
    }
  } else {
    let convergedSkills = getConvergedSkills();

    if(skillProperty !== undefined) {
      listSkillProperties(skillProperty, ['name'], convergedSkills);
    } else {
      let i = 1;

      convergedSkills.forEach(function (skill) {
        console.log(`${i++}) ${skill.Name}`);
      });
    }
  }
}

function getConvergedSkills() {
  let workingArr = [];
  let resultArr = [];

  skillData.data.Skills.forEach(function(skill) {
    let skillAdded = false;

    for(let i = 0; i < workingArr.length; ++i) {
      if(areSkillsConvergeable(workingArr[i][0], skill)) {
        workingArr[i].push(skill);
        skillAdded = true;
        break;
      }
    }

    if(!skillAdded) {
      workingArr.push([skill]);
    }
  });

  workingArr.forEach(function(skillArr) {
    if(skillArr.length === 1) {
      resultArr.push(skillArr[0]);
    } else {
      resultArr.push(convergeSkill(skillArr[0]));
    }
  });

  console.log(`resultArr: ${resultArr.length}`);

  return resultArr;
}

function convergeSkill(skill) {
  const nameRegex = /^\s*(.*?)\s*[0-9]*\s*$/;

  return {
    Name: nameRegex.exec(skill.Name)[1],
    Type: skill.Type,
    LanchType: skill.LanchType,
    LanchCondition: skill.LanchCondition,
    LanchConditionValue: skill.LanchConditionValue,
    AffectType: skill.AffectType,
    SkillCategory: skill.SkillCategory
  };
}

function areSkillsConvergeable(skill1, skill2) {
  const nameRegex = /^\s*(.*?)\s*[0-9]*\s*$/;

  let convergedName1 = nameRegex.exec(skill1.Name)[1];
  let convergedName2 = nameRegex.exec(skill2.Name)[1];

  if(skill1.Name === skill2.Name || convergedName1 === convergedName2) {
    // console.log('Layer 1 passed.');
    if(skill1.LanchType           === skill2.LanchType &&
       skill1.LanchCondition      === skill2.LanchCondition &&
       skill1.LanchConditionValue === skill2.LanchConditionValue &&
       skill1.AffectType          === skill2.AffectType &&
       skill1.SkillCategory       === skill2.SkillCategory) {
      // console.log('Layer 2 passed.');
      switch(convergedName1) {
        case 'Concentration':
        case 'Desperation:  Firestorm':
        case 'Quick Strike: Teleportation':
        case 'Thunder Roar':
        case 'Death Seal':
        case 'Wish':
          return true;
        case 'Reincarnation':
          if (skill1.SkillId !== 2505 && skill2.SkillId !== 2505) {
            return true;
          }
          break;
        default:
          let processDescription = (desc) => {
            const noSpacingRegex = /(.)([.%])([A-Za-z])/g;
            const numberReplacementRegex = /[0-9]+(\.[0-9]+)?/g;
            const cardPluralRegex = /card\(?s\)?/gi;

            return desc.trim().toLowerCase()
                       .replace(noSpacingRegex, '$1$2 $3')
                       .replace(numberReplacementRegex, '')
                       .replace(cardPluralRegex, 'card')
          };

          if(processDescription(skill1.Desc) === processDescription(skill2.Desc)) {
            return true;
          }
      }
    }
  }

  return false;
}

function logIf(message, condition) {
  if(condition()) {
    console.log(message);
  }
}

function listSkillProperties(skillProperty, alsoPrint, skills = skillData.data.Skills) {
  let printSkillName;
  let printSkillDescription;

  if(alsoPrint === undefined || alsoPrint.length <= 0) {
    printSkillName = printSkillDescription = false;
  } else {
    printSkillName = alsoPrint.includes('name') ||
      alsoPrint.includes('names');
    printSkillDescription = alsoPrint.includes('descriptions') ||
      alsoPrint.includes('description') ||
      alsoPrint.includes('descs') ||
      alsoPrint.includes('desc');
  }

  let printSkills = () => printSkillName || printSkillDescription;

  let outputData = {};
  skills.forEach(function (skill) {
    let propertyValue = parseInt(skill[skillProperty]);

    if(outputData[propertyValue] === undefined) {
      outputData[propertyValue] = [];
    }

    outputData[propertyValue].push(skill);
  });

  let i = 1;
  for(let outputDataProperty in outputData) {
    if(outputData.hasOwnProperty(outputDataProperty)) {
      let numbering1 = `${i}) `;
      console.log(`${numbering1}${skillProperty}: ${outputDataProperty}`);

      if(printSkills()) {
        let j = 1;

        outputData[outputDataProperty].forEach(function (skill) {
          let numbering2 = `${' '.repeat(numbering1.length)}${i}.${j++} `;
          process.stdout.write(numbering2);
          if(printSkillName) {
            process.stdout.write(skill.Name);

            if(printSkillDescription) {
              process.stdout.write(`: ${skill.Desc}`);
            }
          } else if(printSkillDescription) {
            process.stdout.write(skill.Desc);
          }

          process.stdout.write('\n');
        });
      }

      ++i;
    }
  }
}

/**
 *
 * @param raceIds A Set object containing the IDs of card races to be printed.
 *                If undefined or empty, races won't be used as a filter.
 * @param stars   A Set object containing the stars of cards to be printed.
 *                If undefined or empty, stars won't be used as a filter.
 */
function listCards(raceIds, stars) {
  let allRacesMode = raceIds === undefined || raceIds.size <= 0;
  let allStarsMode = stars === undefined || stars.size <= 0;

  let i = 1;

  cardData.data.Cards.forEach(function (card) {
    if(allRacesMode || raceIds.has(parseInt(card.Race))) {
      if(allStarsMode || stars.has(parseInt(card.Color))) {
        console.log(`${i++}) ${card.CardName}`);
      }
    }
  });
}

function listCardRaces() {
  let cardRaces = {};

  cardData.data.Cards.forEach(function (card) {
    try {
      cardRaces[`${card.Race}`] = getRaceString(parseInt(card.Race));
    } catch (err) {
      if (err instanceof RangeError) {
        cardRaces[`${card.Race}`] = '<unsupported race>';
      }
    }
  });

  for (let property in cardRaces) {
    if (cardRaces.hasOwnProperty(property)) {
      console.log(`${property}: ${cardRaces[property]}`);
    }
  }
}

function listCardStars() {
  let cardStars = {};

  cardData.data.Cards.forEach(function (card) {
    cardStars[`${card.Color}`] = `${parseInt(card.Color) + 1}-star card`;
  });

  for (let property in cardStars) {
    if (cardStars.hasOwnProperty(property)) {
      console.log(`${property}: ${cardStars[property]}`);
    }
  }
}

function getRaceIds(race) {
  race = race.trim().toLowerCase();
  switch (race) {
    case 'all':
      return [1, 2, 3, 4, 5, 97, 98, 99, 100];
    case 'kingdom':
      return [1];
    case 'forest':
      return [2];
    case 'wild':
    case 'wilderness':
      return [3];
    case 'hell':
      return [4];
    case 'undefined':
      return [5];
    case 'prop':
      return [99];
    case 'demon':
      return [97, 100];
    case 'demon97':
      return [97];
    case 'di':
    case 'didemon':
    case 'demoninvasion':
    case 'demoninv':
    case 'demon100':
      return [100];
    default:
      if (/(universal|joker).*$/.test(race)) {
        return [98];
      } else {
        throw new RangeError("Unsupported race: " + race);
      }
  }
}

function getRaceString(raceId) {
  switch (parseInt(raceId)) {
    case 1:
      return 'Kingdom';
    case 2:
      return 'Forest';
    case 3:
      return 'Wilderness';
    case 4:
      return 'Hell';
    case 5:
      return 'undefined';
    case 98:
      return 'Universal Cards';
    case 99:
      return 'Prop';
    case 97:
      return 'Demon';
    case 100:
      return 'Demon (DI)';
    default:
      throw new RangeError("Unsupported race ID: " + raceId);
  }
}
