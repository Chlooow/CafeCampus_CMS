import java.util.HashMap;
import java.util.Scanner;

public class CafeMachine {
    private static HashMap<String, Boolean> machines; //Ensemble des machines à café avec leur nom et leur état 

    public CafeMachine(){
        machines = new HashMap<>();
        machines.put("Moissan",true);
        machines.put("Lieu de Vie",true);
        machines.put("PUIO",true);
    }

    //Si une machine est déja repertoriée
    public boolean exists(String nom){
        if(machines.containsKey(nom)){
            return true;
        }else{
            return false;
        }
    }

    //Vérifier le statut d'une machine
    public boolean status(String nom){
        return machines.get(nom);
    }

    public void update(String nom, boolean statut){
        if(this.exists(nom)){
            machines.put(nom,statut);
            System.out.println("Le statut de la machine " + nom + " a ete mis a jour avec succes !");
        }else{
            System.out.println("Mise a jour du statut de la machine " + nom + " a echoue.");
        }
    }

    public void affichageMachine(){
        for (String nom: machines.keySet()){
            boolean statut = machines.get(nom);
            System.out.println(nom + " - Statut : " + (statut ? "En marche" : "Hors Service"));
        }
    }


    public static void main(String[] args){
        System.out.println("Bienvenue sur CafeCampus !\n");
        System.out.println("Prenez votre pause cafe sans stress avec Cafe Campus !\n");
        CafeMachine ensembleMachines = new CafeMachine();

        // Afficher les machines à café et leur statut
        System.out.println("Voici les machines a cafe et leurs statuts que nous mettons a votre disposition ! :\n");

        ensembleMachines.affichageMachine();

        Scanner sc = new Scanner(System.in);
        System.out.println("Souhaitez-vous modifier le statut d'une machine ?");
        boolean reponse = Boolean.parseBoolean(sc.nextLine());

        if (reponse == true) {
            Scanner sc1 = new Scanner(System.in);
            System.out.println("Quel machine voulez-vous modifier ?");
            int machine = Integer.parseInt(sc1.nextLine());
            switch (machine) {
                case 1:
                    if (ensembleMachines.status("Moissan") == true) {
                        ensembleMachines.update("Moissan", false);
                    } else {
                        ensembleMachines.update("Moissan", true);
                    }
                    break;
                case 2:
                    if (ensembleMachines.status("Lieu de Vie") == true) {
                        ensembleMachines.update("Lieu de Vie", false);
                    } else {
                        ensembleMachines.update("Lieu de Vie", true);
                    }
                    break;
                case 3:
                    if (ensembleMachines.status("PUIO") == true) {
                        ensembleMachines.update("PUIO", false);
                    } else {
                        ensembleMachines.update("PUIO", true);
                    }
                    break;

            }

            ensembleMachines.affichageMachine();

            Scanner sc2 = new Scanner(System.in);
            System.out.println("Voulez-vous modifier une autre machine ?");
            boolean reponse2 = Boolean.parseBoolean(sc2.nextLine());

            if (reponse2 == true) {
                Scanner sc3 = new Scanner(System.in);
                System.out.println("Quel machine voulez-vous modifier ?");
                int machine2 = Integer.parseInt(sc3.nextLine());
                switch (machine2) {
                    case 1:
                        if (ensembleMachines.status("Moissan") == true) {
                            ensembleMachines.update("Moissan", false);
                        } else {
                            ensembleMachines.update("Moissan", true);
                        }
                        break;
                    case 2:
                        if (ensembleMachines.status("Lieu de Vie") == true) {
                            ensembleMachines.update("Lieu de Vie", false);
                        } else {
                            ensembleMachines.update("Lieu de Vie", true);
                        }
                        break;
                    case 3:
                        if (ensembleMachines.status("PUIO") == true) {
                            ensembleMachines.update("PUIO", false);
                        } else {
                            ensembleMachines.update("PUIO", true);
                        }
                        break;

                }

                ensembleMachines.affichageMachine();

            }else{
                System.out.println("Merci, et a bientot sur CafeCampus");
            }
        }else{
                System.out.println("Merci, et a bientot sur CafeCampus");
            }
        }
    }




