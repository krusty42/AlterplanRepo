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

var SousGroupeProto = Object.create(HTMLDivElement.prototype);

SousGroupeProto.createdCallback = function () {
    SousGroupe.identifiant = -1;
    SousGroupe.nbElements = 0;
    SousGroupe.groupeParent = -1;

    this.removedEvent = document.createEvent('Event');
    this.moduleRemovedEvent = document.createEvent('Event');
    this.moduleAddedEvent = document.createEvent('Event');

    this.removedEvent.initEvent('sousGroupeRemoved', true, true);
    this.moduleAddedEvent.initEvent('moduleAdded', true, true);
    this.moduleRemovedEvent.initEvent('moduleRemoved', true, true);

    this.removedEvent.data = [];
    this.removedEvent.data['sousGroupe'] = this;

    this.moduleAddedEvent.data = [];
    this.moduleRemovedEvent.data = [];

    //green lighten-5
    //light-blue lighten-4
    //deep-purple lighten-5
    this.className = 'card sous-groupe valign-wrapper col s12 light-blue lighten-5';
    this.appendChild(new DraggableContainer());
};

SousGroupeProto.addModule = function (module) {
    this.moduleAddedEvent.data['sousGroupe'] = this;
    this.moduleAddedEvent.data['module'] = module;

    var container = this.getDraggableContainer();
    container.appendChild(module);
    this.nbElements = container.getElementsByTagName('module-disponible').length;

    this.dispatchEvent(this.moduleAddedEvent);
};

SousGroupeProto.removeModule = function (module) {
    this.moduleRemovedEvent.data['sousGroupe'] = this;
    this.moduleRemovedEvent.data['module'] = module;
    this.removedEvent.data['groupe'] = this.groupeParent;

    this.nbElements = this.getModules().length;

    this.dispatchEvent(this.moduleRemovedEvent);

    if (this.nbElements === 0) {
        this.parentNode.parentNode.removeSousGroupe(this.parentNode.removeChild(this));
    }
};

SousGroupeProto.getModules = function () {
    return this.querySelector('#draggable-container').getElementsByTagName('module-disponible');
};

SousGroupeProto.getDraggableContainer = function () {
    return this.querySelector('#draggable-container');
};

SousGroupeProto.toJson = function () {
    var result = {codeSousGroupe: this.identifiant, modules: []};

    var modules = this.getModules();
    for (var i = 0, len = modules.length; i < len; i++){
        result.modules.push(modules[i].toJson());
    }

    return result;
};

var SousGroupe = document.registerElement('sous-groupe', {prototype: SousGroupeProto});
