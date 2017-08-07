<?php
/**
 * Created by PhpStorm.
 * User: Ravet
 * Date: 06/08/2017
 * Time: 11:27
 *//*
This file is part of Alterplan. 
 
Alterplan is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. 
 
Alterplan is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details. 
 
You should have received a copy of the GNU Affero General Public License along with Alterplan. If not, see <http://www.gnu.org/licenses/>.
*/


namespace AppBundle\Form\Filtre;


use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class StagiaireFiltreType extends AbstractType
{
    /**
     * @inheritdoc
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('nom',  EntityType::class, array(
                'class' => 'AppBundle:Stagiaire',
                'placeholder' => 'Nom du Stagiaire',
                'required' => false,
                'choice_label' => 'Nom')
            );

        $builder->add('prenom',  EntityType::class, array(
                'class' => 'AppBundle:Stagiaire',
                'placeholder' => 'Prénom du Stagiaire',
                'required' => false,
                'choice_label' => 'Prenom')
        );

        $builder->add('entreprise',  EntityType::class, array(
                'class' => 'AppBundle:Entreprise',
                'placeholder' => 'Raison social de l\'entreprise',
                'required' => false,
                'choice_label' => 'Entreprise')
        );
    }

    /**
     * @inheritdoc
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Filtre\StagiaireFiltre'
        ));
    }
}