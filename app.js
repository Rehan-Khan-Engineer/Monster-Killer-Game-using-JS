const PLAYER_ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;

const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";

const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";

const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

const enteredValue = prompt(
  "Choose a maxiumum life for you and the Monster!",
  "100"
);

let chosenMaxLife = parseInt(enteredValue);
const battleLog = [];
let lastLoggedEntry;

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;

  alert("You entered wrong value, 100 max life is taken as input!");
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;

let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(evt, val, monsterHealth, playerHealth) {
  let logEntry = {
    event: evt,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };

  if (evt === LOG_EVENT_PLAYER_ATTACK) {
    logEntry.target = "Monster";
  } else if (evt === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntry.target = "Monster";
  } else if (evt === LOG_EVENT_MONSTER_ATTACK) {
    logEntry.target = "Player";
  } else if (evt === LOG_EVENT_PLAYER_HEAL) {
    logEntry.target = "Player";
  }

  battleLog.push(logEntry);
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;

  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);

  currentPlayerHealth = currentPlayerHealth - playerDamage;

  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  //   Bonus life functionality
  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("Bonus Life saved you from losing!");
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You Killed the Monster!");

    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("Monster destroyed you!");

    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MONSTER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentMonsterHealth && currentPlayerHealth <= 0) {
    alert("You have a draw!");

    writeToLog(
      LOG_EVENT_GAME_OVER,
      "A DRAW",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackMonster(attackMode) {
  let maxDamage;
  let logEvent;

  if (attackMode === MODE_ATTACK) {
    maxDamage = PLAYER_ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_ATTACK;
  } else if (attackMode === MODE_STRONG_ATTACK) {
    maxDamage = STRONG_ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  }

  const monsterDamage = dealMonsterDamage(maxDamage);
  currentMonsterHealth = currentMonsterHealth - monsterDamage;

  writeToLog(
    logEvent,
    monsterDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  endRound();
}

function attackManager() {
  attackMonster(MODE_ATTACK);
}

function strongAttackManager() {
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerManager() {
  let healPoints;

  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You can't heal to more than your maximun life");
    healPoints = chosenMaxLife - currentPlayerHealth;
  } else {
    healPoints = HEAL_VALUE;
  }
  increasePlayerHealth(healPoints);
  currentPlayerHealth = currentPlayerHealth + healPoints;

  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healPoints,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function printLogManager() {
  for (let i = 0; i < 3; i++) {
    console.log("-------------------------");
  }

  let i = 0;
  for (const logEntry of battleLog) {
    console.log(`#${i}`);

    for (const key in logEntry) {
      console.log(`${key} => ${logEntry[key]}`);
    }

    i++;
  }
}

attackBtn.addEventListener("click", attackManager);

strongAttackBtn.addEventListener("click", strongAttackManager);

healBtn.addEventListener("click", healPlayerManager);

logBtn.addEventListener("click", printLogManager);
