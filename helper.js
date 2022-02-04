const { faker } = require("@faker-js/faker");

const getRandomNumber = (min, max) => Math.floor(
  Math.random() * (max - min + 1) + min,
);
/**
 * dati un minimo un massimo e un valore di skew da un valore random
 * se si chiedono molti valori, la curva assomiglierà sempre di più ad una gaussiana
 * avente media un valore intermedio tra minimo e massimo a seconda dello skew.
 * Se lo skew è 1 la media corrisponde alla media tra massimo e minimo.
 *
 * @param {Int} min
 * @param {Int} max
 * @param {Int} skew sposta la media verso il minimo o verso il massimo
 * @returns {Int} numero random
 */
const randnBm = (min, max, skew) => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) {
    num = randnBm(min, max, skew); // resample between 0 and 1 if out of range
  } else {
    num **= skew; // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
  }
  return Math.round(num);
};

/**
 * dato il numero desiderato di gerarchi, il numero di strutture e il massimo
 * dei manager permessi in un livello
 * costruisce in maniera random il numero dei capi (e quindi delle strutture)
 * per livello di gerarchia.
 *
 * @param {Int} hierarchyLevels numero livelli gerarchia desisderato
 * @param {Int} numStructures numero strutture costruite
 * @param {Int} maxManagersRaw numero grezzo massimo di manager in un livello
 * @returns {Array} array di numeri contenti il numero dei manager per livello (ordinati)
 */
const getNumberManagerByHierarchy = (hierarchyLevels, numStructures, maxManagersRaw) => {
  let offset = 2 - (hierarchyLevels / 6);
  let sumManager = 0;
  return [...Array(parseInt(hierarchyLevels, 10)).keys()]
    .map((item, index) => {
      if (parseInt(hierarchyLevels, 10) === index + 1) {
        return numStructures - sumManager;
      }
      const maxManagers = maxManagersRaw * offset;
      const minManagers = maxManagers - maxManagers * 0.7;
      const randomNumManagers = Math.round(randnBm(minManagers, maxManagers, 0.8));
      offset += 1;
      sumManager += randomNumManagers;
      return randomNumManagers;
    }).filter((item) => item > 0);
};

/**
 * Costruisce la gerarchi tra i manager in maniera random
 *
 * @param {Array} numberManagersForHierarchy lista numeri manager per livello di gerarchia
 * @param {Array} allManagersIds lista di tutti i manager id
 * @param {String} rootUserId
 */
const getManagerByLevel = (numberManagersForHierarchy, allManagersIds, rootUserId) => {
  let initArray = 0;
  let tempManagerUpLevel = [];
  return numberManagersForHierarchy.map((item, index) => {
    const currentLevelManagers = allManagersIds.slice(initArray, initArray + item);
    initArray += item;
    if (index === 0) {
      tempManagerUpLevel = currentLevelManagers.map(({ id }) => ({ id, boss: rootUserId }));
      return tempManagerUpLevel;
    }

    tempManagerUpLevel = currentLevelManagers.map(({ id }) => {
      const maxManagers = tempManagerUpLevel.length - 1;
      const minManagers = 0;
      const randomIndexManagers = getRandomNumber(minManagers, maxManagers);
      const manager = tempManagerUpLevel[`${randomIndexManagers}`];
      return { id, boss: manager.id };
    });
    return tempManagerUpLevel;
  }, []);
};

/**
 * Genera oggetto con tutti gli utenti e tutti i parametri
 * @param {Array} managersByLevel lista di livelli di gerarchia
 * @param {Array} allNumbersStructurerUser lista dei numeri di utenti di una struttura
 * @returns {Array} array di oggetti di utenti
 */
const getObjectUser = (managersByLevel, allNumbersStructurerUser, descCdc3, descCdc4) => {
  let idPerson = 1;
  return managersByLevel.map((level) => level.map(({ id, boss }) => {
    const userByStructure = [...Array(allNumbersStructurerUser[0] - 1).keys()].map(() => {
      const indexCdc3Random = getRandomNumber(0, descCdc3.length);
      const indexCdc4Random = getRandomNumber(0, descCdc4.length);
      const objectUser = {
        DESC_LEGAL: "generatorImportRandom",
        COGNOME: faker.name.lastName(),
        NOME: faker.name.firstName(),
        ID_PERSON: `Collab_${idPerson}`,
        EMAIL: faker.internet.exampleEmail(),
        DESC_CDC3: descCdc3[`${indexCdc3Random}`],
        DESC_CDC4: descCdc4[`${indexCdc4Random}`],
        CODICE_FISCALE: "XXXXXXX",
        STATO: "PAYROLL",
        RESPONSABILE_1: id,
        LANGUAGE: "it",
      };
      idPerson += 1;
      return objectUser;
    });
    allNumbersStructurerUser.shift();
    const indexCdc3Random = getRandomNumber(0, descCdc3.length);
    const indexCdc4Random = getRandomNumber(0, descCdc4.length);
    userByStructure.push({
      DESC_LEGAL: "generatorImportRandom",
      COGNOME: faker.name.lastName(),
      NOME: faker.name.firstName(),
      EMAIL: faker.internet.exampleEmail(),
      ID_PERSON: id,
      DESC_CDC3: descCdc3[`${indexCdc3Random}`],
      DESC_CDC4: descCdc4[`${indexCdc4Random}`],
      CODICE_FISCALE: "XXXXXXX",
      STATO: "PAYROLL",
      RESPONSABILE_1: boss,
      LANGUAGE: "it",
    });
    return userByStructure;
  })).flat(2);
};

const getDescCdc = (number) => [...Array(number).keys()].map(() => faker.name.jobTitle());

module.exports = {
  randnBm,
  getNumberManagerByHierarchy,
  getManagerByLevel,
  getObjectUser,
  getDescCdc,
};
