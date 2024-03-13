import java.util.HashMap;
import java.util.Map;

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
            System.out.println("Le statut de la machine" + nom + "a été mis à jour avec succès !");
        }else{
            System.out.println("Mise à jour du statut de la machine" + nom + " a échoué.");
        }
    }

    

    public static void main(String[] args){
        System.out.println("Bienvenue sur CaféCampus !\n");
        System.out.println("Prenez votre pause café sans stress avec Café Campus !\n");
        CafeMachine ensembleMachines = new CafeMachine();

        // Afficher les machines à café et leur statut
        System.out.println("Voici les machines à café et leurs statuts que nous mettons à votre disposition ! :\n");
        
        for (String nom: ensembleMachines.machines.keySet()){
            boolean statut = ensembleMachines.machines.get(nom);
            System.out.println(nom + " - Statut : " + (statut ? "En marche" : "Hors Service"));
        }
    }


}


