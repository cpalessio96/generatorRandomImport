const fs = require("fs");
const { Parser } = require("json2csv");
const {
  randnBm,
  getNumberManagerByHierarchy,
  getManagerByLevel,
  getObjectUser,
  getDescCdc,
} = require("./helper");

const main = async () => {
  // variabili in ingresso
  const [debug, numberUsers, averageStructureUsers, maxHierarchyLevels] = process.argv.slice(2);

  const rootUserId = "Root_1";

  // TODO parametrizzare la creazione e il numero di cdc
  const descCdc3 = getDescCdc(20);
  const descCdc4 = getDescCdc(40);

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
  const objectUsers = getObjectUser(managersByLevel, allNumbersStructurerUser, descCdc3, descCdc4);
  const json2CsvParser = new Parser({
    fields: Object.keys(objectUsers[0]).map((item) => item),
  });
  const file = json2CsvParser.parse(objectUsers);
  fs.writeFileSync("result/generatorRandomImport.csv", file);
};

main();
