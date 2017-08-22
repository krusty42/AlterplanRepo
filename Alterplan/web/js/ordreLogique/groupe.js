/**
 * Created by void on 15/08/2017.
 * This file is part of Alterplan.
 *
 * Alterplan is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Alterplan is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with Alterplan. If not, see <http://www.gnu.org/licenses/>.
 */
var GroupeModuleProto = Object.create(HTMLDivElement.prototype);

GroupeModuleProto.createdCallback = function () {
    this.eventRemoved = document.createEvent('Event');
    this.sousGroupeAdded = document.createEvent('Event');
    this.sousGroupeRemoved = document.createEvent('Event');

    this.eventRemoved.initEvent('groupeRemoved', true, true);
    this.sousGroupeAdded.initEvent('sousGroupeAdded', true, true);
    this.sousGroupeRemoved.initEvent('sousGroupeRemoved', true, true);

    this.eventRemoved.data = [];
    this.eventRemoved.data['groupe'] = this;

    this.sousGroupeAdded.data = [];
    this.sousGroupeRemoved.data = [];

    this.className = 'card groupe blue lighten-5 valign-wrapper col s12';
    var container = new DraggableContainer();
    container.classList.add('valign-wrapper');
    this.appendChild(container);
    this.appendChild(new ButtonRemoveSousGroupe());
};

GroupeModuleProto.nbSousGroupes = 0;

Object.defineProperty(GroupeModuleProto, 'identifiant', {
    configurable: true,
    enumerable: true,
    get: function () {
        return this.id;
    },
    set: function (val) {
        this.id = val;
    }
});

Object.defineProperty(GroupeModuleProto, 'nbElements',{
    configurable: true,
    enumerable: true,
    get: function () {
        return this.nbSousGroupes;
    },
    set: function (val) {
        this.nbSousGroupes = val;
    }
});

GroupeModuleProto.addSousGroupe = function (sousGroupe) {
    var sousGroupes = this.getSousGroupes();
    var idSousGroupe = -1;
    for (var i = 0, len = sousGroupes.length; i < len; i++){
        var id = parseInt(sousGroupes[i].identifiant);
        if (id > idSousGroupe){
            idSousGroupe = id;
        }
    }

    sousGroupe.identifiant = ++idSousGroupe;
    sousGroupe.groupeParent = this;

    this.sousGroupeAdded.data['groupe'] = this;
    this.sousGroupeAdded.data['sousGroupe'] = sousGroupe;

    this.getDraggableContainer().appendChild(sousGroupe);
    this.nbElements = this.getSousGroupes().length;

    this.dispatchEvent(this.sousGroupeAdded);
};

GroupeModuleProto.removeSousGroupe = function (sousGroupe) {
    this.sousGroupeRemoved.data['groupe'] = this;
    this.sousGroupeRemoved.data['sousGroupe'] = sousGroupe;

    this.nbElements = this.getSousGroupes().length;
    this.dispatchEvent(this.sousGroupeRemoved);

    if (this.nbElements === 0){
        this.dispatchEvent(this.parentNode.removeChild(this).eventRemoved);
    }
};

GroupeModuleProto.getSousGroupes = function () {
    return this.getDraggableContainer().getElementsByTagName('sous-groupe');
};

GroupeModuleProto.getDraggableContainer = function () {
    return this.querySelector('#draggable-container');
};

GroupeModuleProto.toJson = function () {
    var result = {codeGroupeModule: this.identifiant, sousGroupes: []};

    var sousGroupes = this.getSousGroupes();
    for (var i = 0, len = sousGroupes.length; i < len; i++){
        result.sousGroupes.push(sousGroupes[i].toJson());
    }
    return result;
};

var GroupeModule = document.registerElement('groupe-module', {prototype: GroupeModuleProto});