/**
 * Created by void on 27/10/2017.
 * This file is part of Alterplan.
 *
 * Alterplan is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Alterplan is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with Alterplan. If not, see <http://www.gnu.org/licenses/>.
 */

var PlacementManager = function (calendrier) {

    var oldModuleClasses = 'flow-text card-panel module';
    var newModuleClasses = 'module-place center valign-wrapper hoverable bordered';
    var spanClasses = 'center-align col s12';
    var containerClasse = 'valign-wrapper';

    var me = this;
    this.calendar = calendrier;

    this.isContainer = function (el) {
        return ($(el).attr('id') === 'modules-planifiables-container') || $(el).hasClass('module-container');
    };

    this.moves = function (el, source, handle, sibling) {
        return $(el).hasClass('selected');
    };

    this.accepts = function (el, target, source, sibling) {
        return $(el).hasClass('selected');
    };

    this.onOver = function (el, container, source) {
        if ($(container).hasClass('module-container')) {
            $(el).removeClass(oldModuleClasses);
            $(el).addClass(newModuleClasses);
            $(el).find('span').addClass(spanClasses);
            $(container).removeClass(containerClasse).children().hide();
        } else {
            $(el).removeClass(newModuleClasses);
            $(el).addClass(oldModuleClasses);
            $(el).find('span').removeClass(spanClasses);
        }
        $('.module-container').each(function (index, obj) {
            if (container !== obj) {
                $(obj).addClass(containerClasse).children().show();
            }
        });
    };

    this.onDrop = function (el, target, source, sibling) {
        if (target !== source) {
            if ($(target).hasClass('module-container')) {
                elementDroped(el, target);
            } else {
                if ($(el).hasClass('semaine-module')) {
                    me.calendar.addSemaine($(el).data('semaine'));
                } else {
                    me.calendar.addModule($(el).data('module'));
                }
            }

            if ($(source).hasClass('module-container')) {
                transformerContainer(source);
                delete me.modulesPlaces[$(source).parents('.tr').data('cours').idCours];
            }
        }
    };

    var elementDroped = function (element, container) {
        transformerContainer(container);
        var nbHeuresModule = $(element).data('placeable').nbHeures;
        var nbHeuresCours = $(container).parents('.tr').data('cours').nbHeures;
        if (nbHeuresModule === nbHeuresCours) {

            $(element).data('placeable').dateDebut = $(container).parents('.tr').data('cours').dateDebut;
            $(element).data('placeable').dateFin = $(container).parents('.tr').data('cours').dateFin;
            me.calendar.addModuleCalendrierPlace($(element).data('placeable'));

        } else if (nbHeuresModule > nbHeuresCours) {

            var nbTotaleSemaines = $(element).data('placeable').module.nbSemaines;
            var nbSemainesRestante = Math.round((nbHeuresModule - nbHeuresCours) / 35);
            var nbSemainesPlaces = nbTotaleSemaines - nbSemainesRestante;

            $(element).data('placeable').dateDebut = $(container).parents('.tr').data('cours').dateDebut;
            $(element).data('placeable').dateFin = $(container).parents('.tr').data('cours').dateFin;
            $(element).data('placeable').nbHeures = nbHeuresCours;
            $(element).data('placeable').nbSemaines = nbSemainesPlaces;
            var s = [];
            for (var i = 1; i <= nbSemainesPlaces; i++) {
                s.push('S' + i);
            }
            $(element).data('placeable').libelle = $(element).data('placeable').module.libelle + ' (' + s.join(',') + ')';
            $(element).find('span').text($(element).data('placeable').libelle);
            me.calendar.addModuleCalendrierPlace($(element).data('placeable'));

            var sr = [];
            for (var j = 1; j <= nbSemainesRestante; j++) {
                sr.push('S' + (j + nbSemainesPlaces));
            }
            var mc = {
                codeCalendrier: me.calendar.codeCalendrier,
                dateDebut: null,
                dateFin: null,
                libelle: $(element).data('placeable').module.libelle + ' (' + sr.join(',') + ')',
                module: $(element).data('placeable').module,
                nbHeures: nbHeuresModule - nbHeuresCours,
                nbSemaines: nbSemainesRestante

            };
            var $container = $('#modules-planifiables-container');
            $container.append(getPlaceableRendering(me.calendar.addModuleCalendrierAPlacer(mc)));
        }

        $('.tr-cours').not('.no-remove').remove();
        $(element).removeClass('selected').addClass('clickable');
        $(element).parent().removeClass('module-container');
        insertEntreprise();
    };

    var transformerContainer = function (container) {
        $(container).parents('.tr').toggleClass('no-remove');
        $(container).parents('.tr').toggleClass('tr-cours');
        $(container).parents('.tr').toggleClass('tr-module');

        //TODO prendre en charge la bonne coloration
        $(container).parents('.tr').find('.indicateur').toggleClass('amber lighten-4');
        $(container).parent().toggleClass('cours');
        $(container).parent().toggleClass('module-planifie');
    };

    var insertEntreprise = function () {
        function pad(s) {
            return (s < 10) ? '0' + s : s;
        }

        function getEntreprise(periode, semaines) {
            var entrepriseTemplate = $('#entreprise-template').children();
            entrepriseTemplate.find("span.date").text(periode);
            entrepriseTemplate.find("span.semaines").text(semaines);
            return entrepriseTemplate.clone().removeClass('no-remove');
        }

        $('.tr-module').each(function (index, item) {
            var dateDebut = null;
            var dateFin = null;
            var strDateDebut;
            var strDateFin;
            var semaines;

            var prev = $(item).prev();
            if (prev.length > 0) {
                dateDebut = new Date($(prev).data('cours').dateFin.date);
                dateFin = new Date($(item).data('cours').dateDebut.date);
            } else {
                dateDebut = new Date(me.calendar.periode.debut.date);
                dateFin = new Date($(item).data('cours').dateDebut.date);
            }

            strDateDebut = [pad(dateDebut.getDate()), pad(dateDebut.getMonth() + 1), dateDebut.getFullYear()].join('/');
            strDateFin = [pad(dateFin.getDate()), pad(dateFin.getMonth() + 1), dateFin.getFullYear()].join('/');
            semaines = Math.round((dateFin - dateDebut) / 604800000);
            if (semaines > 0) {
                $(getEntreprise(strDateDebut + ' - ' + strDateFin, (semaines > 1 ? semaines + ' semaines' : semaines + ' semaines'))).insertBefore(item);
            }

            var next = $(item).next();
            if (next.length === 0) {
                dateDebut = new Date($(item).data('cours').dateFin.date);
                dateFin = new Date(me.calendar.periode.fin.date);
                strDateDebut = [pad(dateDebut.getDate()), pad(dateDebut.getMonth() + 1), dateDebut.getFullYear()].join('/');
                strDateFin = [pad(dateFin.getDate()), pad(dateFin.getMonth() + 1), dateFin.getFullYear()].join('/');
                semaines = Math.round((dateFin - dateDebut) / 604800000);
                if (semaines > 0) {
                    $(getEntreprise(strDateDebut + ' - ' + strDateFin, (semaines > 1 ? semaines + ' semaines' : semaines + ' semaines'))).insertAfter(item);
                }
            }
        });
    };
};

