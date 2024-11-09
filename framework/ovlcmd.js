let cmd = [];

function ovlcmd(obj, fonctions) {
    let cmd_info = obj; 

    // Vérifier si la commande existe déjà dans cmd
    const existeDeja = cmd.some(c => c.nom_cmd === cmd_info.nom_cmd);

    if (existeDeja) {
        console.warn(`La commande "${cmd_info.nom_cmd}" existe déjà et ne sera pas ajoutée à nouveau.`);
        return; // Éviter d'ajouter un doublon
    }

    // Valeurs par défaut
    cmd_info.classe = cmd_info.classe || "Autres";
    cmd_info.react = cmd_info.react || "🎐";
    cmd_info.desc = cmd_info.desc || "Aucune description";
    cmd_info.alias = cmd_info.alias || [];

    cmd_info.fonction = fonctions; 
    cmd.push(cmd_info); 
    return cmd_info; 
}

module.exports = { ovlcmd, Module: ovlcmd, cmd };
