<?php
/**
 * Created by PhpStorm.
 * User: void
 * Date: 31/10/2017
 * Time: 04:19
 *//*
This file is part of Alterplan. 
 
Alterplan is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. 
 
Alterplan is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details. 
 
You should have received a copy of the GNU Affero General Public License along with Alterplan. If not, see <http://www.gnu.org/licenses/>.
*/


namespace AppBundle\Repository;


use Doctrine\ORM\EntityRepository;

class ModuleCalendrierRepository extends EntityRepository
{
    public function delete($ids)
    {
        if ($ids) {
            $qb = $this->createQueryBuilder('mc');
            $qb->delete('AppBundle:ModuleCalendrier', 'mc')
                ->where('mc.codeModuleCalendrier IN (:codes)')
                ->setParameter('codes', $ids);
            $qb->getQuery()->execute();
        }
    }
}