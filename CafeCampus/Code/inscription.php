<?php
// Connexion à la base de données Oracle
$conn = oci_connect('username', 'password', 'localhost/XE'); // Adapte les infos de connexion

if (!$conn) {
    $e = oci_error();
    die('Erreur de connexion : ' . $e['message']);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nom_utilisateur = $_POST['nom_utilisateur'];
    $email = $_POST['email'];
    $mot_de_passe = $_POST['mot_de_passe'];

    $stmt = oci_parse($conn, 'BEGIN inscrire_utilisateur(:nom, :email, :mdp); END;');

    oci_bind_by_name($stmt, ':nom', $nom_utilisateur);
    oci_bind_by_name($stmt, ':email', $email);
    oci_bind_by_name($stmt, ':mdp', $mot_de_passe);

    if (oci_execute($stmt)) {
        echo "Inscription réussie !";
    } else {
        $e = oci_error($stmt);
        echo "Erreur lors de l'inscription : " . $e['message'];
    }

    oci_free_statement($stmt);
    oci_close($conn);
}
?>
