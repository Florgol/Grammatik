

//Hier werden die Ausdrücke und Regeln gesammelt
//welche mit expand() generiert werden
var ausdruckListe = ["A"];
var regelListe = [];

//der jetzige Ausdruck
var ausdruck = "A";

//Hier wird eine maximale Rekursionstiefe
//festgelegt
var expansionCount = 0;
var maxExpansions = 5;

//ein Intervalobjekt, wichtig um die Animationsgeschwindigkeit 
//mit der Funktion setInterval() einzustellen
var interval;

//Input
var inpTime = 0;
var buttonAnimation;

//Wichtig für das Zeichnen der Tabelleneinträge
var counter = 0;
var tableHeight = 125;
var pauseTime = 1500;


//Die Grammatik Regeln 
//als 2-dimensionale Arrays in einem dictionary
var rules = {
  "A": [
    ["Z"],
    ["A", "O", "A"],
    ["(", "A", "O", "A", ")"]
  ],
  "O": [
    ["*"],
    ["+"],
    ["/"],
    ["-"]
  ],
  "Z": [
    ["0"],
    ["1"],
    ["2"],
    ["3"],
    ["4"],
    ["5"],
    ["6"],
    ["7"],
    ["8"],
    ["9"]
  ]
};

function setup() {
  createCanvas(1600, 500);
  background(220);

  //Inputfenster um die Animationsgeschwindigkeit einzustellen
  createP("Geben Sie die Animationsgeschwindigkeit ein (in Sek.):");
  createP("(Beispiel für Eingabe: 2)");
  inpTime = createInput();
  inpTime.changed(changePauseTime);

  //Button um die Animation zu starten
  buttonAnimation = createButton("Arithmetischen Ausdruck erzeugen");
  buttonAnimation.mousePressed(startAnimation);

  //Die Tabelle und die Regeln, werden initial einmal gedruckt
  drawTable();
  drawRules();
}


function draw() {

}

function startAnimation(){

  //Hier löschen wir die vorherigen Einträge
  //(überzeichnen sie)
  background(220);
  drawTable();
  drawRules();

  //Wir müssen alle verwendeten globalen Variablen
  //zurücksetzen
  tableHeight = 125;
  expansionCount = 0;
  maxExpansions = 5;
  ausdruck = "A";
  counter = 0;
  ausdruckListe = ["A"];
  regelListe = [];

  //Wir rufen expand() Funktion auf um
  //die Ausdruck -und die Regelliste zu generieren
  expand("A", []);
  console.log(ausdruckListe);
  console.log(regelListe);

  //Falls der User die Animationsgeschwindigkeit verändert hat,
  //ändern wir sie hier
  changePauseTime();
  
  //Hier wird die Animation gedruckt
  interval = setInterval(drawAnimation, pauseTime);
}



function changePauseTime() {
  if (inpTime.value() != ""){
    pauseTime = inpTime.value() *1000;
  }
}

function drawRules() {
  text("Folgede Grammatikregeln", 460, 125);
  text("werden verwendet:", 460, 140);
  text("A ->  Z | AOA | (AOA)", 460, 170);
  text("O ->  + | - | * | /", 460, 190);
  text("Z ->  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9", 460, 210);
}

function drawTable() {
  stroke(0,0,0);
  line(100, 100, 400, 100);
  line(280, 70, 280, 450);
  stroke(220);
  text("Überführungsregel", 290, 85);
  text("Ausdruck", 170, 85);
}





//Rekursive Funktion, welche Mathematische Ausdrücke
//und die Überführungsregeln generiert und in Listen speichert
function expand(start, expansion){

  //Wir rufen die Funktion nur auf, falls sich start als key 
  //in unserem dictionary rules befindet
  if (rules[start]){
    //Hier verhindern wir zu große Ausdrücke indem wir nach einer bestimmten 
    //Rekurstionstiefe immer die Regel A -> Z für A anwenden
    expansionCount++;
    if (expansionCount >= maxExpansions && start == "A"){
      regelListe.push(start + " -> Z");
      ausdruck = ausdruck.replace(start, "Z");
      ausdruckListe.push(ausdruck);
      expand("Z", expansion);
      return;}
    //Wir wählen zufällig ein Unterarray (von den Arrays "A", "O" oder "Z") aus
    //und vermerken die angewandte Regel in der regelListe
    var pick = random(rules[start]);
    regelListe.push(start + " -> " + pick.join(" "));

    //Unser Ausdruck wächst und verändert sich mit angewandten Regeln
    //Wir speichern jeden veränderten Ausdruck in der Ausdruckliste
    ausdruck = ausdruck.replace(start, pick.join(" "));
    ausdruckListe.push(ausdruck);

    //Falls wir ["A", "O", "A"] oder ["(", "A", "O", "A", ")"], expandieren wir
    //jedes Element
    for (var i = 0; i < pick.length; i++){
      expand(pick[i], expansion);
    }
  } else {
    //Falls start keiner der Ausdrücke "A", "O" oder "Z" ist,
    //fügen wir ihn der expansion zu
    expansion.push(start);
  }
  return;
}

//Hier zeichnen wir die Ausdrücke und Regeln zeilenweise
//auf die Canvas
//tableHeight hilft uns an die richtige Position zu zeichnen
//counter hilft uns zu identifizieren, ob wir die letzte, oder
//erste Zeile zeichnen
function drawAnimation(){

  //Die erste Zeile
  if (counter == 0){
    text(ausdruckListe[counter], 120, tableHeight);
    tableHeight = tableHeight + 15;
    counter++;
    return;
  }

  //Die letzte Zeile
  if (ausdruckListe.length == counter){

    text(ausdruckListe[counter], 120, tableHeight);
    clearInterval(interval);
    return;
  }

  text(ausdruckListe[counter], 120, tableHeight);
  text(regelListe[counter -1], 310, tableHeight);
  counter++;
  tableHeight = tableHeight + 15;
}






