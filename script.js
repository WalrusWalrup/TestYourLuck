const rollButton = document.getElementById("rollButton");
const resultDisplay = document.getElementById("result");
const dice = document.getElementById("dice");
const inventoryList = document.getElementById("inventoryList");

const rolls = [
    { chance: 1 / 2, name: "Really Common", rarity: "1/2" },
    { chance: 1 / 4, name: "Common", rarity: "1/4" },
    { chance: 1 / 5, name: "Uncommon", rarity: "1/5" },
    { chance: 1 / 8, name: "Rare", rarity: "1/8" },
    { chance: 1 / 10, name: "Very Rare", rarity: "1/10" },
    { chance: 1 / 15, name: "Super Rare", rarity: "1/15" },
    { chance: 1 / 25, name: "Ultra Rare", rarity: "1/25" },
    { chance: 1 / 50, name: "Legendary", rarity: "1/50" },
    { chance: 1 / 100, name: "Mythical", rarity: "1/100" },
    { chance: 1 / 200, name: "Impossible", rarity: "1/200" },
    { chance: 1 / 500, name: "Godlike", rarity: "1/500" },
    { chance: 1 / 1000, name: "Ethereal", rarity: "1/1000" },
    { chance: 1 / 10000, name: "One in a Million", rarity: "1/10000" }
];

const inventory = {};
let isRolling = false; // Cooldown flag
const cooldownTime = 2000; // 2 seconds cooldown

function rollDice() {
    const random = Math.random();
    let accumulatedChance = 0;

    for (const roll of rolls) {
        accumulatedChance += roll.chance;
        if (random < accumulatedChance) {
            return roll;
        }
    }
    return { name: "No Luck", rarity: "N/A" };
}

function addToInventory(item) {
    const key = `${item.name} (${item.rarity})`;
    if (inventory[key]) {
        inventory[key].count++;
    } else {
        inventory[key] = { name: item.name, rarity: item.rarity, count: 1 };
    }
    updateInventoryDisplay();
}

function updateInventoryDisplay() {
    inventoryList.innerHTML = "";

    // Sort inventory based on rarity defined in `rolls`
    const sortedKeys = Object.keys(inventory).sort((a, b) => {
        const indexA = rolls.findIndex((roll) => a.includes(roll.rarity));
        const indexB = rolls.findIndex((roll) => b.includes(roll.rarity));
        return indexA - indexB; // Sort by increasing rarity index
    });

    // Display inventory
    for (const key of sortedKeys) {
        const item = inventory[key];
        const listItem = document.createElement("li");
        listItem.textContent = item.count > 1 ? `${key} x${item.count}` : key;
        inventoryList.appendChild(listItem);
    }
}

rollButton.addEventListener("click", () => {
    if (isRolling) return; // Prevent rolling during cooldown

    isRolling = true;
    rollButton.disabled = true; // Disable button during cooldown
    resultDisplay.textContent = "Rolling...";

    // Animate dice
    dice.style.transform = "rotate(720deg)";
    setTimeout(() => {
        const roll = rollDice();
        dice.style.transform = "rotate(0deg)";
        resultDisplay.textContent = `You rolled: ${roll.name} (${roll.rarity})`;
        addToInventory(roll);

        // Cooldown reset
        setTimeout(() => {
            isRolling = false;
            rollButton.disabled = false;
        }, cooldownTime);
    }, 1000); // Animation duration
});
