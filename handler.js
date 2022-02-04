const fs = require("fs");
const {
  randnBm,
  getNumberManagerByHierarchy,
  getManagerByLevel,
  getObjectUser,
} = require("./helper");

const main = async () => {
  // variabili in ingresso
  const [debug, numberUsers, averageStructureUsers, maxHierarchyLevels] = process.argv.slice(2);

  const rootUserId = "Root_1";

  const numberStructure = Math.round(numberUsers / averageStructureUsers);

  const maxStructureUsers = parseInt(averageStructureUsers, 10)
  + parseInt(averageStructureUsers, 10) * 0.9;
  const minStructureUsers = averageStructureUsers - averageStructureUsers * 0.7;
  // array contente i numeri di collaboratori che deve avere ciascuna struttura
  const allNumbersStructurerUser = [...Array(numberStructure).keys()]
    .map(() => randnBm(minStructureUsers, maxStructureUsers, 1.2));
  if (debug) {
    const sum = allNumbersStructurerUser.reduce((accumulator, item) => accumulator + item, 0);
    const average = sum / allNumbersStructurerUser.length;
    // eslint-disable-next-line no-console
    console.log({ numberUsers, sum, average });
  }

  const allManagersIds = [...Array(numberStructure).keys()].map((item) => ({ id: `Manager_${item + 1}` }));

  // todo: da cambiare l'ultimo parametro,
  // da valutare se conviene passare il minimo valore dell'array.
  const numberManagersForHierarchy = getNumberManagerByHierarchy(
    maxHierarchyLevels,
    numberStructure,
    allNumbersStructurerUser[0],
  );

  if (debug) {
    // la gerarchia può essere minore di quella dichiarata,
    // qui abbiamo indicazione della gerarchi effettiva.
    const effectiveHierarchy = numberManagersForHierarchy.length;
    // eslint-disable-next-line no-console
    console.log({ effectiveHierarchy, numberManagersForHierarchy });
  }

  const managersByLevel = getManagerByLevel(numberManagersForHierarchy, allManagersIds, rootUserId);
  const objectUsers = getObjectUser(managersByLevel, allNumbersStructurerUser);
  fs.writeFileSync("result/users.json", JSON.stringify({ objectUsers }));
};

main();
