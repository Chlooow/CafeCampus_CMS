<?php
$conn = oci_connect('username', 'password', 'localhost/XE');

if (!$conn) {
    $e = oci_error();
    die('Erreur de connexion : ' . $e['message']);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $mot_de_passe = $_POST['mot_de_passe'];

    $stmt = oci_parse($conn, 'BEGIN connexion_utilisateur(:email, :mdp, :resultat); END;');

    oci_bind_by_name($stmt, ':email', $email);
    oci_bind_by_name($stmt, ':mdp', $mot_de_passe);
    oci_bind_by_name($stmt, ':resultat', $resultat, 50); // 50 caractères max pour le message

    if (oci_execute($stmt)) {
        echo $resultat;
    } else {
        $e = oci_error($stmt);
        echo "Erreur lors de la connexion : " . $e['message'];
    }

    oci_free_statement($stmt);
    oci_close($conn);
}
?>
