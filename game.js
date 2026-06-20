const spaces = [
  ["Entrance Hall", "start", "Start", "*"],
  ["Castle Hallway", "empty", "Path", "."],
  ["Potions Classroom", "spell", "Spell", "*"],
  ["Portrait Passage", "empty", "Path", "."],
  ["Moving Staircases", "trouble", "Trouble", "!"],
  ["North Corridor", "empty", "Path", "."],
  ["Library", "item", "Item", "+"],
  ["Quiet Study Nook", "spell", "Spell", "*"],
  ["Charms Corridor", "spell", "Spell", "*"],
  ["Stone Bridge", "empty", "Path", "."],
  ["Clock Tower", "shortcut", "Shortcut", ">"],
  ["Armour Gallery", "empty", "Path", "."],
  ["Dusty Classroom", "spell", "Spell", "*"],
  ["Dungeons", "duel", "Duel", "X"],
  ["Hospital Wing", "item", "Item", "+"],
  ["Viaduct", "empty", "Path", "."],
  ["Broom Cupboard", "empty", "Path", "."],
  ["Transfiguration", "spell", "Spell", "*"],
  ["Trophy Room", "trouble", "Trouble", "!"],
  ["Grand Staircase", "empty", "Path", "."],
  ["First Floor Landing", "spell", "Spell", "*"],
  ["Quidditch Pitch", "duel", "Duel", "X"],
  ["Training Grounds", "empty", "Path", "."],
  ["Greenhouses", "spell", "Spell", "*"],
  ["Herbology Shed", "spell", "Spell", "*"],
  ["Secret Passage", "shortcut", "Shortcut", ">"],
  ["Courtyard", "empty", "Path", "."],
  ["Owlery", "item", "Item", "+"],
  ["Drafty Tower Room", "empty", "Path", "."],
  ["Defence Classroom", "spell", "Spell", "*"],
  ["East Tower Steps", "empty", "Path", "."],
  ["Peeves' Hallway", "trouble", "Trouble", "!"],
  ["Long Gallery", "spell", "Spell", "*"],
  ["Moonlit Corridor", "empty", "Path", "."],
  ["Forbidden Forest", "duel", "Duel", "X"],
  ["Forest Path", "empty", "Path", "."],
  ["Mirror Chamber", "spell", "Spell", "*"],
  ["Tapestry Walk", "empty", "Path", "."],
  ["Ravenclaw Tower", "item", "Item", "+"],
  ["Astronomy Landing", "spell", "Spell", "*"],
  ["Vanishing Step", "trouble", "Trouble", "!"],
  ["West Gallery", "empty", "Path", "."],
  ["Shortcut Arch", "shortcut", "Shortcut", ">"],
  ["Hidden Alcove", "empty", "Path", "."],
  ["Fat Lady's Landing", "empty", "Path", "."],
  ["Gryffindor Common Room", "spell", "Spell", "*"],
  ["Common Room Stairs", "empty", "Path", "."],
  ["Lower Hallway", "empty", "Path", "."],
  ["Slytherin Common Room", "duel", "Duel", "X"],
  ["Torchlit Passage", "empty", "Path", "."],
  ["Hagrid's Hut", "item", "Item", "+"],
  ["Covered Bridge", "empty", "Path", "."],
  ["Library Annex", "spell", "Spell", "*"],
  ["House Point Corridor", "spell", "Spell", "*"],
  ["Great Hall Doors", "empty", "Path", "."],
  ["Entrance to the Feast", "empty", "Path", "."],
  ["Potion Stores", "trouble", "Trouble", "!"],
  ["Great Hall", "finish", "Finish", "W"]
];

const spellDeckBase = [
  { name: "Expelliarmus", type: "attack", text: "Choose a player to lose 1 spell card." },
  { name: "Petrificus Totalus", type: "attack", text: "A player misses their next turn." },
  { name: "Tarantallegra", type: "attack", text: "Move another player backward 3 spaces." },
  { name: "Confundo", type: "attack", text: "Opponent can only roll 1-3 on their next turn." },
  { name: "Protego", type: "defence", text: "Block one attack spell." },
  { name: "Finite Incantatem", type: "defence", text: "Cancel a spell played on you." },
  { name: "Lumos", type: "defence", text: "Escape a Trouble Space." },
  { name: "Wingardium Leviosa", type: "movement", text: "Move forward 3 spaces." },
  { name: "Accio", type: "movement", text: "Take 1 random item card from another player." },
  { name: "Apparate", type: "movement", text: "Jump to the next Shortcut Space." }
];

const itemDeckBase = [
  { name: "Nimbus 2000", type: "item", text: "Move double next turn." },
  { name: "Invisibility Cloak", type: "item", text: "Avoid one duel." },
  { name: "Chocolate Frog", type: "item", text: "Take another turn." },
  { name: "Felix Felicis", type: "item", text: "Roll twice and choose the better number." },
  { name: "Golden Snitch", type: "item", text: "Move forward 5 spaces." }
];

const troubleDeck = [
  { name: "Snape caught you talking", effect: "skip", text: "Miss a turn." },
  { name: "Moving staircases confused you", effect: "back2", text: "Move back 2 spaces." },
  { name: "Peeves played a prank", effect: "loseItem", text: "Lose 1 item card." },
  { name: "Lost in the Forbidden Forest", effect: "skip", text: "Skip next turn." }
];

const colors = ["#c94747", "#3d79d8", "#3f9f71", "#d5a73a"];
const names = ["Scarlet Wizard", "Blue Wizard", "Emerald Wizard", "Gold Wizard"];

let state = null;
let cardId = 0;

const els = {
  setup: document.getElementById("setup"),
  game: document.getElementById("game"),
  board: document.getElementById("board"),
  startGame: document.getElementById("startGame"),
  newGame: document.getElementById("newGame"),
  playerCount: document.getElementById("playerCount"),
  nameFields: document.getElementById("nameFields"),
  reverseDirection: document.getElementById("reverseDirection"),
  rollDice: document.getElementById("rollDice"),
  endTurn: document.getElementById("endTurn"),
  die: document.getElementById("die"),
  message: document.getElementById("message"),
  turnTitle: document.getElementById("turnTitle"),
  playersPanel: document.getElementById("playersPanel"),
  handPanel: document.getElementById("handPanel"),
  handOwner: document.getElementById("handOwner"),
  cards: document.getElementById("cards"),
  log: document.getElementById("log"),
  modal: document.getElementById("modal"),
  modalTitle: document.getElementById("modalTitle"),
  modalText: document.getElementById("modalText"),
  modalActions: document.getElementById("modalActions"),
  duelPanel: document.getElementById("duelPanel"),
  duelTitle: document.getElementById("duelTitle"),
  duelText: document.getElementById("duelText"),
  duelActions: document.getElementById("duelActions"),
  toasts: document.getElementById("toasts")
};

function shuffle(cards) {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeDeck(base, repeats) {
  const cards = [];
  for (let i = 0; i < repeats; i++) {
    base.forEach((card) => cards.push({ ...card, id: `card-${cardId++}` }));
  }
  return shuffle(cards);
}

function currentPlayer() {
  return state.players[state.current];
}

function log(text) {
  state.log.unshift(text);
  state.log = state.log.slice(0, 35);
  showToast(text);
}

function showToast(text) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = text;
  els.toasts.prepend(toast);

  while (els.toasts.children.length > 4) {
    els.toasts.lastElementChild.remove();
  }

  window.setTimeout(() => {
    toast.classList.add("is-leaving");
    window.setTimeout(() => toast.remove(), 240);
  }, 3400);
}

function roll(sides = 6) {
  return Math.floor(Math.random() * sides) + 1;
}

function drawFrom(deckName) {
  if (state[deckName].length === 0) {
    state[deckName] = makeDeck(deckName === "spellDeck" ? spellDeckBase : itemDeckBase, deckName === "spellDeck" ? 3 : 4);
  }
  return state[deckName].pop();
}

function renderNameFields() {
  const count = Number(els.playerCount.value);
  els.nameFields.innerHTML = names
    .slice(0, count)
    .map((name, index) => `
      <label class="name-field">
        <span class="token" style="background:${colors[index]}">${index + 1}</span>
        <input maxlength="18" data-name-index="${index}" placeholder="${name}" value="${name}" />
      </label>
    `)
    .join("");
}

function getPlayerNames(count) {
  return Array.from(els.nameFields.querySelectorAll("input"))
    .slice(0, count)
    .map((input, index) => input.value.trim() || names[index]);
}

function startGame() {
  const count = Number(els.playerCount.value);
  const playerNames = getPlayerNames(count);
  state = {
    players: Array.from({ length: count }, (_, index) => ({
      id: index,
      name: playerNames[index],
      color: colors[index],
      position: 0,
      spells: [],
      items: [],
      direction: 1,
      skip: false,
      confused: false,
      doubleMove: false,
      extraTurn: false,
      rolled: false,
      usedSpell: false,
      usedItem: false
    })),
    current: 0,
    spellDeck: makeDeck(spellDeckBase, 3),
    itemDeck: makeDeck(itemDeckBase, 4),
    log: [],
    gameOver: false,
    animating: false,
    duelActive: false
  };

  state.players.forEach((player) => {
    player.spells.push(drawFrom("spellDeck"));
    player.spells.push(drawFrom("spellDeck"));
    player.items.push(drawFrom("itemDeck"));
  });

  els.setup.classList.add("hidden");
  els.game.classList.remove("hidden");
  log("The tournament begins. Each wizard starts with 2 spells and 1 item.");
  setMessage("Roll to move through Hogwarts.");
  render();
}

function renderBoard() {
  els.board.innerHTML = spaces
    .map(([name, type, label, icon], index) => {
      const tokens = state.players
        .filter((player) => player.position === index)
        .map((player) => `<span class="token" style="background:${player.color}">${player.id + 1}</span>`)
        .join("");
      return `
        <article class="space space--${type}" data-num="${index}">
          <div>
            <div class="space__icon">${icon}</div>
            <div class="space__name">${name}</div>
          </div>
          <div>
            <div class="tokens">${tokens}</div>
            <div class="space__type">${label}</div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderPlayers() {
  els.playersPanel.innerHTML = state.players
    .map((player, index) => `
      <article class="player-card ${index === state.current ? "is-current" : ""}">
        <span class="token" style="background:${player.color}">${player.id + 1}</span>
        <div>
          <p class="player-name">${player.name}</p>
          <div class="stats">
            <span class="stat">Space ${player.position}</span>
            <span class="stat">${player.direction === 1 ? "Forward" : "Backward"}</span>
            <span class="stat">${player.spells.length}/5 spells</span>
            <span class="stat">${player.items.length} items</span>
            ${player.skip ? '<span class="stat">Miss turn</span>' : ""}
            ${player.confused ? '<span class="stat">Confounded</span>' : ""}
          </div>
        </div>
      </article>
    `)
    .join("");
}

function renderHand() {
  const player = currentPlayer();
  els.handOwner.textContent = `${player.name}'s hand`;
  const spellCards = player.spells.map((card, index) => renderCard(card, index, "spell")).join("");
  const itemCards = player.items.map((card, index) => renderCard(card, index, "item")).join("");
  els.cards.innerHTML = spellCards + itemCards || `<p class="card__text">No cards yet.</p>`;
}

function renderCard(card, index, bucket) {
  const canUse = bucket === "spell" ? !currentPlayer().usedSpell : !currentPlayer().usedItem;
  const verb = bucket === "spell" ? "Cast" : "Use";
  return `
    <article class="card card--${card.type}">
      <div class="card__top">
        <span class="card__name">${card.name}</span>
        <span class="card__type">${card.type}</span>
      </div>
      <p class="card__text">${card.text}</p>
      <button class="small" data-card="${index}" data-bucket="${bucket}" ${canUse && !state.gameOver && !state.animating && !state.duelActive ? "" : "disabled"}>${verb}</button>
    </article>
  `;
}

function renderLog() {
  els.log.innerHTML = state.log.map((entry) => `<li>${entry}</li>`).join("");
}

function render() {
  const player = currentPlayer();
  els.turnTitle.textContent = state.gameOver ? "Tournament complete" : `${player.name}'s turn`;
  els.rollDice.disabled = state.gameOver || player.rolled || state.animating || state.duelActive;
  els.endTurn.disabled = state.gameOver || state.animating || state.duelActive;
  els.reverseDirection.disabled = state.gameOver || player.rolled || state.animating || state.duelActive;
  renderBoard();
  renderPlayers();
  renderHand();
  renderLog();
}

function setMessage(text, popup = false) {
  els.message.textContent = text;
  if (popup) showToast(text);
}

function movePlayer(player, amount) {
  player.position = Math.max(0, Math.min(spaces.length - 1, player.position + amount));
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function animateMovePlayer(player, amount) {
  const steps = Math.abs(amount);
  let direction = amount < 0 ? -1 : player.direction;
  if (steps === 0 || direction === 0) return;

  state.animating = true;
  render();
  for (let i = 0; i < steps; i++) {
    let nextPosition = player.position + direction;
    if (nextPosition < 0 || nextPosition >= spaces.length) {
      direction *= -1;
      player.direction = direction;
      nextPosition = player.position + direction;
    }
    player.position = Math.max(0, Math.min(spaces.length - 1, nextPosition));
    setMessage(`${player.name} moves to ${spaces[player.position][0]}.`);
    render();
    await sleep(260);
  }
  player.direction = direction;
  state.animating = false;
  render();
}

async function rollDice() {
  const player = currentPlayer();
  if (state.animating) return;
  if (player.skip) {
    player.skip = false;
    player.rolled = true;
    els.die.textContent = "-";
    log(`${player.name} misses this turn.`);
    setMessage(`${player.name} misses this turn.`, true);
    render();
    return;
  }

  let value = roll();
  let detail = `${player.name} rolled ${value}.`;
  if (player.confused) {
    value = Math.min(value, 3);
    player.confused = false;
    detail += ` Confundo limits it to ${value}.`;
  }
  if (player.doubleMove) {
    value *= 2;
    player.doubleMove = false;
    detail += ` Nimbus 2000 doubles the move to ${value}.`;
  }

  player.rolled = true;
  els.die.textContent = value;
  await animateMovePlayer(player, value);
  log(`${detail} ${player.name} moves to ${spaces[player.position][0]}.`);
  setMessage(`${detail} ${player.name} landed on ${spaces[player.position][0]}.`);
  await resolveSpace(player);
  await checkWin(player);
  render();
}

async function resolveSpace(player) {
  const [spaceName, type] = spaces[player.position];
  if (type === "empty" || type === "start") {
    setMessage(`${player.name} landed on ${spaceName}. No action.`);
  }
  if (type === "spell") drawSpell(player);
  if (type === "item") drawItem(player);
  if (type === "shortcut") {
    await animateMovePlayer(player, 3);
    log(`${player.name} takes a shortcut and moves ahead 3 spaces.`);
    setMessage(`${player.name} takes a shortcut and moves to ${spaces[player.position][0]}.`, true);
  }
  if (type === "trouble") await handleTrouble(player);
  if (type === "duel") handleDuel(player);
}

function drawSpell(player) {
  const card = drawFrom("spellDeck");
  player.spells.push(card);
  log(`${player.name} draws ${card.name}.`);
  setMessage(`${player.name} landed on a Spell Space and draws ${card.name}.`, true);
  enforceSpellLimit(player);
}

function enforceSpellLimit(player) {
  while (player.spells.length > 5) {
    const removed = player.spells.shift();
    log(`${player.name} discards ${removed.name} to keep the 5 spell limit.`);
  }
}

function drawItem(player) {
  const card = drawFrom("itemDeck");
  player.items.push(card);
  log(`${player.name} draws ${card.name}.`);
  setMessage(`${player.name} landed on an Item Space and draws ${card.name}.`, true);
}

async function handleTrouble(player) {
  const lumosIndex = player.spells.findIndex((card) => card.name === "Lumos");
  if (lumosIndex >= 0) {
    const lumos = player.spells.splice(lumosIndex, 1)[0];
    log(`${player.name} uses ${lumos.name} to escape a Trouble Space.`);
    setMessage(`${player.name} lands on trouble, but Lumos cancels it.`, true);
    return;
  }

  const trouble = troubleDeck[Math.floor(Math.random() * troubleDeck.length)];
  log(`${player.name} faces trouble: ${trouble.name}. ${trouble.text}`);
  if (trouble.effect === "skip") {
    player.skip = true;
    setMessage(`Trouble: ${trouble.name}. ${player.name} will miss the next turn.`, true);
  }
  if (trouble.effect === "back2") {
    await animateMovePlayer(player, -2);
    setMessage(`Trouble: ${trouble.name}. ${player.name} moves back 2 spaces.`, true);
  }
  if (trouble.effect === "loseItem" && player.items.length) {
    const lost = player.items.splice(Math.floor(Math.random() * player.items.length), 1)[0];
    log(`${player.name} loses ${lost.name}.`);
    setMessage(`Trouble: ${trouble.name}. ${player.name} loses ${lost.name}.`, true);
  } else if (trouble.effect === "loseItem") {
    setMessage(`Trouble: ${trouble.name}. ${player.name} has no item to lose.`, true);
  }
}

function handleDuel(player) {
  setMessage(`${player.name} landed on a Duel Space.`, true);
  const cloakIndex = player.items.findIndex((card) => card.name === "Invisibility Cloak");
  if (cloakIndex >= 0) {
    showDuelPanel("Duel Space", `${player.name} has an Invisibility Cloak. Avoid this duel or challenge another wizard?`, [
      {
        label: "Use cloak",
        action: () => {
          const cloak = player.items.splice(cloakIndex, 1)[0];
          log(`${player.name} uses ${cloak.name} to avoid the duel.`);
          setMessage(`${player.name} uses Invisibility Cloak and slips past the duel.`, true);
          hideDuelPanel();
          render();
        }
      },
      {
        label: "Duel",
        action: () => chooseDuelOpponent(player)
      }
    ]);
    return;
  }

  chooseDuelOpponent(player);
}

function chooseDuelOpponent(player) {
  const opponents = state.players.filter((other) => other.id !== player.id);
  showDuelPanel("Choose Duel Opponent", `${player.name}, choose who you want to duel.`, opponents.map((opponent) => ({
    label: opponent.name,
    action: () => startDuel(player, opponent)
  })));
}

function startDuel(attacker, defender) {
  const duel = {
    attacker,
    defender,
    attackRoll: null,
    defendRoll: null
  };
  log(`${attacker.name} challenges ${defender.name} to a duel.`);
  setMessage(`${attacker.name} challenges ${defender.name}. Each player rolls once; higher roll wins.`, true);
  showDuelRoll(duel);
}

function showDuelRoll(duel) {
  const roller = duel.attackRoll === null ? duel.attacker : duel.defender;
  const previous = duel.attackRoll === null ? "" : `${duel.attacker.name} rolled ${duel.attackRoll}. `;
  showDuelPanel("Duel Roll", `${previous}${roller.name}, roll once for the duel. Higher roll wins.`, [
    {
      label: `Roll for ${roller.name}`,
      action: () => {
        const value = roll();
        if (duel.attackRoll === null) {
          duel.attackRoll = value;
          log(`${duel.attacker.name} rolls ${value} in the duel.`);
          setMessage(`${duel.attacker.name} rolls ${value}. Now ${duel.defender.name} rolls.`, true);
          showDuelRoll(duel);
        } else {
          duel.defendRoll = value;
          log(`${duel.defender.name} rolls ${value} in the duel.`);
          finishDuel(duel);
        }
        render();
      }
    }
  ]);
}

function finishDuel(duel) {
  const { attacker, defender, attackRoll, defendRoll } = duel;
  if (attackRoll === defendRoll) {
    log(`${attacker.name} and ${defender.name} tie the duel ${attackRoll} to ${defendRoll}. They must roll again.`);
    setMessage(`${attacker.name} and ${defender.name} both rolled ${attackRoll}. Roll again to break the tie.`, true);
    showDuelPanel("Duel Tie", "Both players rolled the same number. Roll again; higher roll wins.", [
      {
        label: "Roll again",
        action: () => {
          duel.attackRoll = null;
          duel.defendRoll = null;
          showDuelRoll(duel);
        }
      }
    ]);
    render();
    return;
  }

  const winner = attackRoll >= defendRoll ? attacker : defender;
  const loser = winner === attacker ? defender : attacker;
  log(`${attacker.name} duels ${defender.name}: ${attackRoll} to ${defendRoll}. ${winner.name} wins.`);
  setMessage(`${attacker.name} rolled ${attackRoll}. ${defender.name} rolled ${defendRoll}. ${winner.name} wins the duel.`, true);

  showDuelPanel("Duel Reward", `${winner.name}, choose your reward.`, [
    {
      label: "Steal spell",
      action: () => {
        if (loser.spells.length) {
          const stolen = loser.spells.splice(Math.floor(Math.random() * loser.spells.length), 1)[0];
          winner.spells.push(stolen);
          enforceSpellLimit(winner);
          log(`${winner.name} steals ${stolen.name} from ${loser.name}.`);
          setMessage(`${winner.name} wins the duel and steals ${stolen.name}.`, true);
        } else {
          log(`${loser.name} has no spell cards to steal.`);
          setMessage(`${winner.name} wins the duel, but ${loser.name} has no spell cards to steal.`, true);
        }
        hideDuelPanel();
        render();
      }
    },
    {
      label: "Move back",
      action: async () => {
        await animateMovePlayer(loser, -2);
        log(`${winner.name} moves ${loser.name} back 2 spaces.`);
        setMessage(`${winner.name} wins the duel and moves ${loser.name} back 2 spaces.`, true);
        hideDuelPanel();
        render();
      }
    }
  ]);
  render();
}

async function castSpell(index) {
  const player = currentPlayer();
  if (state.animating) return;
  if (player.usedSpell) return;
  const card = player.spells[index];

  if (card.type === "attack") {
    const targets = state.players.filter((other) => other.id !== player.id);
    choose(card.name, "Choose a target.", targets.map((target) => ({
      label: target.name,
      action: () => applyAttack(player, target, index)
    })));
    return;
  }

  player.spells.splice(index, 1);
  player.usedSpell = true;
  if (card.name === "Wingardium Leviosa") {
    await animateMovePlayer(player, 3);
    log(`${player.name} casts ${card.name} and moves forward 3 spaces.`);
    await resolveSpace(player);
    await checkWin(player);
  } else if (card.name === "Accio") {
    const targets = state.players.filter((other) => other.id !== player.id && other.items.length);
    if (targets.length) {
      const target = targets[Math.floor(Math.random() * targets.length)];
      const stolen = target.items.splice(Math.floor(Math.random() * target.items.length), 1)[0];
      player.items.push(stolen);
      log(`${player.name} casts Accio and takes ${stolen.name} from ${target.name}.`);
    } else {
      log(`${player.name} casts Accio, but no one has an item to take.`);
    }
  } else if (card.name === "Apparate") {
    const nextShortcut = spaces.findIndex((space, spaceIndex) => spaceIndex > player.position && space[1] === "shortcut");
    player.position = nextShortcut >= 0 ? nextShortcut : player.position;
    log(`${player.name} casts Apparate and jumps to ${spaces[player.position][0]}.`);
  } else {
    log(`${player.name} keeps ${card.name} ready for defence.`);
    player.spells.push(card);
    player.usedSpell = false;
  }
  render();
}

async function applyAttack(caster, target, spellIndex) {
  const card = caster.spells.splice(spellIndex, 1)[0];
  caster.usedSpell = true;
  const defenceIndex = target.spells.findIndex((spell) => spell.name === "Protego" || spell.name === "Finite Incantatem");
  if (defenceIndex >= 0) {
    const defence = target.spells.splice(defenceIndex, 1)[0];
    log(`${caster.name} casts ${card.name} on ${target.name}, but ${defence.name} blocks it.`);
    render();
    return;
  }

  if (card.name === "Expelliarmus" && target.spells.length) {
    const lost = target.spells.splice(Math.floor(Math.random() * target.spells.length), 1)[0];
    log(`${caster.name} casts Expelliarmus. ${target.name} loses ${lost.name}.`);
  } else if (card.name === "Petrificus Totalus") {
    target.skip = true;
    log(`${caster.name} casts Petrificus Totalus. ${target.name} will miss a turn.`);
  } else if (card.name === "Tarantallegra") {
    await animateMovePlayer(target, -3);
    log(`${caster.name} casts Tarantallegra. ${target.name} moves back 3 spaces.`);
  } else if (card.name === "Confundo") {
    target.confused = true;
    log(`${caster.name} casts Confundo. ${target.name}'s next roll is capped at 3.`);
  } else {
    log(`${caster.name} casts ${card.name}, but it fizzles.`);
  }
  render();
}

async function useItem(index) {
  const player = currentPlayer();
  if (state.animating) return;
  if (player.usedItem) return;
  const card = player.items.splice(index, 1)[0];
  player.usedItem = true;

  if (card.name === "Nimbus 2000") {
    player.doubleMove = true;
    log(`${player.name} readies Nimbus 2000. Next move is doubled.`);
  }
  if (card.name === "Chocolate Frog") {
    player.extraTurn = true;
    log(`${player.name} eats a Chocolate Frog and earns another turn.`);
  }
  if (card.name === "Felix Felicis") {
    const first = roll();
    const second = roll();
    const best = Math.max(first, second);
    player.rolled = true;
    els.die.textContent = best;
    await animateMovePlayer(player, best);
    log(`${player.name} uses Felix Felicis, rolls ${first} and ${second}, and moves ${best}.`);
    await resolveSpace(player);
    await checkWin(player);
  }
  if (card.name === "Golden Snitch") {
    await animateMovePlayer(player, 5);
    log(`${player.name} catches the Golden Snitch and moves forward 5 spaces.`);
    await resolveSpace(player);
    await checkWin(player);
  }
  if (card.name === "Invisibility Cloak") {
    player.items.push(card);
    player.usedItem = false;
    setMessage("The Invisibility Cloak can be used when a duel starts.", true);
  }
  render();
}

function checkWin(player) {
  if (player.position === spaces.length - 1 && player.spells.length >= 5) {
    state.gameOver = true;
    setMessage(`${player.name} reaches the Great Hall with 5 spell cards and becomes Wizard Duel Champion!`, true);
    log(`${player.name} wins the Wizard Duel tournament.`);
  } else if (player.position === spaces.length - 1) {
    setMessage(`${player.name} reached the Great Hall, but needs 5 spell cards to win.`, true);
  }
}

function endTurn() {
  if (state.gameOver) return;
  const player = currentPlayer();
  if (player.extraTurn) {
    player.extraTurn = false;
    player.rolled = false;
    player.usedSpell = false;
    player.usedItem = false;
    log(`${player.name} takes an extra turn.`);
    setMessage(`${player.name} gets another turn.`, true);
    render();
    return;
  }
  player.rolled = false;
  player.usedSpell = false;
  player.usedItem = false;
  state.current = (state.current + 1) % state.players.length;
  els.die.textContent = "-";
  setMessage(`${currentPlayer().name}, roll or use a card.`);
  render();
}

function reverseDirection() {
  const player = currentPlayer();
  if (state.gameOver || state.animating || state.duelActive || player.rolled) return;
  player.direction *= -1;
  setMessage(`${player.name} will move ${player.direction === 1 ? "forward" : "backward"} on this turn.`, true);
  log(`${player.name} chooses to move ${player.direction === 1 ? "forward" : "backward"}.`);
  render();
}

function choose(title, text, actions) {
  els.modalTitle.textContent = title;
  els.modalText.textContent = text;
  els.modalActions.innerHTML = "";
  actions.forEach((item) => {
    const button = document.createElement("button");
    button.className = "primary";
    button.textContent = item.label;
    button.addEventListener("click", () => {
      els.modal.classList.add("hidden");
      item.action();
    });
    els.modalActions.appendChild(button);
  });
  els.modal.classList.remove("hidden");
}

function showDuelPanel(title, text, actions) {
  if (state) state.duelActive = true;
  els.duelTitle.textContent = title;
  els.duelText.textContent = text;
  els.duelActions.innerHTML = "";
  actions.forEach((item) => {
    const button = document.createElement("button");
    button.className = "primary";
    button.textContent = item.label;
    button.addEventListener("click", () => item.action());
    els.duelActions.appendChild(button);
  });
  els.duelPanel.classList.remove("hidden");
}

function hideDuelPanel() {
  if (state) state.duelActive = false;
  els.duelPanel.classList.add("hidden");
  els.duelActions.innerHTML = "";
}

function showTab(name) {
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.tab === name));
  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.add("hidden"));
  document.getElementById(`${name}Panel`).classList.remove("hidden");
}

els.startGame.addEventListener("click", startGame);
els.newGame.addEventListener("click", () => location.reload());
els.playerCount.addEventListener("change", renderNameFields);
els.reverseDirection.addEventListener("click", reverseDirection);
els.rollDice.addEventListener("click", rollDice);
els.endTurn.addEventListener("click", endTurn);
els.cards.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-card]");
  if (!button) return;
  const index = Number(button.dataset.card);
  if (button.dataset.bucket === "spell") castSpell(index);
  if (button.dataset.bucket === "item") useItem(index);
});
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => showTab(tab.dataset.tab));
});

renderStaticBoard();
renderNameFields();

function renderStaticBoard() {
  els.board.innerHTML = spaces
    .map(([name, type, label, icon], index) => `
      <article class="space space--${type}" data-num="${index}">
        <div>
          <div class="space__icon">${icon}</div>
          <div class="space__name">${name}</div>
        </div>
        <div>
          <div class="tokens"></div>
          <div class="space__type">${label}</div>
        </div>
      </article>
    `)
    .join("");
}
