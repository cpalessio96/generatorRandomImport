# Generatore random csv per import utenti

L'app crea un csv random in base ai parametri passati, il csv contiene per utente i seguenti campi:
- DESC_LEGAL
- COGNOME
- NOME
- ID_PERSON
- DESC_CDC4
- CODICE_FISCALE
- STATO
- RESPONSABILE_1
- DESC_CDC3
- LANGUAGE

i parametri che accetta in input per customizzare l'import sono i seguenti:
- **debug** booleano, se settato a true attiva dei log
- **numberUsers** umero di utenti desiderato, il numero di utenti non sarà preciso
- **averageStructureUsers** media degli utenti in una struttura
- **maxHierarchyLevels** livelli di gerarchia massima, i livelli consigliati vanno da 1 a 6, la gerarchia non conta l'utente root, a parte casi rari la gerarchia
- **firstName** nome utente di cui si vogliono le utenze,
- **email** email utente
- **maxCollab** numeri collaborati massimi di cui si vuole un utenza
- **maxBoss** numeri boss massimi di cui si vuole un utenza

# Installazione

dopo aver clonato il repository eseguire
```npm install``
dopo l'installazione può essere eseguito l'handler passando i parametri indicati sopra

