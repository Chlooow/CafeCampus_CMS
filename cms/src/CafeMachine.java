import java.util.HashMap;
import java.util.Scanner;

public class CafeMachine {
    private HashMap<String, Boolean> machines; //Ensemble des machines à café avec leur nom et leur état

    //pourquoi un static ?????
    public CafeMachine() {
        machines = new HashMap<>();
        machines.put("moissan", true);
        machines.put("lieudevie", true);
        machines.put("puio", true);
    }

    //Si une machine est déja repertoriée
    //Note Amine: fonction inutile, sinon tu pourrais la contracter comme ceci :
    public boolean exists(String nom) {
        return machines.containsKey(nom);
    }

    //Vérifier le statut d'une machine
    public boolean status(String nom) {
        return machines.get(nom);
    }

    public void update(String nom, boolean statut) {
        if (this.exists(nom)) {// pourquoi repasser par exist ? HashMap a une méthode contain...
            machines.put(nom, statut);
            System.out.println("Le statut de la machine " + nom + " a ete mis a jour avec succes !");
        } else {
            System.out.println("Mise a jour du statut de la machine " + nom + " a echoue.");
            // possiblement throw une error ?
        }
    }

    public void affichageMachine() {
        for (String nom : machines.keySet()) {
            boolean statut = machines.get(nom);
            System.out.println(nom + " - Statut : " + (statut ? "En marche" : "Hors Service"));
            //chatgpt ?
        }
    }


    public static void main(String[] args) {
        System.out.println("Bienvenue sur CafeCampus !\n");
        System.out.println("Prenez votre pause cafe sans stress avec Cafe Campus !\n");
        CafeMachine ensembleMachines = new CafeMachine();

        // Afficher les machines à café et leur statut
        System.out.println("Voici les machines a cafe et leurs statuts que nous mettons a votre disposition ! :\n");

        ensembleMachines.affichageMachine();

        Scanner sc = new Scanner(System.in);
        boolean reponse = true;
        while(true) {
            System.out.println("Souhaitez-vous modifier le statut d'une machine ? Entrez oui ou non");
            String oui_non = sc.nextLine().toLowerCase();
            if(oui_non.equals("non")){
                System.out.println("Ok bye");
                return;
            }

            Scanner sc1 = new Scanner(System.in);
            System.out.println("Quel machine voulez-vous modifier ?");
            String machine =sc1.nextLine().toLowerCase();
            if(!ensembleMachines.exists(machine)){
                System.out.println("Cette machine n'existe pas!");
            }
            if(ensembleMachines.exists(machine)) {
                ensembleMachines.update(machine, !ensembleMachines.status(machine));
                System.out.println(" \n");
                ensembleMachines.affichageMachine();
            }
        }
    }
}
