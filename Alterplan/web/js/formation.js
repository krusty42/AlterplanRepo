/**
 * Created by void on 18/08/2017.
 * This file is part of Alterplan.
 *
 * Alterplan is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Alterplan is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with Alterplan. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Regroupe les méthodes pour intervenir dans le Json
 * @param formationJson Formation au format Json
 * @constructor
 */
function Formation(formationJson) {
    this.innerFormation = formationJson;
    var idSelectedModule = -1;

    /**
     * Enregistre le module sélectionné. Utilisé dans les autres méthodes comme module de référence.
     * @param idModule l'identifiant du module
     */
    this.selectModule = function (idModule) {
        idSelectedModule = idModule
    };

    this.getInnerFormation = function () {
        return this.innerFormation;
    };

    /**
     * Récupére les modules disponibles pour le module sélectionné.
     * @returns {*}
     */
    this.getModulesDisponibles = function () {
        return this.innerFormation['modules'][idSelectedModule]['modulesDisponibles'];
    };

    /**
     * Récupère les Groupes pour le modules sélectionné.
     * @returns {*}
     */
    this.getGroupesModules = function () {
        return this.innerFormation['modules'][idSelectedModule]['ordreModule']['groupes']
    };

    /**
     * Ajoute un groupe à la liste des groupes du module sélectionné.
     * @param groupe une instance de GroupeModule
     */
    this.addGroupe = function (groupe) {
        this.getGroupesModules()[groupe.identifiant] = groupe.toJson();
    };

    /**
     * Ajoute un Sous Groupe au Groupe du module sélectionné.
     * @param groupe Identifiant du groupe
     * @param sousGroupe instance de SousGroupe
     */
    this.addSousGroupeToGroupe = function (groupe, sousGroupe) {
        this.getGroupesModules()[groupe]
            .sousGroupes[sousGroupe.identifiant] = sousGroupe.toJson();
    };

    /**
     * Ajoute un Module au sous groupe du module sélectionné
     * @param sousGroupe Instance de SousGroupe
     * @param module Instance de Module
     */
    this.addModuleToSousGroupe = function (sousGroupe, module) {
        this.getGroupesModules()[sousGroupe.groupeParent].sousGroupes[sousGroupe.identifiant]
            .modules[module.identifiant] = module.toJson();
    };

    /**
     * Ajoute le module à la liste des modules disponibles du module sélectionné.
     * @param module instance de Module
     */
    this.addModuleDisponible = function (module) {
        this.getModulesDisponibles().push(module.toJson());
    };

    /**
     * Supprime un module de la liste des modules diponibles du module sélectionné.
     * @param module instance de Module
     */
    this.removeModuleDisponible = function (module) {
        var index = -1;
        var modules = this.innerFormation['modules'][idSelectedModule]['modulesDisponibles'];
        for (var i = 0, len = modules.length; i < len; i++) {
            if (parseInt(modules[i].idModule, 10) === parseInt(module.identifiant, 10)) {
                index = i;
                break;
            }
        }

        if (index > -1) {
           this.innerFormation['modules'][idSelectedModule]['modulesDisponibles'].splice(index, 1);
        }
    };

    /**
     * Supprime un module du Sous groupe
     * @param sousGroupe instance de SousGroupe
     * @param module instance de Module
     */
    this.removeModuleFromSousGroupe = function (sousGroupe, module) {
        if (module.identifiant in this.getGroupesModules()[sousGroupe.groupeParent]
                .sousGroupes[sousGroupe.identifiant].modules) {
            delete this.getGroupesModules()[sousGroupe.groupeParent]
                .sousGroupes[sousGroupe.identifiant].modules[module.identifiant];
        }
    };

    /**
     * Supprime un sous groupe d'un groupe.
     * @param sousGroupe instance de Sous groupe
     * @param groupe identifaint du Groupe
     */
    this.removeSousGroupe = function (sousGroupe, groupe) {
        if (sousGroupe.identifiant in this.getGroupesModules()[groupe].sousGroupes) {
            delete this.getGroupesModules()[groupe].sousGroupes[sousGroupe.identifiant];
        }
    };

    /**
     * Supprime un groupe
     * @param groupe identifiant du groupe
     */
    this.removeGroupe = function (groupe) {
        if (groupe in this.getGroupesModules()) {
            delete this.getGroupesModules()[groupe];
        }
    }
}
