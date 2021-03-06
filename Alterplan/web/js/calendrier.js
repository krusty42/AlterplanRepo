/**
 * Created by void on 12/09/2017.
 * This file is part of Alterplan.
 *
 * Alterplan is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Alterplan is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with Alterplan. If not, see <http://www.gnu.org/licenses/>.
 */
var Calendrier = function (jCalendrier) {
    var parsedPeriode = JSON.parse(jCalendrier.periode);
    var me = this;

    this.titre = jCalendrier.titre;
    this.nbHeures = jCalendrier.nbHeures;
    this.codeCalendrier = jCalendrier.codeCalendrier;
    this.periode = {'debut': JSON.parse(parsedPeriode.debut), 'fin': JSON.parse(parsedPeriode.fin)};
    this.formation = JSON.parse(jCalendrier.formation);
    this.contraintes = JSON.parse(jCalendrier.contraintes);

    this.keysModulesCalendrier = JSON.parse(jCalendrier.keysModulesCalendriers);


    var parsedMCP = JSON.parse(jCalendrier.modulesCalendrierPlaces);
    this.modulesCalendrierPlaces = Object.keys(parsedMCP).reduce(function (p1, p2) {
        p1[parsedMCP[p2].module.idModule + '-' + parsedMCP[p2].codeModuleCalendrier] = parsedMCP[p2];
        return p1;
    }, []);

    var parsedMCAP = JSON.parse(jCalendrier.modulesCalendrierAPlacer);
    this.modulesCalendrierAPlacer = Object.keys(parsedMCAP).reduce(function (p1, p2) {
        p1[parsedMCAP[p2].module.idModule + '-' + parsedMCAP[p2].codeModuleCalendrier] = parsedMCAP[p2];
        return p1;
    }, []);

    this.modules = Object.keys(this.modulesCalendrierAPlacer).reduce(function (p1, p2) {
        if (parseInt(me.modulesCalendrierAPlacer[p2].nbSemaines, 10)
            === parseInt(me.modulesCalendrierAPlacer[p2].module.nbSemaines, 10)) {
            p1[me.modulesCalendrierAPlacer[p2].module.idModule] = me.modulesCalendrierAPlacer[p2].module;
        }
        return p1;
    }, []);

    this.displayPlaceableElements = function () {
        var $container = $('#modules-planifiables-container');
        $container.empty();
        for (cle in this.modulesCalendrierAPlacer) {
            if (this.modulesCalendrierAPlacer.hasOwnProperty(cle)) {
                $container.append(getPlaceableRendering(this.modulesCalendrierAPlacer[cle]));
            }
        }
    };

    this.updateModules = function () {
        this.modules = Object.keys(this.modulesCalendrierAPlacer).reduce(function (p1, p2) {
            if (parseInt(me.modulesCalendrierAPlacer[p2].nbSemaines, 10)
                === parseInt(me.modulesCalendrierAPlacer[p2].module.nbSemaines, 10)) {
                p1[me.modulesCalendrierAPlacer[p2].module.idModule] = me.modulesCalendrierAPlacer[p2].module;
            }
            return p1;
        }, [])
    };

    this.addModuleCalendrierAPlacer = function (jModuleCalendrier) {
        if (!jModuleCalendrier.hasOwnProperty('codeModuleCalendrier')) {
            var code = 0;
            for (cle in this.keysModulesCalendrier) {
                if (this.keysModulesCalendrier.hasOwnProperty(cle)) {
                    code = code < this.keysModulesCalendrier[cle] ? this.keysModulesCalendrier[cle] : code;
                }
            }
            jModuleCalendrier.codeModuleCalendrier = ++code;
            this.keysModulesCalendrier.push(code);
        }
        this.modulesCalendrierAPlacer[jModuleCalendrier.module.idModule + '-' + jModuleCalendrier.codeModuleCalendrier] = jModuleCalendrier;
        this.updateModules();
        return jModuleCalendrier;
    };

    this.addModuleCalendrierPlace = function (jModuleCalendrier) {
        if (!jModuleCalendrier.hasOwnProperty('codeModuleCalendrier')) {
            var code = 0;
            for (cle in this.keysModulesCalendrier) {
                if (this.keysModulesCalendrier.hasOwnProperty(cle)) {
                    code = code < this.keysModulesCalendrier[cle] ? this.keysModulesCalendrier[cle] : code;
                }
            }
            jModuleCalendrier.codeModuleCalendrier = ++code;
            this.keysModulesCalendrier.push(code);
        }

        this.modulesCalendrierPlaces[jModuleCalendrier.module.idModule + '-' + jModuleCalendrier.codeModuleCalendrier] = jModuleCalendrier;
        if (this.modulesCalendrierAPlacer.hasOwnProperty(jModuleCalendrier.module.idModule + '-' + jModuleCalendrier.codeModuleCalendrier)) {
            delete this.modulesCalendrierAPlacer[jModuleCalendrier.module.idModule + '-' + jModuleCalendrier.codeModuleCalendrier];
        }
        this.updateModules();
        this.updateNbHeures();
        return jModuleCalendrier;
    };

    this.removeModulePlace = function (identifiant) {
        if (this.modulesCalendrierPlaces.hasOwnProperty(identifiant)) {
            this.modulesCalendrierPlaces[identifiant].dateDebut = null;
            this.modulesCalendrierPlaces[identifiant].dateFin = null;
            this.addModuleCalendrierAPlacer(this.modulesCalendrierPlaces[identifiant]);
            delete this.modulesCalendrierPlaces[identifiant];
            verifContraintes();
            this.updateNbHeures();
        }
    };

    this.updateNbHeures = function () {
        this.nbHeures = 0;
        for (cle in this.modulesCalendrierPlaces) {
            if (this.modulesCalendrierPlaces.hasOwnProperty(cle)) {
                this.nbHeures += this.modulesCalendrierPlaces[cle].nbHeures
            }
        }
        $('#nb-heures').text(this.nbHeures);
    };

    this.toJSON = function () {
        return {
            codeCalendrier: this.codeCalendrier,
            titre: this.titre,
            nbHeures: this.nbHeures,
            formation: JSON.stringify(this.formation),
            contraintes: JSON.stringify(this.contraintes),
            modulesPlaces: JSON.stringify(Object.keys(this.modulesCalendrierPlaces).reduce(function (p1, p2) {
                p1[me.modulesCalendrierPlaces[p2].codeModuleCalendrier] = me.modulesCalendrierPlaces[p2];
                return p1;
            }, [])),
            modulesAPlacer: JSON.stringify(Object.keys(this.modulesCalendrierAPlacer).reduce(function (p1, p2) {
                p1[me.modulesCalendrierAPlacer[p2].codeModuleCalendrier] = me.modulesCalendrierAPlacer[p2];
                return p1;
            }, []))
        };
    };
};

function displayPlacedElements(calendrier, isAdmin) {
    var $container = $('#calnendar-body');
    var temp = Object.keys(calendrier.modulesCalendrierPlaces).reduce(function (p1, p2) {
        p1[calendrier.modulesCalendrierPlaces[p2].codeModuleCalendrier] = calendrier.modulesCalendrierPlaces[p2];
        return p1;
    }, []);
    var sorted = temp.sort(sortModulesByDate);

    for (cle in sorted) {
        if (sorted.hasOwnProperty(cle)) {
            $container.append(getPlacedRendering(sorted[cle], isAdmin));
        }
    }
    insertEntreprise();
}

function getPlaceableRendering(jPlaceable) {
    var div = $(document.createElement('div'));
    div.attr('id', jPlaceable.module.idModule + '-' + jPlaceable.codeModuleCalendrier);
    div.data('placeable', jPlaceable);
    div.addClass('flow-text card-panel module clickable');
    div.click(function () {
        selectPlaceable($(this));
    });

    var span = $(document.createElement('span'));
    span.text(jPlaceable.libelle);
    div.append(span);

    return div;
}

function getPlacedRendering(jPlaced, isAdmin) {
    var ligne = $('#module-template').children().clone();
    ligne.removeClass('template');
    ligne.find('span.date').text(getDateStr(new Date(jPlaced.dateDebut.date)) + ' - ' + getDateStr(new Date(jPlaced.dateFin.date)));
    var lieu = " - ";
    if (jPlaced.cours.hasOwnProperty('lieu')) {
        lieu = jPlaced.cours.lieu.libelle;
    }
    ligne.find('span.lieu').text(lieu);
    ligne.find('span.heures').text(jPlaced.nbHeures + ' H');
    ligne.find('span.programme').text(jPlaced.libelle);
    ligne.find('div.module-place').attr('id', jPlaced.module.idModule + '-' + jPlaced.codeModuleCalendrier);
    ligne.find('div.module-place').data('placeable', jPlaced);
    if (isAdmin) {
        ligne.find('div.module-place').click(function () {
            selectPlaceable($(this));
        });
    } else {
        ligne.find('div.module-place').toggleClass('clickable hoverable');
    }
    jPlaced.cours.dateDebut.date = new Date(jPlaced.dateDebut.date);
    jPlaced.cours.dateFin.date = new Date(jPlaced.dateFin.date);
    jPlaced.cours.nbHeures = jPlaced.nbHeures;
    ligne.data('cours', jPlaced.cours);

    return ligne;
}

function selectPlaceable(clickedElement) {
    var $element = $(clickedElement);
    if (!$element.hasClass('selected')) {
        showLoader();
        if ($element.hasClass('module-place')) {
            $element.parent().toggleClass('module-container');
        }

        $('.module.selected').removeClass('selected').addClass('clickable');
        $('.module-place.selected').removeClass('selected').addClass('clickable').parent().toggleClass('module-container');

        $element.removeClass('clickable').addClass('selected');
        var url = Routing.generate('cours_search', {
            idModule: $element.data('placeable').module.idModule,
            codeCalendrier: calendrier.codeCalendrier
        });

        $.get(url, function (data) {
            renderCours(data);
        }).always(function () {
            dismissLoader();
        });
    }
}

function renderCours(data) {
    var bodySelector = '#calnendar-body';
    $(bodySelector).find('.tr').not('.no-remove').remove();
    var coursManager = new CoursManager(data);
    for (idCour in coursManager.all) {
        if (coursManager.all.hasOwnProperty(idCour)) {
            coursManager.renderCour(coursManager.all[idCour], bodySelector);
        }
    }
}

function endEdit(e, defaultText) {
    var input = $(e.target),
        div = input && input.prev();

    div.find('span').text(input.val() === '' ? defaultText : input.val());
    calendrier.titre = input.val() === '' ? defaultText : input.val();
    input.hide();
    div.show();
}

function initTitleInput(defaultText) {
    $('.clickedit').hide()
        .focusout(defaultText, endEdit)
        .keyup(function (e) {
            if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                endEdit(e, defaultText);
                return false;
            } else {
                return true;
            }
        })
        .prev().click(function () {
        $(this).hide();
        $(this).next().show(function () {
            $(this).val(($(this).val() !== '' ? $(this).val() : defaultText));
            return $(this);
        }).focus();
    });
}

function saveModulesAPlanifier() {
    showLoader();
    closeModaleGestionModules();

    var added = [];
    var removed = [];

    var moduleCalendrierRemoved = Object.keys(calendrier.modulesCalendrierAPlacer).filter(function (t, number, ts) {
        return Object.keys(modulesManager.removedModules).indexOf(String(calendrier.modulesCalendrierAPlacer[t].module.idModule)) > -1;
    });

    for (cleMC in moduleCalendrierRemoved) {
        if (moduleCalendrierRemoved.hasOwnProperty(cleMC) &&
            calendrier.modulesCalendrierAPlacer.hasOwnProperty(moduleCalendrierRemoved[cleMC])) {
            removed.push(calendrier.modulesCalendrierAPlacer[moduleCalendrierRemoved[cleMC]].codeModuleCalendrier);
            delete calendrier.modulesCalendrierAPlacer[moduleCalendrierRemoved[cleMC]];
        }
    }

    for (addedKey in modulesManager.addedModules) {
        if (!calendrier.modules.hasOwnProperty(addedKey)) {

            var addedMC = calendrier.addModuleCalendrierAPlacer({
                codeCalendrier: calendrier.codeCalendrier,
                dateDebut: null,
                dateFin: null,
                libelle: modulesManager.addedModules[addedKey].libelle,
                module: modulesManager.addedModules[addedKey]
            });

            added.push(addedMC);
        }
    }

    calendrier.updateModules();

    //TODO : enregistrer avec les calendrier peut être?
    var data = {'addedModules': added, 'removedModules': removed};
    var url = Routing.generate('calendrier_edit', {codeCalendrier: calendrier.codeCalendrier});
    $.post(url, data);

    calendrier.displayPlaceableElements();
    dismissLoader();
}

function closeModaleGestionModules() {
    $("div[data-target='gestion-modules']").modal('close');
}


function saveContraintes() {
    showLoader();


    //plusieurs étapes:
    //1 : Pour chaque TR, on cherche la contrainte avec la même id et on lui passe les valeurs P1 et P2
    //2: pour chaque contrainte qui est nouvelle (présente dans addedContrainte) on passe l'id à null

    var invalidInputs = [];
    $('#tbl tr.trTable').each(function (i, row) {
        var $row = $(row);
        var codeContrainte = parseInt(this.id);
        var inputP1 = $row.find('input[name=val0]')[0];
        var rowP1 = inputP1.value;
        var inputP2 = $row.find('input[name=val1]')[0];
        var rowP2 = null;
        if (inputP2 != undefined) {
            rowP2 = inputP2.value;
        }
        if (rowP1 === "") {
            invalidInputs.push(inputP1);
        }
        if (rowP2 != null) {
            if (rowP2 === "") {
                invalidInputs.push(inputP2);
            }
        }
        if (rowP2 != null && inputP1.classList.contains('int')) {
            if (rowP1 > rowP2) {
                invalidInputs.push(inputP1);
                invalidInputs.push(inputP2);
            }
        }

        if (inputP1.id === 'rechercheStagiaire') {
            var nomPrenom = rowP1.split(" ");
            contraintesManager.stagiaires.forEach(function (stagiaire) {
                if (stagiaire.nom === nomPrenom[0] && stagiaire.prenom === nomPrenom[1]) {
                    rowP2 = stagiaire.codeStagiaire;
                }
            });

        }
        contraintesManager.contraintes.forEach(function (c) {
                if (c.codeContrainte === codeContrainte) {
                    c.P1 = rowP1;
                    if (rowP2 != null) {
                        c.P2 = rowP2;
                    }
                }
            }
        );
        i++;
    });
    if (invalidInputs.length != 0) {
        invalidInputs.forEach(function (input) {
            if (input.type.includes('hidden')) {
                var inputPicker = $(this).parent().find('input');
                inputPicker.className += 'invalid'
            }
            input.setCustomValidity("champ invalide (champ vide ou valeur erronée)")
            input.className += ' invalid';
        });
        dismissLoader();
        return;
    }
    var contraintesToSave = JSON.parse(JSON.stringify(contraintesManager.contraintes));
    contraintesManager.addedContraintes.forEach(function (newC) {
        //pour toutes les nouvelles contraintes on cherche l'équivalent dans la liste complète
        contraintesToSave.forEach(function (c) {
            if (c != null) {
                if (newC === c.codeContrainte) {
                    c.codeContrainte = null;
                    return;
                }
            }
        });
    });
    //modification de la date et enregistrement du calendrier.
    contraintesToSave.forEach(function (contrainte) {
        if (contrainte.typeContrainte.codeTypeContrainte === 1) {
            calendrier.periode.debut = contrainte.P1;
            calendrier.periode.fin = contrainte.P2;
            var saveUrl = Routing.generate('saveCalendrierDate', {codeCalendrier: calendrier.codeCalendrier});
            var saveData = {
                'dateDebut': calendrier.periode.debut,
                'dateFin': calendrier.periode.fin,
                'codeCalendrier': calendrier.codeCalendrier
            };
            $.post(saveUrl, saveData);
            return;
        }
    });


    var data = {
        'updatedContraintes': contraintesToSave,
        'removedContraintes': contraintesManager.removedContraintes
    };
    var url = Routing.generate('contraintes_edit', {codeCalendrier: calendrier.codeCalendrier});
    $.post(url, data);
    calendrier.contraintes = contraintesManager.contraintes;
    closeModaleGestionContraintes();
    verifContraintes();
    dismissLoader();
}

function closeModaleGestionContraintes() {
    $("div[data-target='contrainte']").modal('close');
}

function closeModaleInscrireCalendrier() {
    $("div[data-target='inscrire_calendrier']").modal('close');
}

function inscrireCalendrier() {
    showLoader();
    var url = Routing.generate('calendrier_inscrire', {codeCalendrier: calendrier.codeCalendrier});
    $.post(url).done(function () {
        showToast("Le calendrier a bien été inscrit", "success");
        $('#inscrireCalendrier').addClass('disabled');
    });
    closeModaleInscrireCalendrier();
    dismissLoader();
}

function verifContraintes() {

    //on commence par supprimer toutes les divs warning
    $(".contrainte").remove();
    var size = Object.keys(calendrier.modulesCalendrierPlaces).length;
    if (size > 0) {

        var firstModule = null;
        var lastModule = null;
        var nbHeuresFormation = 0;
        var nbSemainesFormationMax = null;
        var codeStagiaireNR = null;
        var modulesPlaces = calendrier.modulesCalendrierPlaces;
        for (cle in calendrier.modulesCalendrierPlaces) {
            if (calendrier.modulesCalendrierPlaces.hasOwnProperty(cle)) {
                var div_header = $('#' + cle)[0]
                var promotion = $(div_header).parents('.tr').data('cours').promotion;
                if (promotion) {
                    var isActive = promotion.isActive;
                    if (isActive === false) {
                        createDivContraite(div_header, '- Le module est placé sur un cours dont la promotion est obsolète.')
                    }
                }

                modulePlace = calendrier.modulesCalendrierPlaces[cle];
                nbHeuresFormation += modulePlace.nbHeures;
                if (firstModule != null && lastModule != null) {
                    if (modulePlace.dateDebut.date < firstModule.dateDebut.date) {
                        firstModule = calendrier.modulesCalendrierPlaces[cle];
                    }
                    if (modulePlace.dateDebut.date > lastModule.dateDebut.date) {
                        lastModule = calendrier.modulesCalendrierPlaces[cle];
                    }

                } else {
                    firstModule = calendrier.modulesCalendrierPlaces[cle];
                    lastModule = calendrier.modulesCalendrierPlaces[cle];
                }
            }
        }


        //1ère vérification: periode contractuelle
        if (calendrier.periode.debut > firstModule.dateDebut) {
            div_header = $('#calandar-hearder')[0];

            var divContrainte = createDivContraite(div_header, '- Le calendrier démarre avant  la période contractuelle qui débute le ' + calendrier.periode.debut);
        }
        if (calendrier.periode.fin < lastModule.dateFin) {
            div_header = $('#calandar-hearder')[0];
            var divContrainte = createDivContraite(div_header, ' - Le calendrier dépasse la période contractuelle qui finit le ' + calendrier.periode.fin);
        }
        //verif volume horaire
        for (cle in calendrier.contraintes) {
            if (calendrier.contraintes.hasOwnProperty(cle)) {
                var contrainte = calendrier.contraintes[cle];
                if (contrainte.typeContrainte.codeTypeContrainte === 2) {
                    if (nbHeuresFormation < contrainte.P1 || nbHeuresFormation > contrainte.p2) {
                        div_header = $('#calandar-hearder')[0];
                        var div_contrainte = createDivContraite(div_header, '- Le volume horaire actuel (' + nbHeuresFormation + 'h) ne convient pas (min: ' + contrainte.P1 + 'h, max: ' + contrainte.P2 + 'h)');
                        //div_header.append(div_contrainte);
                    }
                }
                //Ecart debut de formation
                if (contrainte.typeContrainte.codeTypeContrainte === 3) {
                    var date1 = new Date(firstModule.dateDebut.date);
                    var date2 = new Date(calendrier.periode.debut.date);
                    var diff = date1 - date2;
                    var semaines = Math.round(diff / 604800000);
                    if (semaines < contrainte.P1 || semaines > contrainte.P2) {
                        div_header = $('#calandar-hearder')[0]
                        var div_contrainte = createDivContraite(div_header, '- Ecart début de formation non valide: Actuel:' + semaines + ', min:' + contrainte.P1 + ', max:' + contrainte.P2);
                    }
                }
                //Ecart fin de formation
                if (contrainte.typeContrainte.codeTypeContrainte === 4) {
                    var date1 = new Date(calendrier.periode.fin.date);
                    var date2 = new Date(firstModule.dateFin.date);
                    var diff = date1 - date2;
                    var semaines = Math.round(diff / 604800000);
                    if (semaines < contrainte.P1 || semaines > contrainte.P2) {
                        div_header = $('#calandar-hearder')[0]
                        var div_contrainte = createDivContraite(div_header, '- Ecart fin de formation non valide: Actuel:' + semaines + ', min:' + contrainte.P1 + ', max:' + contrainte.P2);
                    }
                }
                if (contrainte.typeContrainte.codeTypeContrainte === 5) {
                    nbSemainesFormationMax = contrainte.P1;
                }
                if (contrainte.typeContrainte.codeTypeContrainte === 6) {
                    codeStagiaireNR = contrainte.P2;
                }
            }
        }

        //Semaines en formation Max
        //on classe les modules dans l'ordre dans lequel ils arrivent.
        // Si il y a moins de 7 jours entre les début des deux modules alors ils se suivent

        if (nbSemainesFormationMax != null) {
            var orderedModulesPlaces = calendrier.modulesCalendrierPlaces.sort(sortModulesByDate(a, b));
            var nbSemaines = 0;
            var previousModuleCalendrier = null;
            for (cle in orderedModulesPlaces) {
                if (orderedModulesPlaces.hasOwnProperty(cle)) {
                    var moduleCalendrier = orderedModulesPlaces[cle];
                    if (previousModuleCalendrier != null) {
                        var semaines = Math.round((dateFin - dateDebut) / 604800000);
                        if (!(semaines < 2)) {
                            nbSemaines = 0;
                        }
                        nbSemaines++;
                        if (nbSemaines > nbSemainesFormationMax) {
                            var div_header = $('#' + cle)[0]
                            var div_contrainte = createDivContraite(div_header, '- Nombre de semaines en formation dépassé (actuel:' + nbSemaines + ', max:' + nbSemainesFormationMax);

                        }
                    }
                    previousModuleCalendrier = moduleCalendrier;
                }
            }
        }

        //Non recouvrement
        if (codeStagiaireNR != null) {
            var calendrierNR = null;
            var url = Routing.generate('non_recouvrement');
            var data = {
                'codeStagiaire': codeStagiaireNR
            };
            $.get(url, data, function (data) {
                calendrierNR = data;
            })
            if (calendrierNR != null) {
                // on trie les deux listes (on ne prends que les modulesPlaces pour la deuxieme),
                //foreach sur la première
                // foreach sur la deuxième
                // Si dd1<dd2<df1 || dd1<df1<dd2 || dd2<dd1<df2 || dd2<df1<df2
                // alors on déclanche la contrainte pour le module de la liste 1
                var modulesPlaces = calendrier.modulesCalendrierPlaces.sort(sortModulesByDate(a, b));
                var modulesNR = calendrierNR.modulesCalendrier.filter(filtreByDate).sort(sortModulesByDate(a, b));
                for (cle in modulesPlaces) {
                    if (modulesPlaces.hasOwnProperty(cle)) {
                        var module = modulesPlaces[cle];
                        for (cle2 in modulesNR) {
                            if (modulesNR.hasOwnProperty(cle2)) {
                                var moduleNR = modulesNR[cle2];
                                if (module.dateDebut < moduleNR.dateDebut < module.dateFin ||
                                    module.dateDebut < moduleNR.dateFin < module.dateFin ||
                                    moduleNR.dateDebut < module.dateDebut < moduleNR.dateFin ||
                                    moduleNR.dateDebut < module.dateFin < moduleNR.dateFin) {
                                    div_header = $('#' + cle)[0]
                                    var div_contrainte = createDivContraite(div_header, '- Le stagiaire ' + contrainte.P1 + ' est lui aussi en formation pendant cette periode');
                                }
                            }
                        }
                    }
                }
            }
        }
        //gestion de l'ordre logique des modules

        {

            //pour chaque ordremodule
            for (cle in calendrier.formation.ordresModule) {
                if (calendrier.formation.ordresModule.hasOwnProperty(cle)) {
                    var ordreModule = calendrier.formation.ordresModule[cle];

                    //pour chaque moduleCalendrier placé
                    for (cleMCPlace in calendrier.modulesCalendrierPlaces) {
                        if (calendrier.modulesCalendrierPlaces.hasOwnProperty(cleMCPlace)) {
                            var mcPlace = calendrier.modulesCalendrierPlaces[cleMCPlace];
                            var txtCOL = '';
                            //si le calendrier placé correspond à l'ordre module
                            if (mcPlace.module.idModule === ordreModule.idModule) {
                                var tableModuleFail = [];
                                for (cleGroupe in ordreModule.groupes) {
                                    if (ordreModule.groupes.hasOwnProperty(cleGroupe)) {
                                        var groupe = ordreModule.groupes[cleGroupe];
                                        //maintenant qu'on a un groupe, on va faire une condition graces aux modules de ses 1 ou 2 sousgroupes
                                        var sousgroupe1 = null;
                                        var sousgroupe2 = null;
                                        var moduleFailGroupe = []
                                        var module1 = [];
                                        var module2 = [];
                                        var moduleCompare = null;
                                        var sg1Vide = true;
                                        var sg2Vide = true;
                                        for (i = 0; i < 10; i++) {
                                            moduleFailGroupe[i] = null;
                                            module1[i] = true;
                                            module2[i] = true;
                                        }
                                        //region sg1
                                        var i = 0;
                                        moduleCompare = null;
                                        if (groupe.sousGroupes != null) {
                                            for (var j in groupe.sousGroupes) {
                                                sousgroupe1 = groupe.sousGroupes[j];
                                                break;
                                            }
                                            if (sousgroupe1) {
                                                for (CleSG1 in sousgroupe1.modules) {
                                                    if (sousgroupe1.modules.hasOwnProperty(CleSG1)) {
                                                        var module = sousgroupe1.modules[CleSG1];
                                                        if (module !== null) {
                                                            for (cleCompare in calendrier.modulesCalendrierPlaces) {
                                                                if (calendrier.modulesCalendrierPlaces.hasOwnProperty(cleCompare)) {
                                                                    var moduletest = calendrier.modulesCalendrierPlaces[cleCompare];
                                                                    if (moduletest.module.idModule === module.idModule) {
                                                                        moduleCompare = moduletest;
                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                            if (moduleCompare) {
                                                                moduleFailGroupe[i] = (moduleCompare.libelle);
                                                                sg1Vide = false;
                                                                if (moduleCompare.dateDebut.date > mcPlace.dateDebut.date) {
                                                                    module1[i] = false;
                                                                } else {
                                                                    module1[i] = true;
                                                                }
                                                            }
                                                            else {
                                                                moduleFailGroupe[i] = null;
                                                                module1[i] = true;
                                                            }
                                                        }
                                                        else {
                                                            moduleFailGroupe[i] = null;
                                                            module1[i] = true;
                                                        }
                                                        i++;
                                                    }
                                                }
                                            }
                                        }
                                        //endregion
                                        i = 5;
                                        moduleCompare = null;
                                        //region sg2
                                        if (groupe.sousGroupes != null) {
                                            var sousgroupe2 = groupe.sousGroupes[Object.keys(groupe.sousGroupes)[Object.keys(groupe.sousGroupes).length - 1]];
                                            if (sousgroupe2 && sousgroupe2 != sousgroupe1) {
                                                for (CleSG2 in sousgroupe2.modules) {
                                                    if (sousgroupe2.modules.hasOwnProperty(CleSG2)) {
                                                        var module = sousgroupe2.modules[CleSG2];
                                                        if (module !== null) {
                                                            for (cleCompare in calendrier.modulesCalendrierPlaces) {
                                                                if (calendrier.modulesCalendrierPlaces.hasOwnProperty(cleCompare)) {
                                                                    var moduletest = calendrier.modulesCalendrierPlaces[cleCompare];
                                                                    if (moduletest.module.idModule === module.idModule) {
                                                                        moduleCompare = moduletest;
                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                            if (moduleCompare) {
                                                                moduleFailGroupe[i] = (moduleCompare.libelle);
                                                                sg2Vide = false;
                                                                if (moduleCompare.dateDebut.date > mcPlace.dateDebut.date) {
                                                                    module2[i] = false;
                                                                } else {
                                                                    module2[i] = true;
                                                                }
                                                            }
                                                            else {
                                                                moduleFailGroupe[i] = null;
                                                                module2[i] = true;
                                                            }
                                                        }
                                                    } else {
                                                        moduleFailGroupe[i] = null;
                                                        module2[i] = true;
                                                    }
                                                    i++;
                                                }
                                            }
                                        }
                                    }
                                    //endregion
                                    //on fait le if
                                    //si on a aucune valeur dans l'un des deux groupes, alors on fait un if que sur celui qui a de la valeur
                                    if (sg1Vide === false && sg2Vide === false) {
                                        if (((module1[0] && module1[1] && module1[2] && module1[3] && module1[4]) ||
                                                (module2[5] && module2[6] && module2[7] && module2[3] && module2[4])) === false) {
                                            // le groupe ne suit pas l'ordre logique --> on ajoutes les modules posant pb à la liste.
                                            tableModuleFail.push(moduleFailGroupe)
                                        }
                                    } else if (sg1Vide === false && sg2Vide === true) {
                                        if ((module1[0] && module1[1] && module1[2] && module1[3] && module1[4]) === false) {
                                            tableModuleFail.push(moduleFailGroupe);
                                        }
                                    } else if (sg1Vide === true && sg2Vide === false) {
                                        if ((module2[5] && module2[6] && module2[7] && module2[3] && module2[4]) === false) {
                                            tableModuleFail.push(moduleFailGroupe);
                                        }
                                    }
                                }

                                if (tableModuleFail) {
                                    for (i = 0; i < tableModuleFail.length; i++) {
                                        for (j = 0; j < 10; j++) {
                                            if (tableModuleFail[i][j] != null) {
                                                if (j != 0 && j != 5) {
                                                    txtCOL += "et " + tableModuleFail[i][j] + " ";
                                                } else if (j === 0) {
                                                    txtCOL += "- " + tableModuleFail[i][j] + " ";
                                                } else if (j === 5) {
                                                    txtCOL += "ou bien " + tableModuleFail[i][j] + " ";
                                                }
                                            }
                                        }
                                        txtCOL += "<br/>";
                                    }
                                    if (tableModuleFail.length > 0) {
                                        var div_header = $('#' + cleMCPlace)[0];
                                        var div_contrainte = createDivContraite(div_header, "L\'ordre logique des modules n\'est pas suivi: les modules suivant doivent PRÉCEDER ce module:" + '<br/>' + txtCOL);
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }

        $('.tooltipped').tooltip({delay: 50, html: true}).each(function () {
            var background = $(this).data('background-color');
            if (background) {
                $("#" + $(this).data('tooltip-id')).find(".backdrop").addClass(background);
            }
        });
    }
}

function sortModulesByDate(moduleA, moduleB) {
    var dateA = new Date(moduleA.dateDebut.date);
    var dateB = new Date(moduleB.dateDebut.date);
    if (dateA < dateB) {
        return -1;
    }
    if (dateA > dateB) {
        return 1;
    }
    return 0;
}

function filtreByDate(module) {
    if (module.dateDebut != null && module.dateFin != null) {
        return true;
    }
    return false;
}

function createDivContraite(parentDiv, tooltip) {
    if ($(parentDiv).find('.contrainte').length > 0) {
        warning = $(parentDiv).find('.warning');
        var textWarning = $(warning).attr('data-tooltip');
        $(warning).attr('data-tooltip', textWarning += '<br/>' + tooltip);
    } else {
        var div = document.createElement('div');
        $(div).addClass('contrainte');
        var warning = document.createElement('i');
        $(warning).addClass('material-icons ');
        $(warning).addClass('tooltipped');
        $(warning).addClass('warning');
        //$(warning).addClass('#ffab91 deep-orange lighten-3');
        $(warning).attr('data-position', 'bottom');
        $(warning).attr('data-tooltip', tooltip);
        $(warning).attr('data-background-color', '#ffab91 deep-orange lighten-3');
        $(warning).html('warning');
        $(div).append(warning);
        $(parentDiv).append(div);
        return div
    }

}

function findModuleById(modules, id) {

}

function saveCalendrier(calendrier) {
    showLoader();
    calendrier.titre = $('#titre_calendrier').find('span').text();
    var url = Routing.generate('calendrier_save', {codeCalendrier: calendrier.codeCalendrier});
    $.post(url, {'calendrier': calendrier.toJSON()}).done(function (data) {
        showToast('Les modifications ont été enregistrées');
    }).fail(function () {
        showToast('Echec de l\'enregistrement');
    }).always(function () {
        dismissLoader();
    });
}

function JoursFeries(an) {
    var JourAn = new Date(an, "00", "01");
    var FeteTravail = new Date(an, "04", "01");
    var Victoire1945 = new Date(an, "04", "08");
    var FeteNationale = new Date(an, "06", "14");
    var Assomption = new Date(an, "07", "15");
    var Toussaint = new Date(an, "10", "01");
    var Armistice = new Date(an, "10", "11");
    var Noel = new Date(an, "11", "25");
    //var SaintEtienne = new Date(an, "11", "26");

    var G = an % 19;
    var C = Math.floor(an / 100);
    var H = (C - Math.floor(C / 4) - Math.floor((8 * C + 13) / 25) + 19 * G + 15) % 30;
    var I = H - Math.floor(H / 28) * (1 - Math.floor(H / 28) * Math.floor(29 / (H + 1)) * Math.floor((21 - G) / 11));
    var J = (an * 1 + Math.floor(an / 4) + I + 2 - C + Math.floor(C / 4)) % 7;
    var L = I - J;
    var MoisPaques = 3 + Math.floor((L + 40) / 44);
    var JourPaques = L + 28 - 31 * Math.floor(MoisPaques / 4);
    var Paques = new Date(an, MoisPaques - 1, JourPaques);
    //var VendrediSaint = new Date(an, MoisPaques-1, JourPaques-2);
    var LundiPaques = new Date(an, MoisPaques - 1, JourPaques + 1);
    var Ascension = new Date(an, MoisPaques - 1, JourPaques + 39);
    var Pentecote = new Date(an, MoisPaques - 1, JourPaques + 49);
    var LundiPentecote = new Date(an, MoisPaques - 1, JourPaques + 50);

    //, VendrediSaint
    //, SaintEtienne
    return [JourAn, Paques, LundiPaques, FeteTravail, Victoire1945, Ascension, Pentecote, LundiPentecote, FeteNationale, Assomption, Toussaint, Armistice, Noel];
}
