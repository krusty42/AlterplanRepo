<?php
/**
 * Created by PhpStorm.
 * User: Ravet
 * Date: 06/08/2017
 * Time: 15:30
 *//*
This file is part of Alterplan. 
 
Alterplan is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. 
 
Alterplan is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details. 
 
You should have received a copy of the GNU Affero General Public License along with Alterplan. If not, see <http://www.gnu.org/licenses/>.
*/


namespace AppBundle\Repository;


use AppBundle\Entity\Entreprise;
use AppBundle\Entity\Stagiaire;
use AppBundle\Filtre\StagiaireParEntrepriseFiltre;
use Doctrine\ORM\EntityRepository;

class CalendrierRepository extends EntityRepository
{

}