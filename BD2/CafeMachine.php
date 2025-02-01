<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CafeCampus</title>
    <style>
        body {
            background-color: #66003e; /* Violet */
            color: white;
            font-family: Arial, sans-serif;
            text-align: center;
        }

        h1, p {
            margin: 20px 0;
        }

        ul {
            list-style-type: none;
            padding: 0;
        }

        ul li {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <h1>Bienvenue sur CafeCampus !</h1>
    <p>Prenez votre pause café sans stress avec <span style="font-style: italic;">CafeCampus</span> !</p>
    
    <!-- Logo CafeCampus -->
    <img src="logo.png" alt="Logo CafeCampus" width="430" height="192">

    <?php
    // Déclaration des machines à café et de leur état (ajout de l'état "En Réparation")
    $machines = array(
        "moissan" => true,
        "lieudevie" => true,
        "puio" => true
    );

    // Traitement de la modification de l'état d'une machine
    if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["machine"]) && isset($_POST["action"])) {
        $machine = $_POST["machine"];
        $action = $_POST["action"];

        // Mettre à jour l'état de la machine
        if (array_key_exists($machine, $machines)) {
            // Nouvel état "En Réparation"
            if ($action == "repair") {
                $machines[$machine] = "En Réparation";
            } else {
                $machines[$machine] = ($action == "on");
            }
        }
    }
    ?>

    <!-- Affichage des machines disponibles avec leur état -->
    <h2>Machines à café disponibles :</h2>
    <ul>
        <?php foreach ($machines as $machine => $etat): ?>
            <li><?php echo ucfirst($machine); ?> - État : <?php echo ($etat === true) ? "En marche" : (($etat === false) ? "Hors service" : $etat); ?></li>
        <?php endforeach; ?>
    </ul>

    <!-- Formulaire pour modifier l'état d'une machine -->
    <h2>Modifier l'état d'une machine :</h2>
    <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
        <label for="machine">Machine :</label>
        <select name="machine" id="machine">
            <?php foreach ($machines as $machine => $etat): ?>
                <option value="<?php echo $machine; ?>"><?php echo ucfirst($machine); ?></option>
            <?php endforeach; ?>
        </select><br>
        <input type="radio" id="on" name="action" value="on" checked>
        <label for="on">En marche</label><br>
        <input type="radio" id="off" name="action" value="off">
        <label for="off">Hors service</label><br>
        <input type="radio" id="repair" name="action" value="repair">
        <label for="repair">En Réparation</label><br>
        <input type="submit" value="Modifier">
    </form>
</body>
</html>