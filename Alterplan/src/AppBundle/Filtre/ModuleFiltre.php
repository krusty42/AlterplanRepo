<?php
/**
 * Created by PhpStorm.
 * User: void
 * Date: 06/09/2017
 * Time: 13:28
 *//*
This file is part of Alterplan. 
 
Alterplan is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. 
 
Alterplan is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details. 
 
You should have received a copy of the GNU Affero General Public License along with Alterplan. If not, see <http://www.gnu.org/licenses/>.
*/


namespace AppBundle\Filtre;


use AppBundle\Entity\Formation;
use AppBundle\Entity\Lieu;

class ModuleFiltre
{
    /**
     * @var string
     */
    private $titre;

    /**
     * @var Formation
     */
    private $formation;

    /**
     * @var Lieu
     */
    private $lieu;

    /**
     * @return string
     */
    public function getTitre()
    {
        return $this->titre;
    }

    /**
     * @param string $titre
     * @return ModuleFiltre
     */
    public function setTitre($titre)
    {
        $this->titre = $titre;
        return $this;
    }

    /**
     * @return Formation
     */
    public function getFormation()
    {
        return $this->formation;
    }

    /**
     * @param Formation $formation
     * @return ModuleFiltre
     */
    public function setFormation($formation)
    {
        $this->formation = $formation;
        return $this;
    }

    /**
     * @return Lieu
     */
    public function getLieu()
    {
        return $this->lieu;
    }

    /**
     * @param Lieu $lieu
     * @return ModuleFiltre
     */
    public function setLieu($lieu)
    {
        $this->lieu = $lieu;
        return $this;
    }
}